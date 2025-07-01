// TypeScript type testing file for sharetribe-flex-integration-sdk
// This file tests that all types are properly defined and can be used

// Import UUID as value for testing
import { UUID } from "./index";

// Type-only imports for testing
import type {
  SdkConfig,
  SharetribeIntegrationSDK,
  ID,
  LatLng,
  LatLngBounds,
  Money,
  BigDecimal,
  AuthToken,
  AuthInfo,
  TokenStore,
  TypeHandler,
  ApiResponse,
  ResponseData,
  ResponseMeta,
  ResourceObject,
  SpecificResource,
  PaginatedResponse,
  MarketplaceResource,
  UserResource,
  ListingResource,
  TransactionResource,
  ImageResource,
  AvailabilityExceptionResource,
  EventResource,
  StockResource,
  StockAdjustmentResource,
  StockReservationResource,
  BookingResource,
  ReviewResource,
  MessageResource,
  // Denormalized types
  DenormalizedResource,
  DenormalizedUserResource,
  DenormalizedListingResource,
  DenormalizedTransactionResource,
  DenormalizedApiResponse,
  DenormalizedPaginatedResponse,
  DenormalizedSpecificResource,
  DenormalizationOptions,
  DenormalizeFunction,
  // Query parameter types
  UserQueryParams,
  ListingQueryParams,
  TransactionQueryParams,
  AvailabilityExceptionQueryParams,
  EventQueryParams,
  StockAdjustmentQueryParams,
  // Body parameter types
  UpdateUserProfileParams,
  ApproveUserParams,
  UpdateUserPermissionsParams,
  CreateListingParams,
  UpdateListingParams,
  ApproveListingParams,
  OpenListingParams,
  CloseListingParams,
  TransitionTransactionParams,
  TransitionSpeculativeParams,
  UpdateTransactionMetadataParams,
  UploadImageParams,
  CreateAvailabilityExceptionParams,
  DeleteAvailabilityExceptionParams,
  CompareAndSetStockParams,
  CreateStockAdjustmentParams,
  ApiError,
  QueryParams,
  BodyParams,
  CommandOptions,
  RateLimiterConfig,
  MemoryStore,
  FileStore,
} from "./index";

// Test that interfaces can be properly implemented
class TestTokenStore implements TokenStore {
  async setToken(token: AuthToken): Promise<void> {
    // Implementation would go here
  }

  async getToken(): Promise<AuthToken> {
    return {
      access_token: "test-token",
      refresh_token: "test-refresh",
      token_type: "Bearer",
      expires_in: 3600,
      scope: "read write",
    };
  }

  async removeToken(): Promise<void> {
    // Implementation would go here
  }
}

// Test configuration type
const testConfig: SdkConfig = {
  clientId: "test-client-id",
  clientSecret: "test-client-secret",
  baseUrl: "https://flex-integ-api.sharetribe.com",
  version: "v1",
  transitVerbose: false,
  tokenStore: new TestTokenStore(),
  typeHandlers: [],
  endpoints: [],
  adapter: null,
  httpAgent: null,
  httpsAgent: null,
  queryLimiter: null,
  commandLimiter: null,
};

// Test type handler interface - using a generic approach for type-only testing
const testTypeHandler: TypeHandler = {
  sdkType: Object as any, // In type-only context, we can't reference the actual constructor
  reader: (sdkValue: any) => ({ customUuid: sdkValue.uuid }),
  writer: (appValue: any) => ({ uuid: appValue.customUuid, _sdkType: "UUID" }),
};

// Test rate limiter config
const testRateLimiterConfig: RateLimiterConfig = {
  bucketInitial: 100,
  bucketIncreaseInterval: 1000,
  bucketIncreaseAmount: 2,
  bucketMaximum: 200,
};

