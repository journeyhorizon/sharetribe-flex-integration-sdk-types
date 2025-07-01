# Example Usage Guide

This document provides practical examples of how to use the TypeScript types for the Sharetribe Flex Integration SDK with accurate entity/resource details.

## Basic Setup

```typescript
import * as sharetribeIntegrationSdk from "sharetribe-flex-integration-sdk";
import type {
  SdkConfig,
  MarketplaceResource,
  UserResource,
  ListingResource,
  TransactionResource,
  ExtendedData,
} from "sharetribe-flex-integration-sdk";

// Configure the SDK with full type safety
const config: SdkConfig = {
  clientId: process.env.SHARETRIBE_CLIENT_ID!,
  clientSecret: process.env.SHARETRIBE_CLIENT_SECRET!,
  baseUrl: "https://flex-integ-api.sharetribe.com",
  version: "v1",
  tokenStore: sharetribeIntegrationSdk.tokenStore.memoryStore(),
  queryLimiter: sharetribeIntegrationSdk.util.createRateLimiter(
    sharetribeIntegrationSdk.util.devQueryLimiterConfig
  ),
  commandLimiter: sharetribeIntegrationSdk.util.createRateLimiter(
    sharetribeIntegrationSdk.util.devCommandLimiterConfig
  ),
};

const sdk = sharetribeIntegrationSdk.createInstance(config);
```

## Working with SDK Types

### UUID Type

```typescript
import { UUID } from "sharetribe-flex-integration-sdk";

const listingId = new UUID("550e8400-e29b-41d4-a716-446655440000");
console.log(listingId.uuid); // string value
console.log(listingId._sdkType); // 'UUID'
```

### Money Type

```typescript
import { Money } from "sharetribe-flex-integration-sdk";

// $15.90 USD (amount is in cents/subunits)
const price = new Money(1590, "USD");
console.log(price.amount); // 1590
console.log(price.currency); // 'USD'

// €25.50 EUR
const euroPrice = new Money(2550, "EUR");

// ¥1000 JPY (no subunits)
const yenPrice = new Money(1000, "JPY");
```

### Geographic Types

```typescript
import { LatLng, LatLngBounds } from "sharetribe-flex-integration-sdk";

// Point location (latitude, longitude)
const newYork = new LatLng(40.64542, -74.08508);
console.log(newYork.lat); // 40.64542
console.log(newYork.lng); // -74.08508

// Bounding box for geographic area
const manhattanBounds = new LatLngBounds(
  new LatLng(40.8176, -73.9442), // Northeast corner
  new LatLng(40.7047, -74.0201) // Southwest corner
);
```

## API Operations with Detailed Resource Types

### Marketplace Operations

```typescript
async function getMarketplace(): Promise<MarketplaceResource> {
  try {
    const response = await sdk.marketplace.show();

    // Fully typed marketplace resource
    const marketplace: MarketplaceResource = response.data.data;
    console.log(`Marketplace: ${marketplace.attributes.name}`);
    console.log(`Description: ${marketplace.attributes.description}`); // may be null

    return marketplace;
  } catch (error) {
    const apiError = error as sharetribeIntegrationSdk.ApiError;
    console.error(`Error ${apiError.status}: ${apiError.statusText}`);
    throw error;
  }
}
```

### User Operations with Extended Data

```typescript
async function getUserWithProfile(userId: UUID): Promise<UserResource> {
  const response = await sdk.users.show(
    { id: userId },
    { include: ["profileImage"] }
  );

  const user: UserResource = response.data.data;

  // Access user attributes with type safety
  console.log(
    `User: ${user.attributes.profile.firstName} ${user.attributes.profile.lastName}`
  );
  console.log(`Email: ${user.attributes.email}`);
  console.log(`State: ${user.attributes.state}`); // 'active' | 'pendingApproval' | 'banned'
  console.log(`Created: ${user.attributes.createdAt.toISOString()}`);
  console.log(`Stripe Connected: ${user.attributes.stripeConnected}`);

  // Access extended data with proper typing
  const publicData: ExtendedData = user.attributes.profile.publicData;
  const age = publicData.age as number; // Custom field

  const protectedData: ExtendedData = user.attributes.profile.protectedData;
  const phoneNumber = protectedData.phoneNumber as string;

  // Access permissions
  const permissions = user.attributes.permissions;
  console.log(`Can post listings: ${permissions.postListings}`);
  console.log(`Can initiate transactions: ${permissions.initiateTransactions}`);

  return user;
}

async function updateUserProfile(userId: UUID) {
  const response = await sdk.users.updateProfile(
    {
      id: userId,
      firstName: "Alex",
      bio: "Updated bio information",
      publicData: {
        age: 28,
        location: "New York",
      },
      protectedData: {
        phoneNumber: "+1-202-555-4444",
      },
      metadata: {
        identityVerified: true,
        profileCompleted: true,
      },
    },
    { expand: true, include: ["profileImage"] }
  );

  return response.data.data;
}

async function queryUsers() {
  const response = await sdk.users.query({
    createdAtStart: new Date("2023-01-01").toISOString(),
    createdAtEnd: new Date("2023-12-31").toISOString(),
    pub_age: "25,35", // Users aged 25-35
    sort: "-createdAt",
  });

  const users: UserResource[] = response.data.data;
  return users;
}
```

