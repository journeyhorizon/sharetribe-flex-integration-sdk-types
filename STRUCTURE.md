# Project Structure

```
sharetribe-flex-integration-sdk-types/
├── index.d.ts          # Main TypeScript type definitions
├── test.ts             # Type testing and validation
├── package.json        # NPM package configuration
├── tsconfig.json       # TypeScript compiler configuration
├── README.md           # Project documentation and usage guide
├── EXAMPLES.md         # Comprehensive usage examples
├── CHANGELOG.md        # Project changelog
├── LICENSE             # MIT license
├── .gitignore          # Git ignore rules
└── yarn.lock           # Dependency lock file
```

## Key Files

### `index.d.ts`

The main type definition file containing:

- All SDK interfaces and types
- API method signatures
- Configuration options
- Error handling types
- Utility functions
- Namespace exports

### `test.ts`

Comprehensive type testing file that validates:

- All interfaces can be properly implemented
- Type constraints work correctly
- API method signatures are accurate
- Response types are properly structured
- Error handling types are complete

### `package.json`

NPM package configuration following DefinitelyTyped conventions:

- Package metadata and version
- TypeScript version requirements
- Development dependencies
- Build and test scripts

### Documentation Files

- `README.md`: Installation, basic usage, and API overview
- `EXAMPLES.md`: Detailed usage examples for all SDK features
- `CHANGELOG.md`: Version history and feature additions

## Type Coverage

The type definitions provide complete coverage for:

### Core SDK Types

- `UUID` - Universally unique identifier
- `Money` - Currency amounts with subunit precision
- `LatLng` - Geographic coordinates
- `LatLngBounds` - Geographic bounding boxes
- `BigDecimal` - Arbitrary precision decimal numbers

### API Endpoints

- **Marketplace**: Show marketplace information
- **Users**: User management and profile operations
- **Listings**: Listing CRUD operations and state management
- **Transactions**: Transaction processing and state transitions
- **Images**: File upload operations
- **Availability Exceptions**: Calendar exception management
- **Events**: Event stream access
- **Stock Management**: Inventory operations
- **Stock Reservations**: Stock reservation queries

### Configuration & Authentication

- `SdkConfig` - Complete SDK configuration options
- `AuthToken` - OAuth token structure
- `TokenStore` - Token storage interface with memory and file implementations
- `TypeHandler` - Custom type transformation capabilities
- `RateLimiterConfig` - Request rate limiting configuration

### Response Handling

- `ApiResponse<T>` - Generic API response wrapper
- `ResourceObject` - Standard JSON:API resource structure
- `ResponseMeta` - Pagination and metadata
- `ApiError` - Comprehensive error response typing

### Utilities

- Rate limiter factory and configurations
- Query string serialization
- Type conversion utilities
- Pre-configured settings for development and production environments

## Usage Patterns

The types support all major usage patterns:

1. **Basic SDK Usage**: Simple configuration and API calls
2. **Advanced Configuration**: Custom type handlers, token stores, rate limiting
3. **Error Handling**: Type-safe error responses and status codes
4. **Custom Integrations**: Extensible type system for custom implementations
5. **Production Deployment**: Proper rate limiting and token management

## Validation

All types have been validated through:

- TypeScript compiler checks (no errors)
- Comprehensive test file covering all interfaces
- Real-world usage pattern validation
- Compatibility with SDK documentation and examples

The project is ready for use as TypeScript definitions for the Sharetribe Flex Integration SDK.