// Test API response types
function testApiResponse(): void {
  // Test successful response type structure
  const successResponse: ApiResponse<ResourceObject[]> = {
    status: 200,
    statusText: "OK",
    data: {
      data: [
        {
          id: {} as UUID,
          type: "listing",
          attributes: {
            title: "Test Listing",
            description: "A test listing",
          },
          relationships: {
            author: {
              data: {
                id: {} as UUID,
                type: "user",
              },
            },
          },
        },
      ],
      meta: {
        totalItems: 1,
        totalPages: 1,
        page: 1,
        perPage: 10,
      },
      included: [],
    },
  };

  // Test error response type structure
  const errorResponse: ApiError = new Error("API Error") as ApiError;
  errorResponse.status = 400;
  errorResponse.statusText = "Bad Request";
  errorResponse.data = {
    errors: [
      {
        status: 400,
        code: "invalid_request",
        title: "Bad Request",
        details: {
          field: "title",
          message: "Title is required",
        },
      },
    ],
  };
}

// Test SDK interface methods
function testSDKInterface(sdk: SharetribeIntegrationSDK): void {
  // Test marketplace API
  const marketplacePromise: Promise<ApiResponse<MarketplaceResource>> =
    sdk.marketplace.show({ id: {} as UUID });

  // Test users API
  const userPromise: Promise<ApiResponse<UserResource>> = sdk.users.show({
    id: {} as UUID,
  });
  const usersPromise: Promise<PaginatedResponse<UserResource>> =
    sdk.users.query({
      perPage: 10,
    });
  const updateProfilePromise: Promise<ApiResponse<UserResource>> =
    sdk.users.updateProfile(
      { id: {} as UUID, firstName: "John" },
      { expand: true }
    );
  const approveUserPromise: Promise<ApiResponse<UserResource>> =
    sdk.users.approve({ id: {} as UUID });
  const updatePermissionsPromise: Promise<ApiResponse<UserResource>> =
    sdk.users.updatePermissions({
      id: {} as UUID,
      postListings: "permission/allow",
    });

  // Test listings API
  const listingPromise: Promise<ApiResponse<ListingResource>> =
    sdk.listings.show({ id: {} as UUID });
  const listingsPromise: Promise<PaginatedResponse<ListingResource>> =
    sdk.listings.query({ perPage: 5 });
  const createListingPromise: Promise<ApiResponse<ListingResource>> =
    sdk.listings.create({
      title: "Test Listing",
      authorId: {} as UUID,
      state: "published",
      price: {} as Money,
      geolocation: {} as LatLng,
    });
  const updateListingPromise: Promise<ApiResponse<ListingResource>> =
    sdk.listings.update({ id: {} as UUID, title: "Updated Title" });
  const approveListingPromise: Promise<ApiResponse<ListingResource>> =
    sdk.listings.approve({ id: {} as UUID });
  const openListingPromise: Promise<ApiResponse<ListingResource>> =
    sdk.listings.open({ id: {} as UUID });
  const closeListingPromise: Promise<ApiResponse<ListingResource>> =
    sdk.listings.close({ id: {} as UUID });

  // Test transactions API
  const transactionPromise: Promise<ApiResponse<TransactionResource>> =
    sdk.transactions.show({ id: {} as UUID });
  const transactionsPromise: Promise<PaginatedResponse<TransactionResource>> =
    sdk.transactions.query({ perPage: 10 });
  const transitionPromise: Promise<ApiResponse<TransactionResource>> =
    sdk.transactions.transition({
      id: {} as UUID,
      transition: "transition/confirm-payment",
    });
  const transitionSpeculativePromise: Promise<
    ApiResponse<TransactionResource>
  > = sdk.transactions.transitionSpeculative({
    id: {} as UUID,
    transition: "transition/confirm-payment",
  });
  const updateMetadataPromise: Promise<ApiResponse<TransactionResource>> =
    sdk.transactions.updateMetadata({
      id: {} as UUID,
      metadata: { key: "value" },
    });

  // Test images API
  const uploadImagePromise: Promise<ApiResponse<ImageResource>> =
    sdk.images.upload({ image: new Blob() });

  // Test availability exceptions API
  const exceptionsPromise: Promise<
    PaginatedResponse<AvailabilityExceptionResource>
  > = sdk.availabilityExceptions.query({
    listingId: {} as UUID,
    start: "2023-12-01T00:00:00.000Z",
    end: "2023-12-07T23:59:59.999Z",
  });
  const createExceptionPromise: Promise<
    ApiResponse<AvailabilityExceptionResource>
  > = sdk.availabilityExceptions.create({
    listingId: {} as UUID,
    seats: 1,
    start: "2023-12-01",
    end: "2023-12-07",
  });
  const deleteExceptionPromise: Promise<
    ApiResponse<AvailabilityExceptionResource>
  > = sdk.availabilityExceptions.delete({ id: {} as UUID });

  // Test events API
  const eventsPromise: Promise<PaginatedResponse<EventResource>> =
    sdk.events.query({ eventTypes: ["listing/created"] });

  // Test stock adjustments API
  const stockAdjustmentsPromise: Promise<
    PaginatedResponse<StockAdjustmentResource>
  > = sdk.stockAdjustments.query({
    listingId: {} as UUID,
    start: "2023-12-01T00:00:00.000Z",
    end: "2023-12-31T23:59:59.999Z",
  });
  const createStockAdjustmentPromise: Promise<
    ApiResponse<StockAdjustmentResource>
  > = sdk.stockAdjustments.create({
    listingId: {} as UUID,
    quantity: 10,
  });

  // Test stock API
  const compareAndSetPromise: Promise<ApiResponse<StockResource>> =
    sdk.stock.compareAndSet({
      listingId: {} as UUID,
      oldTotal: 5,
      newTotal: 10,
    });

  // Test stock reservations API
  const stockReservationPromise: Promise<
    ApiResponse<StockReservationResource>
  > = sdk.stockReservations.show({ id: {} as UUID });

  // Test auth methods
  const authInfoPromise: Promise<AuthInfo> = sdk.authInfo();
  const revokePromise: Promise<void> = sdk.revoke();
}