### Listing Operations with Availability Plans

```typescript
async function createListingWithAvailability(
  authorId: UUID
): Promise<ListingResource> {
  const availability: AvailabilityPlan = {
    type: "availability-plan/day",
    entries: [
      { dayOfWeek: "mon", seats: 3 },
      { dayOfWeek: "tue", seats: 2 },
      { dayOfWeek: "wed", seats: 0 }, // unavailable
      { dayOfWeek: "thu", seats: 1 },
      { dayOfWeek: "fri", seats: 1 },
      { dayOfWeek: "sat", seats: 5 },
      { dayOfWeek: "sun", seats: 4 },
    ],
  };

  const response = await sdk.listings.create(
    {
      title: "Peugeot eT101 Electric Bike",
      authorId: authorId,
      state: "published",
      description: "7-speed Hybrid electric bike perfect for city commuting",
      geolocation: new LatLng(40.64542, -74.08508),
      price: new Money(1590, "USD"), // $15.90
      availabilityPlan: availability,
      publicData: {
        address: {
          city: "New York",
          country: "USA",
          state: "NY",
          street: "230 Hamilton Ave",
        },
        category: "road",
        gears: 22,
        rules: "This is a nice bike! Please be careful with it.",
      },
      privateData: {
        externalServiceId: "bike-service-id-1234",
      },
      metadata: {
        promoted: true,
        verified: true,
      },
    },
    { expand: true, include: ["images", "author"] }
  );

  const listing: ListingResource = response.data.data;
  console.log(`Created listing: ${listing.attributes.title}`);
  console.log(`State: ${listing.attributes.state}`); // 'published'
  console.log(
    `Price: ${listing.attributes.price?.amount} ${listing.attributes.price?.currency}`
  );

  return listing;
}

async function queryListingsWithFilters() {
  const response = await sdk.listings.query({
    authorId: new UUID("author-id"),
    states: ["published", "closed"],
    price: "1000,2000", // Between $10.00 and $20.00
    pub_category: "road,mountain", // Category filter
    pub_gears: "15,25", // Gears between 15-25
    origin: "40.64542,-74.08508", // Sort by distance from point
    bounds: "41.0,-73.0,40.0,-75.0", // Within bounding box
    availability: "day-full",
    start: new Date("2024-01-01").toISOString(),
    end: new Date("2024-01-07").toISOString(),
    seats: 2,
    include: ["author", "images"],
    sort: "price,-createdAt",
  });

  const listings: ListingResource[] = response.data.data;
  return listings;
}

async function updateListingAvailability(listingId: UUID) {
  // Create availability exception for specific dates
  await sdk.availabilityExceptions.create({
    listingId: listingId,
    seats: 0, // Unavailable on Christmas
    start: new Date("2024-12-25T00:00:00.000Z"),
    end: new Date("2024-12-26T00:00:00.000Z"),
  });

  // Update listing with new availability plan
  const timeBasedPlan: AvailabilityPlan = {
    type: "availability-plan/time",
    timezone: "America/New_York",
    entries: [
      {
        dayOfWeek: "mon",
        seats: 2,
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        dayOfWeek: "tue",
        seats: 3,
        startTime: "08:00",
        endTime: "18:00",
      },
    ],
  };

  await sdk.listings.update({
    id: listingId,
    availabilityPlan: timeBasedPlan,
  });
}
```

}

````

