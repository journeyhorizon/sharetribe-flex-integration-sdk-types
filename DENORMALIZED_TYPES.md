# Denormalized Data Types - Documentation

## Overview

Added comprehensive utility types for working with denormalized data in the Sharetribe Flex Integration SDK. The normalized API responses contain separate `data` and `included` arrays, but the denormalized types represent resources with their relationships resolved and embedded directly.

## Key Features

### 1. **Precise Return Type Matching**

The `DenormalizeFunction` now uses function overloads to provide precise return types based on input:

```typescript
// Single resource
ApiResponse<UserResource> → DenormalizedApiResponse<DenormalizedResource<UserResource>>

// Array resource
ApiResponse<ListingResource[]> → DenormalizedApiResponse<DenormalizedResource<ListingResource>[]>

// Paginated response
PaginatedResponse<TransactionResource> → DenormalizedPaginatedResponse<DenormalizedResource<TransactionResource>>
```

### 2. **Relationship Resolution**

Relationships are automatically resolved to full resource objects:

```typescript
// Normalized format (references)
user.relationships.marketplace = { data: { id: "123", type: "marketplace" } };

// Denormalized format (full resource)
user.relationships.marketplace = {
  id: "123",
  type: "marketplace",
  attributes: { name: "My Marketplace", description: null },
};
```

### 3. **Type Safety**

Full type safety for denormalized relationships:

```typescript
if (denormalizedUser.relationships?.marketplace) {
  // TypeScript knows this is MarketplaceResource, not a reference
  const name: string =
    denormalizedUser.relationships.marketplace.attributes.name;
}

if (denormalizedListing.relationships?.images) {
  // TypeScript knows this is ImageResource[], not references
  const urls = denormalizedListing.relationships.images.map(
    (img) => img.attributes.variants.default.url
  );
}
```

## Available Types

### Core Types

- `DenormalizedResource<T>` - Base denormalized resource type
- `DenormalizedApiResponse<T>` - Single resource response
- `DenormalizedPaginatedResponse<T>` - Paginated collection response

### Specific Resource Types

- `DenormalizedUserResource`
- `DenormalizedListingResource`
- `DenormalizedTransactionResource`
- `DenormalizedBookingResource`
- `DenormalizedStockAdjustmentResource`
- `DenormalizedStockReservationResource`
- `DenormalizedAvailabilityExceptionResource`
- `DenormalizedReviewResource`
- `DenormalizedMessageResource`

### Function Types

- `DenormalizeFunction` - Overloaded function interface for denormalization
- `DenormalizationOptions` - Configuration options (include, depth)

## Usage Examples

### Single Resource Denormalization

```typescript
const normalizedResponse: ApiResponse<UserResource> = await sdk.users.show({
  id: "123",
});
const denormalizedResponse = denormalize(normalizedResponse, {
  include: ["marketplace", "profileImage"],
});

// Type: DenormalizedApiResponse<DenormalizedResource<UserResource>>
const user = denormalizedResponse.data.data;
```

### Collection Denormalization

```typescript
const normalizedResponse: ApiResponse<ListingResource[]> =
  await sdk.listings.query({
    include: ["author", "images"],
  });
const denormalizedResponse = denormalize(normalizedResponse);

// Type: DenormalizedApiResponse<DenormalizedResource<ListingResource>[]>
const listings = denormalizedResponse.data.data;
```

### Paginated Denormalization

```typescript
const paginatedResponse: PaginatedResponse<TransactionResource> =
  await sdk.transactions.query({
    page: 1,
    perPage: 50,
  });
const denormalizedResponse = denormalize(paginatedResponse, {
  include: ["listing", "customer", "provider"],
  depth: 2,
});

// Type: DenormalizedPaginatedResponse<DenormalizedResource<TransactionResource>>
const transactions = denormalizedResponse.data.data;
const meta = denormalizedResponse.data.meta; // Includes pagination info
```

## Implementation Notes

1. **Relationship Mapping**: The helper types `ResolveRelationship` and `ResolveArrayRelationship` handle the mapping from type strings to actual resource types.

2. **Depth Control**: The `depth` option allows controlling how many levels deep to denormalize relationships.

3. **Include Filtering**: The `include` option specifies which relationships to denormalize, similar to the API's include parameter.

4. **Type Safety**: All denormalized relationships maintain full TypeScript type safety, eliminating the need for type assertions in most cases.

## Benefits

- **Simplified Data Access**: No need to manually resolve relationships from the included array
- **Type Safety**: Full IntelliSense and compile-time checking for denormalized data
- **Performance**: Denormalized data can improve runtime performance by eliminating lookup operations
- **Developer Experience**: Cleaner, more intuitive code when working with related resources