// Test that the main types have the expected structure
type UUIDTest = UUID extends { uuid: string; readonly _sdkType: "UUID" }
  ? true
  : false;
type LatLngTest = LatLng extends {
  lat: number;
  lng: number;
  readonly _sdkType: "LatLng";
}
  ? true
  : false;
type MoneyTest = Money extends {
  amount: number;
  currency: string;
  readonly _sdkType: "Money";
}
  ? true
  : false;
type BigDecimalTest = BigDecimal extends {
  value: string;
  readonly _sdkType: "BigDecimal";
}
  ? true
  : false;

// These should all be true if types are correctly defined
const typeTests: [UUIDTest, LatLngTest, MoneyTest, BigDecimalTest] = [
  true,
  true,
  true,
  true,
];

// Test query params and body params can accept any structure
const testQueryParams: QueryParams = {
  perPage: 10,
  include: ["author", "images"],
  pub_listingType: "sell",
  bounds: {} as LatLngBounds,
  sort: "createdAt",
};

const testBodyParams: BodyParams = {
  id: {} as UUID,
  title: "Test Title",
  description: "Test Description",
  price: {} as Money,
  location: {} as LatLng,
  metadata: {
    customField: "customValue",
  },
};

const testCommandOptions: CommandOptions = {
  expand: true,
  include: ["author", "images", "currentStock"],
  customOption: "customValue",
};