### Listing Operations
```typescript
async function manageListings() {
    const listingId = new UUID('listing-id-here');
    const price = new Money(15000, 'USD'); // $150.00
    const location = new LatLng(37.7749, -122.4194); // San Francisco

    // Create a new listing
    const createResponse = await sdk.listings.create({
        title: 'Vintage Bike',
        description: 'A beautiful vintage bicycle in excellent condition',
        price: price,
        geolocation: location,
        category: 'vehicles',
        listingType: 'sell'
    }, {
        include: ['author', 'images']
    }, {
        expand: true
    });

    // Query listings with filters
    const listingsResponse = await sdk.listings.query({
        perPage: 20,
        page: 1,
        include: ['author', 'images', 'currentStock'],
        'pub_category': 'vehicles',
        'pub_listingType': 'sell',
        price: `${price.amount} ${price.currency}`,
        bounds: manhattanBounds // from previous example
    });

    const listings = listingsResponse.data.data;
    const meta = listingsResponse.data.meta;

    console.log(`Found ${meta?.totalItems} listings`);

    // Update a listing
    await sdk.listings.update({
        id: listingId,
        title: 'Updated Vintage Bike',
        price: new Money(14000, 'USD') // $140.00
    });

    // Listing state management
    await sdk.listings.approve({ id: listingId });
    await sdk.listings.open({ id: listingId });
    await sdk.listings.close({ id: listingId });
}
````

### Transaction Operations

```typescript
async function manageTransactions() {
  const transactionId = new UUID("transaction-id-here");

  // Get transaction details
  const transactionResponse = await sdk.transactions.show({
    id: transactionId,
    include: ["customer", "provider", "listing"],
  });

  const transaction = transactionResponse.data.data;

  // Query transactions
  const transactionsResponse = await sdk.transactions.query({
    perPage: 10,
    filter_state: "payment-pending",
    include: ["customer", "provider", "listing"],
  });

  // Transition a transaction
  await sdk.transactions.transition({
    id: transactionId,
    transition: "transition/confirm-payment",
    params: {
      cardToken: "card-token-here",
    },
  });

  // Speculative transition (for testing)
  const speculativeResponse = await sdk.transactions.transitionSpeculative({
    id: transactionId,
    transition: "transition/confirm-payment",
    params: {
      cardToken: "test-card-token",
    },
  });

  // Update transaction metadata
  await sdk.transactions.updateMetadata({
    id: transactionId,
    metadata: {
      internalReference: "REF-12345",
      customerNote: "Special handling required",
    },
  });
}
```

### Transaction Operations with Line Items

```typescript
async function getTransactionDetails(
  transactionId: UUID
): Promise<TransactionResource> {
  const response = await sdk.transactions.show(
    { id: transactionId },
    {
      include: [
        "listing",
        "customer",
        "provider",
        "booking",
        "reviews",
        "customer.profileImage",
        "provider.profileImage",
      ],
    }
  );

  const transaction: TransactionResource = response.data.data;

  // Access transaction details with type safety
  console.log(`Transaction ${transaction.id.uuid}`);
  console.log(
    `Process: ${transaction.attributes.processName} v${transaction.attributes.processVersion}`
  );
  console.log(`State: ${transaction.attributes.state}`);
  console.log(`Last Transition: ${transaction.attributes.lastTransition}`);
  console.log(`Created: ${transaction.attributes.createdAt.toISOString()}`);

  // Access monetary totals
  const payinTotal = transaction.attributes.payinTotal;
  const payoutTotal = transaction.attributes.payoutTotal;
  console.log(`Customer pays: ${payinTotal.amount} ${payinTotal.currency}`);
  console.log(
    `Provider receives: ${payoutTotal.amount} ${payoutTotal.currency}`
  );

  // Process line items with detailed breakdown
  transaction.attributes.lineItems.forEach((lineItem) => {
    console.log(`Line Item: ${lineItem.code}`);
    console.log(
      `  Unit Price: ${lineItem.unitPrice.amount} ${lineItem.unitPrice.currency}`
    );
    console.log(
      `  Line Total: ${lineItem.lineTotal.amount} ${lineItem.lineTotal.currency}`
    );
    console.log(`  Quantity: ${lineItem.quantity || "N/A"}`);
    console.log(`  Units: ${lineItem.units || "N/A"}`);
    console.log(`  Seats: ${lineItem.seats || "N/A"}`);
    console.log(`  Percentage: ${lineItem.percentage || "N/A"}%`);
    console.log(`  Applies to: ${lineItem.includedFor.join(", ")}`);
    console.log(`  Is reversal: ${lineItem.reversal}`);
  });

  // Access transition history
  console.log("Transition History:");
  transaction.attributes.transitions.forEach((transition) => {
    console.log(
      `  ${transition.transition} by ${
        transition.by
      } at ${transition.createdAt.toISOString()}`
    );
  });

  return transaction;
}

async function processTransactionTransition(transactionId: UUID) {
  // Perform speculative transition to preview changes
  const speculativeResponse = await sdk.transactions.transitionSpeculative(
    {
      id: transactionId,
      transition: "transition/accept",
      params: {},
    },
    { expand: true }
  );

  console.log("Speculative transition preview:");
  console.log(
    "New state would be:",
    speculativeResponse.data.data.attributes.state
  );
  console.log(
    "New line items:",
    speculativeResponse.data.data.attributes.lineItems
  );

  // Actually perform the transition
  const actualResponse = await sdk.transactions.transition(
    {
      id: transactionId,
      transition: "transition/accept",
      params: {},
    },
    { expand: true }
  );

  return actualResponse.data.data;
}

