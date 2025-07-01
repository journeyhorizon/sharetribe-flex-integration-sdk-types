# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.11.1] - 2025-01-07

### Added

- **Sparse Attributes Support**: Full implementation of Sharetribe API sparse attributes
  - `SparseAttributes` interface for `fields.*` parameters
  - `RelationshipLimits` interface for `limit.*` parameters
  - `EnhancedQueryParams` interface combining pagination, sparse attributes, and relationship limits
  - Support for nested field selection using dot notation (e.g., `profile.displayName`)
- **Enhanced API Method Signatures**: All query and show methods now support sparse attributes
  - `sdk.users.show()` with `fields.user`, `fields.image`, `limit.profileImage`
  - `sdk.listings.query()` with `fields.listing`, `fields.user`, `limit.images`
  - `sdk.transactions.show()` with `fields.transaction`, `fields.booking`, `limit.messages`
  - All command operations support sparse attributes through `CommandOptions`
- **Performance Optimization**: Reduced API response payload sizes through selective field requests
- **Comprehensive Documentation**: Added detailed sparse attributes examples in `EXAMPLES.md`
- **Type Safety**: Full TypeScript support for all sparse attributes features

### Changed

- Updated all query parameter interfaces to extend `EnhancedQueryParams`
- Enhanced `CommandOptions` to support sparse attributes and relationship limits
- Improved API method signatures for better type safety with sparse attributes

## [1.11.0] - 2025-01-07

### Added

- Initial TypeScript type definitions for sharetribe-flex-integration-sdk v1.11.0
- Complete API coverage for all SDK endpoints:
  - Marketplace API (`show`)
  - Users API (`show`, `query`, `updateProfile`, `approve`, `updatePermissions`)
  - Listings API (`show`, `query`, `create`, `update`, `approve`, `open`, `close`)
  - Transactions API (`show`, `query`, `transition`, `transitionSpeculative`, `updateMetadata`)
  - Images API (`upload`)
  - Availability Exceptions API (`query`, `create`, `delete`)
  - Events API (`query`)
  - Stock Adjustments API (`query`, `create`)
  - Stock API (`compareAndSet`)
  - Stock Reservations API (`show`)
- SDK type definitions:
  - `UUID` - Universally unique identifier
  - `LatLng` - Geographic coordinates
  - `LatLngBounds` - Geographic bounding box
  - `Money` - Currency amount representation
  - `BigDecimal` - Arbitrary precision decimal numbers
- Configuration interfaces:
  - `SdkConfig` - Main SDK configuration
  - `TypeHandler` - Custom type transformation
  - `RateLimiterConfig` - Request rate limiting
- Authentication and token management:
  - `AuthToken` - OAuth token structure
  - `AuthInfo` - Authentication status information
  - `TokenStore` - Token storage interface
  - `MemoryStore` - In-memory token storage
  - `FileStore` - File-based token storage
- Response handling:
  - `ApiResponse<T>` - Typed API response wrapper
  - `ResponseData<T>` - Response data structure
  - `ResponseMeta` - Pagination and metadata
  - `ResourceObject` - Standard resource representation
  - `ApiError` - Typed error responses
- Utility functions:
  - `createRateLimiter()` - Rate limiter factory
  - `objectQueryString()` - Object to query string conversion
  - Pre-configured rate limiter settings for dev and production
- Comprehensive type safety for all method parameters and return types
- Full namespace exports (`types`, `tokenStore`, `util`)
- Extensive documentation and usage examples

### Features

- **Type Safety**: Complete type coverage for all SDK operations
- **IntelliSense Support**: Full autocomplete and type checking in TypeScript IDEs
- **Error Handling**: Properly typed error responses for robust error handling
- **Flexible Configuration**: Support for custom type handlers and token stores
- **Rate Limiting**: Built-in support for request rate limiting configuration
- **Backwards Compatibility**: Maintains compatibility with existing JavaScript usage patterns

### Documentation

- Comprehensive README with installation and usage instructions
- Detailed API documentation covering all endpoints
- Extensive examples showing real-world usage patterns
- Type testing suite ensuring correctness of all definitions
- Migration guide for existing JavaScript users

### Technical Details

- Compatible with TypeScript 4.1+
- Supports both CommonJS and ES modules
- Includes proper namespace exports for clean API access
- Follows DefinitelyTyped standards and conventions
- Comprehensive test coverage for type definitions