function testSparseAttributes(sdk: SharetribeIntegrationSDK): void {
  // Test sparse attributes for users
  const userSparse: Promise<ApiResponse<UserResource>> = sdk.users.show({
    id: {} as UUID,
    "fields.user": ["profile.displayName", "profile.abbreviatedName", "email"],
    "fields.image": ["variants.default"],
    "limit.profileImage": 1,
  });

  // Test sparse attributes for listings
  const listingSparse: Promise<ApiResponse<ListingResource>> =
    sdk.listings.show({
      id: {} as UUID,
      "fields.listing": ["title", "description", "price"],
      "fields.user": ["profile.displayName"],
      "fields.image": ["variants.default"],
      "limit.images": 3,
    });

  // Test sparse attributes in query operations
  const listingsQuery: Promise<PaginatedResponse<ListingResource>> =
    sdk.listings.query({
      authorId: {} as UUID,
      "fields.listing": ["title", "price", "publicData"],
      "fields.user": ["profile.displayName", "profile.abbreviatedName"],
      "limit.images": 2,
      include: ["author", "images"],
    });

  // Test sparse attributes for transactions
  const transactionSparse: Promise<ApiResponse<TransactionResource>> =
    sdk.transactions.show({
      id: {} as UUID,
      "fields.transaction": [
        "lineItems",
        "payinTotal",
        "payoutTotal",
        "lastTransition",
      ],
      "fields.listing": ["title", "price"],
      "fields.user": ["profile.displayName"],
      "fields.booking": ["start", "end", "seats"],
      "limit.messages": 10,
      include: ["listing", "customer", "provider", "booking", "messages"],
    });

  // Test sparse attributes with command options
  const listingUpdate = sdk.listings.update(
    {
      id: {} as UUID,
      title: "Updated Title",
    },
    {
      expand: true,
      "fields.listing": ["title", "description", "price", "createdAt"],
      "fields.user": ["profile.displayName"],
      include: ["author"],
    }
  );
}

function testAPIMethodSignatures(sdk: SharetribeIntegrationSDK): void {
  // Test that show methods accept sparse attributes
  const userShow = sdk.users.show({
    id: {} as UUID,
    "fields.user": ["email", "profile.displayName"],
  });

  const listingShow = sdk.listings.show({
    id: {} as UUID,
    "fields.listing": ["title", "price"],
    "limit.images": 1,
  });

  const transactionShow = sdk.transactions.show({
    id: {} as UUID,
    "fields.transaction": ["state", "lineItems"],
    "fields.booking": ["start", "end"],
  });

  // Test that query methods inherit sparse attributes from EnhancedQueryParams
  const usersQuery = sdk.users.query({
    createdAtStart: "2023-01-01T00:00:00.000Z",
    "fields.user": ["profile.displayName", "email"],
    "limit.profileImage": 1,
  });

  const listingsQuery = sdk.listings.query({
    authorId: {} as UUID,
    "fields.listing": ["title", "description", "price"],
    "fields.user": ["profile.displayName"],
    "limit.images": 3,
  });
}