async function queryTransactionsWithFilters() {
  const response = await sdk.transactions.query({
    createdAtStart: new Date("2024-01-01").toISOString(),
    createdAtEnd: new Date("2024-12-31").toISOString(),
    userId: new UUID("user-id"), // Either customer or provider
    lastTransitions: ["transition/request", "transition/accept"],
    states: ["state/pending", "state/accepted"],
    hasBooking: true,
    hasPayin: true,
    bookingStart: "2024-01-01T00:00:00.000Z,2024-12-31T23:59:59.999Z",
    prot_customField: "some-value", // Protected data filter
    meta_priority: "high", // Metadata filter
    sort: "-lastTransitionedAt,createdAt",
    include: ["listing", "customer", "provider", "booking"],
  });

  const transactions: TransactionResource[] = response.data.data;
  return transactions;
}
```

### File Upload

```typescript
async function uploadImage(file: File) {
  const uploadResponse = await sdk.images.upload({
    image: file,
  });

  const uploadedImage = uploadResponse.data.data;
  return uploadedImage;
}
```

### Stock Management

```typescript
async function manageStock() {
  const listingId = new UUID("listing-id-here");

  // Check current stock
  const stockResponse = await sdk.stockReservations.show({
    id: listingId,
  });

  // Create stock adjustment
  await sdk.stockAdjustments.create({
    listingId: listingId,
    quantity: 10,
  });

  // Compare and set stock atomically
  await sdk.stock.compareAndSet({
    listingId: listingId,
    oldTotal: 5,
    newTotal: 15,
  });

  // Query stock adjustments
  const adjustmentsResponse = await sdk.stockAdjustments.query({
    listingId: listingId,
    start: "2023-01-01T00:00:00.000Z",
    end: "2023-12-31T23:59:59.999Z",
    perPage: 50,
  });
}
```

### Stock Management

```typescript
async function manageListingStock(listingId: UUID) {
  // Set initial stock using compare-and-set
  const stockResponse = await sdk.stock.compareAndSet(
    {
      listingId: listingId,
      oldTotal: null, // No stock previously set
      newTotal: 10,
    },
    { expand: true }
  );

  console.log(`Stock set to: ${stockResponse.data.data.attributes.quantity}`);

  // Create stock adjustment
  const adjustmentResponse = await sdk.stockAdjustments.create(
    {
      listingId: listingId,
      quantity: 5, // Add 5 more items
    },
    {
      expand: true,
      include: ["listing.currentStock"],
    }
  );

  console.log(
    `Stock adjustment: +${adjustmentResponse.data.data.attributes.quantity}`
  );

  // Query stock adjustments history
  const adjustmentsResponse = await sdk.stockAdjustments.query({
    listingId: listingId,
    start: new Date("2024-01-01").toISOString(),
    end: new Date("2024-12-31").toISOString(),
  });

  adjustmentsResponse.data.data.forEach((adjustment) => {
    console.log(
      `Adjustment: ${
        adjustment.attributes.quantity
      } at ${adjustment.attributes.at.toISOString()}`
    );
  });
}

async function getStockReservation(
  reservationId: UUID
): Promise<StockReservationResource> {
  const response = await sdk.stockReservations.show(
    { id: reservationId },
    { include: ["listing", "transaction", "stockAdjustments"] }
  );

  const reservation = response.data.data;
  console.log(`Reservation: ${reservation.attributes.quantity} items`);
  console.log(`State: ${reservation.attributes.state}`);

  return reservation;
}
```

### Image Upload and Management

```typescript
async function uploadListingImages(): Promise<ImageResource> {
  // Upload image from file path
  const response = await sdk.images.upload(
    {
      image: "/path/to/bike-photo.jpg",
    },
    { expand: true }
  );

  const image: ImageResource = response.data.data;

  // Access different image variants
  const variants = image.attributes.variants;
  console.log("Available variants:");
  Object.keys(variants).forEach((variantName) => {
    const variant = variants[variantName];
    console.log(
      `  ${variant.name}: ${variant.width}x${variant.height} - ${variant.url}`
    );
  });

  // Access specific variants
  const defaultVariant = variants.default;
  const landscapeVariant = variants["landscape-crop"];
  const squareSmall = variants["square-small"];

  return image;
}

// Custom image variant example
async function getListingWithCustomImageVariant(listingId: UUID) {
  const response = await sdk.listings.show(
    { id: listingId },
    {
      include: ["images"],
      "fields.image": ["variants.square-small", "variants.my-custom-variant"],
      "imageVariant.my-custom-variant":
        sharetribeIntegrationSdk.util.objectQueryString({
          w: 320,
          h: 640,
          fit: "scale",
        }),
    }
  );

  return response.data.data;
}
```

### Event Monitoring

```typescript
async function monitorMarketplaceEvents(lastSequenceId?: number) {
  const queryParams: any = {
    perPage: 100,
  };

  if (lastSequenceId) {
    queryParams.startAfterSequenceId = lastSequenceId;
  }

  const response = await sdk.events.query(queryParams);
  const events: EventResource[] = response.data.data;

  events.forEach((event) => {
    console.log(
      `Event ${event.attributes.sequenceId}: ${event.attributes.eventType}`
    );
    console.log(
      `  Resource: ${event.attributes.resourceType} ${event.attributes.resourceId.uuid}`
    );
    console.log(`  Created: ${event.attributes.createdAt.toISOString()}`);
    console.log(`  Source: ${event.attributes.source}`);

    // Access audit data
    const audit = event.attributes.auditData;
    if (audit.userId) {
      console.log(`  Performed by user: ${audit.userId.uuid}`);
    }
    if (audit.clientId) {
      console.log(`  Client: ${audit.clientId.uuid}`);
    }

    // Access resource data
    if (event.attributes.resource) {
      console.log("  Current resource state:", event.attributes.resource);
    }

    // Access previous values for updated resources
    if (
      event.attributes.previousValues &&
      Object.keys(event.attributes.previousValues).length > 0
    ) {
      console.log("  Previous values:", event.attributes.previousValues);
    }
  });

  // Return the last sequence ID for next polling
  return events.length > 0
    ? events[events.length - 1].attributes.sequenceId
    : lastSequenceId;
}

