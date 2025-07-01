# TypeScript Types for Sharetribe Flex Integration SDK

This package provides TypeScript type definitions for the [Sharetribe Flex Integration SDK](https://github.com/sharetribe/flex-integration-sdk-js).

## Installation

```bash
npm install --save-dev @types/sharetribe-flex-integration-sdk
```

## Usage

The types will be automatically available when you import the SDK:

```typescript
import * as sharetribeIntegrationSdk from "sharetribe-flex-integration-sdk";

// Create SDK instance with type safety
const sdk = sharetribeIntegrationSdk.createInstance({
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
});

// All API methods are fully typed
const listings = await sdk.listings.query({ perPage: 10 });
const listing = await sdk.listings.show({
  id: new sharetribeIntegrationSdk.UUID("listing-id"),
});
```

## API Coverage

These types cover all the public API endpoints provided by the SDK:

### Resources

- **Marketplace**: `show`
- **Users**: `show`, `query`, `updateProfile`, `approve`, `updatePermissions`
- **Listings**: `show`, `query`, `create`, `update`, `approve`, `open`, `close`
- **Transactions**: `show`, `query`, `transition`, `transitionSpeculative`, `updateMetadata`
- **Images**: `upload`
- **Availability Exceptions**: `query`, `create`, `delete`
- **Events**: `query`
- **Stock Adjustments**: `query`, `create`
- **Stock**: `compareAndSet`
- **Stock Reservations**: `show`

### Types

- **UUID**: Universally unique identifier
- **LatLng**: Geographic coordinates
- **LatLngBounds**: Geographic bounding box
- **Money**: Currency amount representation
- **BigDecimal**: Arbitrary precision decimal numbers

### Utilities

- **Token Stores**: Memory and file-based token storage
- **Rate Limiters**: Request rate limiting configuration
- **Query String**: Object to query string serialization

## SDK Configuration

```typescript
import * as sharetribeIntegrationSdk from "sharetribe-flex-integration-sdk";

const config: sharetribeIntegrationSdk.SdkConfig = {
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  baseUrl: "https://flex-integ-api.sharetribe.com",
  tokenStore: sharetribeIntegrationSdk.tokenStore.memoryStore(),
  queryLimiter: sharetribeIntegrationSdk.util.createRateLimiter(
    sharetribeIntegrationSdk.util.devQueryLimiterConfig
  ),
};

const sdk = sharetribeIntegrationSdk.createInstance(config);
```

## Type Safety Features

- **Full API coverage**: All endpoints are typed with proper parameter and return types
- **SDK Types**: Native SDK types (UUID, Money, LatLng, etc.) with proper constructors
- **Response handling**: Typed response objects with data, meta, and included fields
- **Error handling**: Typed error responses for proper error handling
- **Configuration**: Full typing for SDK configuration options
- **Token management**: Typed token store interfaces
- **Rate limiting**: Typed rate limiter configuration

## Examples

### Working with Types

```typescript
import { UUID, Money, LatLng } from "sharetribe-flex-integration-sdk";

const listingId = new UUID("550e8400-e29b-41d4-a716-446655440000");
const price = new Money(5000, "USD"); // $50.00
const location = new LatLng(40.7128, -74.006); // New York City
```

### API Calls

```typescript
// Query listings with type safety
const response = await sdk.listings.query({
  perPage: 10,
  include: ["author", "images"],
});

// Response is fully typed
const listings = response.data.data; // ResourceObject[]
const meta = response.data.meta; // ResponseMeta | undefined
const included = response.data.included; // ResourceObject[] | undefined

// Create a new listing
await sdk.listings.create({
  title: "Amazing Product",
  description: "A great product for sale",
  price: new Money(2500, "USD"),
  location: new LatLng(37.7749, -122.4194),
});
```

### Error Handling

```typescript
try {
  const listing = await sdk.listings.show({ id: listingId });
} catch (error) {
  const apiError = error as sharetribeIntegrationSdk.ApiError;
  console.log(`Error ${apiError.status}: ${apiError.statusText}`);

  if (apiError.data?.errors) {
    apiError.data.errors.forEach((err) => {
      console.log(`Code: ${err.code}, Title: ${err.title}`);
    });
  }
}
```

## Contributing

If you find any issues with these type definitions or would like to contribute improvements, please open an issue or pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Related

- [Sharetribe Flex Integration SDK](https://github.com/sharetribe/flex-integration-sdk-js)
- [Sharetribe API Documentation](https://www.sharetribe.com/api-reference/)
- [TypeScript](https://www.typescriptlang.org/)