// Denormalized data type tests
function testDenormalizedTypes() {
  // Test denormalized user resource
  const denormalizedUser: DenormalizedUserResource = {} as any;
  if (denormalizedUser.relationships?.marketplace) {
    // In denormalized format, marketplace should be the full resource, not a reference
    const marketplace: MarketplaceResource =
      denormalizedUser.relationships.marketplace;
    console.log(marketplace.attributes.name); // Type-safe access
  }

  if (denormalizedUser.relationships?.profileImage) {
    // Profile image should be the full resource
    const image: ImageResource = denormalizedUser.relationships.profileImage;
    console.log(image.attributes.variants.default.url); // Type-safe access
  }

  // Test denormalized listing resource
  const denormalizedListing: DenormalizedListingResource = {} as any;
  if (denormalizedListing.relationships?.author) {
    // Author should be the full user resource
    const author: UserResource = denormalizedListing.relationships.author;
    console.log(author.attributes.profile.displayName); // Type-safe access
  }

  if (denormalizedListing.relationships?.images) {
    // Images should be an array of full image resources
    const images: ImageResource[] = denormalizedListing.relationships.images;
    images.forEach((image) => {
      console.log(image.attributes.variants.default.url); // Type-safe access
    });
  }

  // Test denormalized transaction resource
  const denormalizedTransaction: DenormalizedTransactionResource = {} as any;
  if (denormalizedTransaction.relationships?.listing) {
    const listing: ListingResource =
      denormalizedTransaction.relationships.listing;
    console.log(listing.attributes.title); // Type-safe access
  }

  if (denormalizedTransaction.relationships?.reviews) {
    const reviews: ReviewResource[] =
      denormalizedTransaction.relationships.reviews;
    reviews.forEach((review) => {
      console.log(review.attributes.rating); // Type-safe access
    });
  }

  // Test denormalized response types
  const denormalizedResponse: DenormalizedApiResponse<DenormalizedUserResource> =
    {
      status: 200,
      statusText: "OK",
      data: {
        data: {} as DenormalizedUserResource,
        meta: {},
      },
    };

  // Test denormalized paginated response
  const denormalizedPaginatedResponse: DenormalizedPaginatedResponse<DenormalizedListingResource> =
    {
      status: 200,
      statusText: "OK",
      data: {
        data: [] as DenormalizedListingResource[],
        meta: {
          page: 1,
          perPage: 100,
          totalItems: 50,
          totalPages: 1,
        },
      },
    };

  // Test denormalization options
  const denormalizationOptions: DenormalizationOptions = {
    include: ["marketplace", "author", "images"],
    depth: 2,
  };

  // Test denormalize function type with overloads
  const denormalize: DenormalizeFunction = ((
    response: any,
    options?: DenormalizationOptions
  ) => {
    // Implementation would go here
    return response;
  }) as DenormalizeFunction;

  // Test usage with different resource types - now with precise return types

  // Single resource: ApiResponse<UserResource> -> DenormalizedApiResponse<DenormalizedResource<UserResource>>
  const normalizedUserResponse: ApiResponse<UserResource> = {} as any;
  const denormalizedUserResult = denormalize(
    normalizedUserResponse,
    denormalizationOptions
  );
  // Type is now precisely: DenormalizedApiResponse<DenormalizedResource<UserResource>>

  // Array resource: ApiResponse<ListingResource[]> -> DenormalizedApiResponse<DenormalizedResource<ListingResource>[]>
  const normalizedListingArrayResponse: ApiResponse<ListingResource[]> =
    {} as any;
  const denormalizedListingArrayResult = denormalize(
    normalizedListingArrayResponse,
    denormalizationOptions
  );
  // Type is now precisely: DenormalizedApiResponse<DenormalizedResource<ListingResource>[]>

  // Paginated response: PaginatedResponse<TransactionResource> -> DenormalizedPaginatedResponse<DenormalizedResource<TransactionResource>>
  const paginatedTransactionResponse: PaginatedResponse<TransactionResource> =
    {} as any;
  const denormalizedPaginatedResult = denormalize(
    paginatedTransactionResponse,
    denormalizationOptions
  );
  // Type is now precisely: DenormalizedPaginatedResponse<DenormalizedResource<TransactionResource>>

  // Demonstrate type safety - these are all correctly typed
  const singleUserData: DenormalizedResource<UserResource> =
    denormalizedUserResult.data.data;
  const listingArrayData: DenormalizedResource<ListingResource>[] =
    denormalizedListingArrayResult.data.data;
  const paginatedTransactionData: DenormalizedResource<TransactionResource>[] =
    denormalizedPaginatedResult.data.data;

  // The denormalized relationships are now fully typed
  if (singleUserData.relationships?.marketplace) {
    // marketplace is fully typed as MarketplaceResource, not a reference
    const marketplaceName: string =
      singleUserData.relationships.marketplace.attributes.name;
    console.log(marketplaceName);
  }

  if (listingArrayData[0]?.relationships?.images) {
    // images is fully typed as ImageResource[], not references
    const images = listingArrayData[0].relationships.images as ImageResource[];
    const imageUrls = images.map(
      (img: ImageResource) => img.attributes.variants.default.url
    );
    console.log(imageUrls);
  }

  return {
    denormalizedUser,
    denormalizedListing,
    denormalizedTransaction,
    denormalizedResponse,
    denormalizedPaginatedResponse,
    denormalizationOptions,
    denormalize,
    denormalizedUserResult,
    denormalizedListingArrayResult,
    denormalizedPaginatedResult,
    singleUserData,
    listingArrayData,
    paginatedTransactionData,
  };
}