// Filter events for specific resources
async function getEventsForListing(listingId: UUID) {
  const response = await sdk.events.query({
    relatedResourceId: listingId,
    eventTypes: ["listing/created", "listing/updated", "transaction"],
    createdAtStart: new Date("2024-01-01").toISOString(),
  });

  return response.data.data;
}
```

## Error Handling

```typescript
async function handleApiErrors() {
  try {
    const response = await sdk.listings.query({ perPage: 10 });
    return response.data.data;
  } catch (error) {
    // Type-safe error handling
    const apiError = error as sharetribeIntegrationSdk.ApiError;

    console.error(`HTTP ${apiError.status}: ${apiError.statusText}`);

    if (apiError.data?.errors) {
      apiError.data.errors.forEach((err) => {
        console.error(`Error Code: ${err.code}`);
        console.error(`Title: ${err.title}`);
        console.error(`Details:`, err.details);
      });
    }

    // Handle specific error types
    switch (apiError.status) {
      case 401:
        console.error("Authentication failed");
        break;
      case 403:
        console.error("Access forbidden");
        break;
      case 404:
        console.error("Resource not found");
        break;
      case 422:
        console.error("Validation failed");
        break;
      default:
        console.error("Unexpected error occurred");
    }

    throw error; // Re-throw if needed
  }
}
```

## Error Handling with Type Safety

```typescript
import type { ApiError } from "sharetribe-flex-integration-sdk";

async function robustApiCall() {
  try {
    const response = await sdk.users.show({ id: new UUID("invalid-id") });
    return response.data.data;
  } catch (error) {
    // Type-safe error handling
    const apiError = error as ApiError;

    console.error(`HTTP ${apiError.status}: ${apiError.statusText}`);

    if (apiError.data?.errors) {
      apiError.data.errors.forEach((err) => {
        console.error(`  Error ${err.status}: ${err.title}`);
        if (err.code) {
          console.error(`  Code: ${err.code}`);
        }
        if (err.details) {
          console.error(`  Details:`, err.details);
        }
      });
    }

    // Handle specific error codes
    switch (apiError.status) {
      case 400:
        console.error("Bad request - check your parameters");
        break;
      case 401:
        console.error("Unauthorized - check your credentials");
        break;
      case 403:
        console.error("Forbidden - insufficient permissions");
        break;
      case 404:
        console.error("Resource not found");
        break;
      case 409:
        console.error("Conflict - resource state issue");
        break;
      case 429:
        console.error("Rate limit exceeded - slow down your requests");
        break;
      default:
        console.error("Unexpected error occurred");
    }

    throw error;
  }
}
```

## Authentication

```typescript
async function checkAuthStatus() {
  // Get current authentication info
  const authInfo = await sdk.authInfo();

  console.log(`Grant Type: ${authInfo.grantType}`);
  console.log(`Is Anonymous: ${authInfo.isAnonymous}`);
  console.log(`Scopes: ${authInfo.scopes?.join(", ")}`);

  // Revoke current authentication
  await sdk.revoke();
}
```

## Custom Type Handlers

```typescript
// Define custom UUID type
class MyCustomUUID {
  constructor(public value: string) {}

  toString() {
    return this.value;
  }
}

// Create SDK with custom type handler
const customConfig: sharetribeIntegrationSdk.SdkConfig = {
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  typeHandlers: [
    {
      sdkType: sharetribeIntegrationSdk.UUID,
      appType: MyCustomUUID,
      reader: (uuid: sharetribeIntegrationSdk.UUID) =>
        new MyCustomUUID(uuid.uuid),
      writer: (customUuid: MyCustomUUID) =>
        new sharetribeIntegrationSdk.UUID(customUuid.value),
    },
  ],
};

const customSdk = sharetribeIntegrationSdk.createInstance(customConfig);
```

## Rate Limiting

```typescript
// Custom rate limiter configuration
const customRateLimiterConfig: sharetribeIntegrationSdk.RateLimiterConfig = {
  bucketInitial: 50, // Start with 50 requests
  bucketIncreaseInterval: 1000, // Add tokens every 1 second
  bucketIncreaseAmount: 2, // Add 2 tokens each time
  bucketMaximum: 100, // Maximum 100 tokens
};

const rateLimiter = sharetribeIntegrationSdk.util.createRateLimiter(
  customRateLimiterConfig
);

const configWithRateLimit: sharetribeIntegrationSdk.SdkConfig = {
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  queryLimiter: rateLimiter,
  commandLimiter: rateLimiter,
};
```

## Token Storage

```typescript
// Using file-based token storage
const fileTokenStore = sharetribeIntegrationSdk.tokenStore.fileStore(
  "./tokens/app-tokens.json"
);

// Using memory-based token storage (default)
const memoryTokenStore = sharetribeIntegrationSdk.tokenStore.memoryStore();

// Custom token store implementation
class DatabaseTokenStore implements sharetribeIntegrationSdk.TokenStore {
  async setToken(token: sharetribeIntegrationSdk.AuthToken): Promise<void> {
    // Save to database
    await database.tokens.save(token);
  }

  async getToken(): Promise<sharetribeIntegrationSdk.AuthToken> {
    // Load from database
    return await database.tokens.load();
  }

  async removeToken(): Promise<void> {
    // Remove from database
    await database.tokens.delete();
  }
}

const dbTokenStore = new DatabaseTokenStore();
```

## Utility Functions

```typescript
// Object to query string conversion
const filters = {
  category: "electronics",
  priceRange: [100, 500],
  inStock: true,
  tags: ["smartphone", "android"],
};

const queryString = sharetribeIntegrationSdk.util.objectQueryString(filters);
// Result: "category:electronics;priceRange:100,500;inStock:true;tags:smartphone,android"
```

## Advanced Utilities and Configuration

### Custom Token Store

```typescript
import type { TokenStore, AuthToken } from "sharetribe-flex-integration-sdk";

class DatabaseTokenStore implements TokenStore {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async setToken(token: AuthToken): Promise<void> {
    // Save token to database
    await this.saveToDatabase(this.userId, token);
  }

  async getToken(): Promise<AuthToken> {
    // Retrieve token from database
    return await this.loadFromDatabase(this.userId);
  }

  async removeToken(): Promise<void> {
    // Remove token from database
    await this.deleteFromDatabase(this.userId);
  }

  private async saveToDatabase(
    userId: string,
    token: AuthToken
  ): Promise<void> {
    // Implementation details...
  }

  private async loadFromDatabase(userId: string): Promise<AuthToken> {
    // Implementation details...
    return {} as AuthToken;
  }

  private async deleteFromDatabase(userId: string): Promise<void> {
    // Implementation details...
  }
}

// Use custom token store
const customConfig: SdkConfig = {
  clientId: process.env.SHARETRIBE_CLIENT_ID!,
  clientSecret: process.env.SHARETRIBE_CLIENT_SECRET!,
  tokenStore: new DatabaseTokenStore("user-123"),
};
```

### Custom Type Handlers

```typescript
import type { TypeHandler } from "sharetribe-flex-integration-sdk";

// Custom date type handler
const customDateHandler: TypeHandler<Date, string> = {
  sdkType: Date,
  canHandle: (value) => value instanceof Date,
  reader: (sdkValue: Date) => sdkValue.toISOString(),
  writer: (appValue: string) => new Date(appValue),
};

// Custom money formatter
const moneyFormatterHandler: TypeHandler<
  Money,
  { formatted: string; raw: Money }
> = {
  sdkType: Money,
  canHandle: (value) => value instanceof Money,
  reader: (sdkValue: Money) => ({
    formatted: `${(sdkValue.amount / 100).toFixed(2)} ${sdkValue.currency}`,
    raw: sdkValue,
  }),
  writer: (appValue) => appValue.raw,
};

const configWithHandlers: SdkConfig = {
  clientId: process.env.SHARETRIBE_CLIENT_ID!,
  clientSecret: process.env.SHARETRIBE_CLIENT_SECRET!,
  typeHandlers: [customDateHandler, moneyFormatterHandler],
};
```

### Rate Limiting Configuration

```typescript
import {
  createRateLimiter,
  devQueryLimiterConfig,
  prodQueryLimiterConfig,
} from "sharetribe-flex-integration-sdk";

// Custom rate limiter for high-volume operations
const customLimiterConfig = {
  bucketInitial: 50,
  bucketIncreaseInterval: 1000, // 1 second
  bucketIncreaseAmount: 10,
  bucketMaximum: 100,
};