// Test ID type flexibility (UUID vs string)
function testIDTypeFlexibility() {
  // Test that ID accepts both UUID objects and strings
  const uuidObj = new UUID("123e4567-e89b-12d3-a456-426614174000");
  const stringId = "123e4567-e89b-12d3-a456-426614174000";

  // Both should be valid ID values
  const userIdAsUUID: ID = uuidObj;
  const userIdAsString: ID = stringId;

  // Test in resource objects
  const userWithUUIDId: UserResource = {
    id: uuidObj,
    type: "user",
    attributes: {
      banned: false,
      deleted: false,
      state: "active",
      createdAt: new Date(),
      email: "test@example.com",
      emailVerified: true,
      pendingEmail: null,
      stripeConnected: false,
      identityProviders: [],
      profile: {
        firstName: "Test",
        lastName: "User",
        displayName: "Test User",
        abbreviatedName: "TU",
        bio: null,
        publicData: {},
        protectedData: {},
        privateData: {},
        metadata: {},
      },
      permissions: {
        postListings: "permission/allow",
        initiateTransactions: "permission/allow",
        read: "permission/allow",
      },
    },
  };

  const userWithStringId: UserResource = {
    ...userWithUUIDId,
    id: stringId,
  };

  // Test in query parameters
  const queryWithUUID: UserQueryParams = {
    // page and perPage would be inherited from EnhancedQueryParams
    page: 1,
    perPage: 50,
  };

  const queryWithString: ListingQueryParams = {
    authorId: stringId, // ID can be string
    page: 1,
    perPage: 25,
  };

  // Test in body parameters
  const updateParamsWithUUID: UpdateUserProfileParams = {
    id: uuidObj,
    firstName: "Updated",
    profileImageId: uuidObj,
  };

  const updateParamsWithString: UpdateUserProfileParams = {
    id: stringId,
    firstName: "Updated",
    profileImageId: stringId,
  };

  // Test in relationship references
  const listingWithStringRefs: ListingResource = {
    id: stringId,
    type: "listing",
    attributes: {
      title: "Test Listing",
      description: "A test listing",
      geolocation: null,
      createdAt: new Date(),
      price: null,
      availabilityPlan: null,
      publicData: {},
      privateData: {},
      metadata: {},
      state: "published",
      deleted: false,
    },
    relationships: {
      marketplace: { data: { id: stringId, type: "marketplace" } },
      author: { data: { id: stringId, type: "user" } },
      images: {
        data: [
          { id: stringId, type: "image" },
          { id: uuidObj, type: "image" }, // Mix of string and UUID
        ],
      },
    },
  };

  return {
    userIdAsUUID,
    userIdAsString,
    userWithUUIDId,
    userWithStringId,
    queryWithUUID,
    queryWithString,
    updateParamsWithUUID,
    updateParamsWithString,
    listingWithStringRefs,
  };
}

// Export types for external testing (this won't actually run but shows the types work)
export type {
  SdkConfig,
  SharetribeIntegrationSDK,
  UUID,
  LatLng,
  LatLngBounds,
  Money,
  BigDecimal,
  AuthToken,
  AuthInfo,
  TokenStore,
  TypeHandler,
  ApiResponse,
  ResponseData,
  ResponseMeta,
  ResourceObject,
  ApiError,
  QueryParams,
  BodyParams,
  CommandOptions,
  RateLimiterConfig,
  MemoryStore,
  FileStore,
};

// Export test functions
export {
  TestTokenStore,
  testSDKInterface,
  testApiResponse,
  testSparseAttributes,
  testAPIMethodSignatures,
  testDenormalizedTypes,
  testIDTypeFlexibility,
};