const productionConfig: SdkConfig = {
  clientId: process.env.SHARETRIBE_CLIENT_ID!,
  clientSecret: process.env.SHARETRIBE_CLIENT_SECRET!,
  queryLimiter: createRateLimiter(prodQueryLimiterConfig),
  commandLimiter: createRateLimiter(customLimiterConfig),
};
```

### Pagination Helper

```typescript
async function getAllUsers(): Promise<UserResource[]> {
  const allUsers: UserResource[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await sdk.users.query({
      page: page,
      perPage: 100,
    });

    allUsers.push(...response.data.data);

    const meta = response.data.meta;
    if (meta) {
      hasMore = page < (meta.totalPages || 0);
      page++;
    } else {
      hasMore = false;
    }
  }

  return allUsers;
}
```

### Working with Sparse Attributes

```typescript
async function getListingOptimized(listingId: UUID) {
  // Only fetch specific attributes to reduce response size
  const response = await sdk.listings.show(
    { id: listingId },
    {
      "fields.listing": ["title", "price", "state", "publicData"],
      "fields.user": ["profile.firstName", "profile.lastName"],
      "fields.image": ["variants.square-small", "variants.my-custom-variant"],
      include: ["author", "images"],
    }
  );

  return response.data.data;
}
```

## Sparse Attributes - Optimizing API Responses

Sparse attributes allow you to request only specific fields from API responses, reducing payload size and improving performance. Use `fields.RESOURCE_TYPE` parameters to specify which attributes to return.

### Basic Sparse Attributes Usage

```typescript
// Request only specific user fields
async function getUserBasicInfo(userId: UUID): Promise<UserResource> {
  const response = await sdk.users.show({
    id: userId,
    "fields.user": ["profile.displayName", "profile.abbreviatedName", "email"],
  });

  const user: UserResource = response.data.data;

  // Only the requested fields will be present in the response
  console.log(`User: ${user.attributes.profile.displayName}`);
  console.log(`Email: ${user.attributes.email}`);
  // Other fields like createdAt, stripeConnected, etc. will not be included

  return user;
}

// Request only essential listing information
async function getListingSummary(listingId: UUID): Promise<ListingResource> {
  const response = await sdk.listings.show({
    id: listingId,
    "fields.listing": ["title", "price", "state"],
  });

  const listing: ListingResource = response.data.data;
  console.log(
    `${listing.attributes.title}: ${listing.attributes.price?.amount}`
  );

  return listing;
}
```

### Sparse Attributes with Related Resources

```typescript
// Request specific fields from listings and their authors
async function getListingsWithAuthors(): Promise<ListingResource[]> {
  const response = await sdk.listings.query({
    state: "published",
    "fields.listing": ["title", "description", "price", "createdAt"],
    "fields.user": ["profile.displayName", "profile.abbreviatedName"],
    "fields.image": ["variants.default"], // Only default image variant
    "limit.images": 2, // Limit to 2 images per listing
    include: ["author", "images"],
    perPage: 20,
  });

  const listings: ListingResource[] = response.data.data;

  listings.forEach((listing) => {
    console.log(`Listing: ${listing.attributes.title}`);
    console.log(
      `Price: ${listing.attributes.price?.amount} ${listing.attributes.price?.currency}`
    );

    // Access included author with sparse fields
    const authorRef = listing.relationships?.author?.data;
    if (authorRef && response.data.included) {
      const author = response.data.included.find(
        (item) => item.id === authorRef.id && item.type === "user"
      ) as UserResource;

      if (author) {
        console.log(`Author: ${author.attributes.profile.displayName}`);
      }
    }
  });

  return listings;
}
```

### Advanced Sparse Attributes for Complex Scenarios

```typescript
// Detailed transaction information with selective fields
async function getTransactionDetails(
  transactionId: UUID
): Promise<TransactionResource> {
  const response = await sdk.transactions.show({
    id: transactionId,
    "fields.transaction": [
      "lineItems",
      "payinTotal",
      "payoutTotal",
      "lastTransition",
      "state",
      "protectedData.paymentIntentId",
    ],
    "fields.listing": ["title", "price", "publicData.category"],
    "fields.user": ["profile.displayName", "profile.abbreviatedName"],
    "fields.booking": ["start", "end", "seats", "state"],
    "fields.message": ["content", "createdAt"],
    "limit.messages": 5, // Only last 5 messages
    "limit.reviews": 2, // Limit reviews
    include: [
      "listing",
      "customer",
      "provider",
      "booking",
      "messages",
      "customer.profileImage",
      "provider.profileImage",
    ],
  });

  const transaction: TransactionResource = response.data.data;

  console.log(`Transaction State: ${transaction.attributes.state}`);
  console.log(`Last Transition: ${transaction.attributes.lastTransition}`);
  console.log(`Payin Total: ${transaction.attributes.payinTotal.amount}`);
  console.log(`Payout Total: ${transaction.attributes.payoutTotal.amount}`);

  // Access line items with selective data
  transaction.attributes.lineItems.forEach((item) => {
    console.log(`Line Item: ${item.code} - ${item.lineTotal.amount}`);
  });

  return transaction;
}

// Image management with selective variants
async function getImageVariants(imageId: UUID): Promise<ImageResource> {
  const response = await sdk.images.show({
    id: imageId,
    "fields.image": [
      "variants.default",
      "variants.thumbnail",
      "variants.large",
    ],
  });

  const image: ImageResource = response.data.data;

  // Only requested variants will be available
  console.log(`Default variant: ${image.attributes.variants.default.url}`);

  if (image.attributes.variants.thumbnail) {
    console.log(`Thumbnail: ${image.attributes.variants.thumbnail.url}`);
  }

  return image;
}
```

### Nested Field Selection

```typescript
// Select nested fields using dot notation
async function getUserWithSelectiveProfile(
  userId: UUID
): Promise<UserResource> {
  const response = await sdk.users.show({
    id: userId,
    "fields.user": [
      "email",
      "emailVerified",
      "state",
      "profile.displayName",
      "profile.bio",
      "profile.publicData.phoneNumber",
      "profile.protectedData.emergencyContact",
      "permissions.postListings",
      "permissions.initiateTransactions",
    ],
  });

  const user: UserResource = response.data.data;

  console.log(`User: ${user.attributes.profile.displayName}`);
  console.log(
    `Email: ${user.attributes.email} (verified: ${user.attributes.emailVerified})`
  );
  console.log(`Bio: ${user.attributes.profile.bio}`);
  console.log(`Can post listings: ${user.attributes.permissions.postListings}`);

  // Access nested public data
  const phoneNumber = user.attributes.profile.publicData.phoneNumber as string;
  if (phoneNumber) {
    console.log(`Phone: ${phoneNumber}`);
  }

  return user;
}

// Query events with selective fields for performance
async function getFilteredEvents(): Promise<EventResource[]> {
  const response = await sdk.events.query({
    eventTypes: ["listing/created", "transaction/transition"],
    "fields.event": [
      "createdAt",
      "sequenceId",
      "eventType",
      "resourceId",
      "resourceType",
      "auditData.userId",
    ],
    perPage: 100,
  });

  const events: EventResource[] = response.data.data;

  events.forEach((event) => {
    console.log(
      `Event: ${event.attributes.eventType} at ${event.attributes.createdAt}`
    );
    console.log(
      `Resource: ${event.attributes.resourceType}/${event.attributes.resourceId}`
    );

    if (event.attributes.auditData.userId) {
      console.log(`User: ${event.attributes.auditData.userId}`);
    }
  });

  return events;
}
```

### Performance Best Practices with Sparse Attributes

```typescript
// Optimized listing search for mobile apps
async function getMobileListings(): Promise<ListingResource[]> {
  const response = await sdk.listings.query({
    origin: "40.7589,-73.9851", // New York coordinates
    radius: 10000, // 10km radius
    "fields.listing": [
      "title",
      "price",
      "geolocation",
      "publicData.category",
      "publicData.condition",
    ],
    "fields.user": ["profile.displayName"],
    "fields.image": ["variants.thumbnail"], // Only small images for mobile
    "limit.images": 1, // Only first image
    include: ["author", "images"],
    perPage: 50,
  });

  return response.data.data;
}

// Minimal data for listing cards
async function getListingCards(authorId?: UUID): Promise<ListingResource[]> {
  const queryParams: any = {
    "fields.listing": ["title", "price", "state", "publicData.category"],
    "fields.image": ["variants.default"],
    "limit.images": 1,
    include: ["images"],
    perPage: 24,
  };

  if (authorId) {
    queryParams.authorId = authorId;
  }

  const response = await sdk.listings.query(queryParams);
  return response.data.data;
}
```

### Command Operations with Sparse Attributes

```typescript
// Update listing and return specific fields
async function updateListingWithSparseResponse(
  listingId: UUID,
  updates: Partial<UpdateListingParams>
): Promise<ListingResource> {
  const response = await sdk.listings.update(
    {
      id: listingId,
      ...updates,
    },
    {
      expand: true, // Return full resource
      "fields.listing": ["title", "description", "price", "state", "createdAt"],
      "fields.user": ["profile.displayName"],
      include: ["author"],
    }
  );

  const listing: ListingResource = response.data.data;
  console.log(`Updated listing: ${listing.attributes.title}`);

  return listing;
}

// Create stock adjustment with minimal response
async function createStockAdjustmentMinimal(
  listingId: UUID,
  quantity: number
): Promise<StockAdjustmentResource> {
  const response = await sdk.stockAdjustments.create(
    {
      listingId,
      quantity,
    },
    {
      expand: true,
      "fields.stockAdjustment": ["quantity", "at"],
      "fields.listing": ["title"],
      include: ["listing"],
    }
  );

  return response.data.data;
}
```

**Key Benefits of Sparse Attributes:**

1. **Reduced Bandwidth**: Only requested fields are transmitted
2. **Faster Responses**: Smaller payloads mean quicker API responses
3. **Better Performance**: Less data processing on both client and server
4. **Selective Updates**: Request only the fields you need after mutations
5. **Mobile Optimization**: Perfect for mobile apps with limited bandwidth

**Best Practices:**

- Always request only the fields your application actually uses
- Use `limit.*` parameters to control included resource counts
- Combine with appropriate `include` parameters for related data
- Consider using different field sets for different UI contexts (list view vs. detail view)
- Test your sparse field selections to ensure all required data is available
