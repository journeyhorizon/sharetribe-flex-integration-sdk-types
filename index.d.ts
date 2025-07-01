// Type definitions for sharetribe-flex-integration-sdk 1.11
// Project: https://github.com/sharetribe/flex-integration-sdk-js
// Definitions by: Thang Nguyen <https://github.com/nguyenthang>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export interface SdkConfig {
  clientId: string;
  clientSecret?: string;
  baseUrl?: string;
  version?: string;
  typeHandlers?: TypeHandler[];
  endpoints?: any[];
  adapter?: any;
  httpAgent?: any;
  httpsAgent?: any;
  transitVerbose?: boolean;
  queryLimiter?: any;
  commandLimiter?: any;
  tokenStore?: TokenStore;
}

export interface TypeHandler<TSDKType = any, TAppType = any> {
  sdkType: new (...args: any[]) => TSDKType;
  appType?: new (...args: any[]) => TAppType;
  canHandle?: (value: any) => boolean;
  reader?: (sdkValue: TSDKType) => TAppType;
  writer?: (appValue: TAppType) => TSDKType;
}

export interface TokenStore {
  setToken(token: AuthToken): void | Promise<void>;
  getToken(): AuthToken | Promise<AuthToken>;
  removeToken(): void | Promise<void>;
}

export interface AuthToken {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
}

export interface AuthInfo {
  grantType?: string;
  isAnonymous?: boolean;
  scopes?: string[];
}

// SDK Types
export class UUID {
  constructor(uuid: string);
  uuid: string;
  readonly _sdkType: "UUID";
}

export class LatLng {
  constructor(lat: number, lng: number);
  lat: number;
  lng: number;
  readonly _sdkType: "LatLng";
}

export class LatLngBounds {
  constructor(ne: LatLng, sw: LatLng);
  ne: LatLng;
  sw: LatLng;
  readonly _sdkType: "LatLngBounds";
}

export class Money {
  constructor(amount: number, currency: string);
  amount: number;
  currency: string;
  readonly _sdkType: "Money";
}

export class BigDecimal {
  constructor(value: string);
  value: string;
  readonly _sdkType: "BigDecimal";
}

export function toType(
  value: any
): UUID | LatLng | LatLngBounds | Money | BigDecimal | any;

// ID type that supports both UUID objects and string values
export type ID = UUID | string;

// JSON serialization functions (deprecated but kept for compatibility)
export function replacer(key: string, value: any): any;
export function reviver(key: string, value: any): any;

// Response interfaces
export interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  data: ResponseData<T>;
}

export interface ResponseData<T = any> {
  data: T;
  meta?: ResponseMeta;
  included?: SpecificResource[];
}

export interface ResponseMeta {
  // Pagination information
  totalItems?: number | null; // May be null if pagination not supported under certain conditions
  totalPages?: number | null; // May be null if pagination not supported under certain conditions
  page?: number; // The number of the page returned in the response
  perPage?: number; // The number of resources returned per page
  paginationLimit?: number; // The last page that can be requested with the given query
  paginationUnsupported?: boolean; // Set to true if pagination not supported with current query parameters
  [key: string]: any;
}

export interface ResourceObject {
  id: ID;
  type: string;
  attributes?: { [key: string]: any };
  relationships?: { [key: string]: any };
  links?: { [key: string]: any };
}

// Base resource interface
export interface BaseResource {
  id: ID;
  type: string;
}

// Extended data interfaces
export interface ExtendedData {
  [key: string]: any;
}

// Marketplace resource
export interface MarketplaceResource extends BaseResource {
  type: "marketplace";
  attributes: {
    name: string;
    description: string | null; // DEPRECATED: Not in use anymore
  };
}

// User resource
export interface UserIdentityProvider {
  idpId: string;
  userId: string;
}

export type UserState = "active" | "pendingApproval" | "banned";

export interface UserPermissionSet {
  postListings: "permission/allow" | "permission/deny";
  initiateTransactions: "permission/allow" | "permission/deny";
  read: "permission/allow" | "permission/deny";
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  abbreviatedName: string;
  bio: string | null;
  publicData: ExtendedData;
  protectedData: ExtendedData;
  privateData: ExtendedData;
  metadata: ExtendedData;
}

export interface UserResource extends BaseResource {
  type: "user";
  attributes: {
    banned: boolean; // DEPRECATED: use state instead
    deleted: boolean;
    state: UserState;
    createdAt: Date;
    email: string;
    emailVerified: boolean;
    pendingEmail: string | null;
    stripeConnected: boolean;
    identityProviders: UserIdentityProvider[];
    profile: UserProfile;
    permissions: UserPermissionSet;
  };
  relationships?: {
    marketplace: { data: { id: ID; type: "marketplace" } };
    profileImage?: { data: { id: ID; type: "image" } };
    stripeAccount?: { data: { id: ID; type: "stripeAccount" } };
    effectivePermissionSet: { data: { id: ID; type: "permissionSet" } };
  };
}

// Stripe Account resource
export interface StripeAccountResource extends BaseResource {
  type: "stripeAccount";
  attributes: {
    stripeAccountId: string;
  };
}

// Listing resource
export type ListingState = "draft" | "pendingApproval" | "published" | "closed";

export interface AvailabilityPlanEntry {
  dayOfWeek: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  seats: number;
  startTime?: string; // for time-based plans, in hh:mm format
  endTime?: string; // for time-based plans, in hh:mm format
}

export interface AvailabilityPlan {
  type: "availability-plan/day" | "availability-plan/time";
  timezone?: string; // required for time-based plans
  entries: AvailabilityPlanEntry[];
}

export interface ListingResource extends BaseResource {
  type: "listing";
  attributes: {
    title: string;
    description: string;
    geolocation: LatLng | null;
    createdAt: Date;
    price: Money | null;
    availabilityPlan: AvailabilityPlan | null;
    publicData: ExtendedData;
    privateData: ExtendedData;
    metadata: ExtendedData;
    state: ListingState;
    deleted: boolean;
  };
  relationships?: {
    marketplace: { data: { id: ID; type: "marketplace" } };
    author: { data: { id: ID; type: "user" } };
    images?: { data: Array<{ id: ID; type: "image" }> };
    currentStock?: { data: { id: ID; type: "stock" } };
  };
}

// Image resource
export interface ImageVariant {
  width: number;
  height: number;
  url: string;
  name: string;
}

export interface ImageResource extends BaseResource {
  type: "image";
  attributes: {
    variants: {
      [variantName: string]: ImageVariant;
      default: ImageVariant;
    };
  };
}

// Transaction resource
export interface LineItem {
  code: string;
  unitPrice: Money;
  quantity?: number;
  units?: number;
  seats?: number;
  percentage?: number;
  lineTotal: Money;
  reversal: boolean;
  includedFor: Array<"customer" | "provider">;
}

export interface TransitionRecord {
  transition: string;
  createdAt: Date;
  by: "customer" | "provider" | "operator" | "system";
}

export interface TransactionResource extends BaseResource {
  type: "transaction";
  attributes: {
    createdAt: Date;
    processName: string;
    processVersion: number;
    lastTransition: string;
    lastTransitionedAt: Date;
    state: string;
    lineItems: LineItem[];
    payinTotal: Money;
    payoutTotal: Money;
    protectedData: ExtendedData;
    metadata: ExtendedData;
    transitions: TransitionRecord[];
  };
  relationships?: {
    marketplace: { data: { id: ID; type: "marketplace" } };
    listing: { data: { id: ID; type: "listing" } };
    provider: { data: { id: ID; type: "user" } };
    customer: { data: { id: ID; type: "user" } };
    booking?: { data: { id: ID; type: "booking" } };
    stockReservation?: { data: { id: ID; type: "stockReservation" } };
    reviews?: { data: Array<{ id: ID; type: "review" }> };
    messages?: { data: Array<{ id: ID; type: "message" }> };
  };
}

// Booking resource
export type BookingState =
  | "pending"
  | "proposed"
  | "accepted"
  | "declined"
  | "cancelled";

export interface BookingResource extends BaseResource {
  type: "booking";
  attributes: {
    seats: number;
    start: Date;
    end: Date;
    displayStart: Date;
    displayEnd: Date;
    state: BookingState;
  };
  relationships?: {
    transaction: { data: { id: ID; type: "transaction" } };
    listing: { data: { id: ID; type: "listing" } };
  };
}

// Stock resource
export interface StockResource extends BaseResource {
  type: "stock";
  attributes: {
    quantity: number;
  };
}

// Stock Adjustment resource
export interface StockAdjustmentResource extends BaseResource {
  type: "stockAdjustment";
  attributes: {
    at: Date;
    quantity: number;
  };
  relationships?: {
    listing: { data: { id: ID; type: "listing" } };
    stockReservation?: { data: { id: ID; type: "stockReservation" } };
  };
}

// Stock Reservation resource
export type StockReservationState =
  | "pending"
  | "proposed"
  | "accepted"
  | "declined"
  | "cancelled";

export interface StockReservationResource extends BaseResource {
  type: "stockReservation";
  attributes: {
    quantity: number;
    state: StockReservationState;
  };
  relationships?: {
    listing: { data: { id: ID; type: "listing" } };
    transaction: { data: { id: ID; type: "transaction" } };
    stockAdjustments: { data: Array<{ id: ID; type: "stockAdjustment" }> };
  };
}

// Availability Exception resource
export interface AvailabilityExceptionResource extends BaseResource {
  type: "availabilityException";
  attributes: {
    seats: number;
    start: Date;
    end: Date;
  };
  relationships?: {
    listing: { data: { id: ID; type: "listing" } };
  };
}

// Review resource
export type ReviewType = "ofProvider" | "ofCustomer";
export type ReviewState = "public" | "pending";

export interface ReviewResource extends BaseResource {
  type: "review";
  attributes: {
    type: ReviewType;
    state: ReviewState;
    rating: number; // 1-5
    content: string;
    createdAt: Date;
    deleted: boolean;
  };
  relationships?: {
    author: { data: { id: ID; type: "user" } };
    listing?: { data: { id: ID; type: "listing" } }; // only for ofProvider reviews
    subject: { data: { id: ID; type: "user" } };
    transaction: { data: { id: ID; type: "transaction" } };
  };
}

// Message resource
export interface MessageResource extends BaseResource {
  type: "message";
  attributes: {
    content: string;
    createdAt: Date;
  };
  relationships?: {
    sender: { data: { id: ID; type: "user" } };
    transaction: { data: { id: ID; type: "transaction" } };
  };
}

// Event resource
export interface EventAuditData {
  userId?: ID;
  adminId?: ID;
  requestId?: ID;
  clientId?: ID;
}

export interface EventResource extends BaseResource {
  type: "event";
  attributes: {
    createdAt: Date;
    sequenceId: number;
    marketplaceId: ID;
    eventType: string;
    source: string;
    resourceId: ID;
    resourceType: string;
    resource: ResourceObject | null;
    previousValues: {
      attributes?: { [key: string]: any };
      relationships?: { [key: string]: any };
    };
    auditData: EventAuditData;
  };
}

// Union type for all specific resources
export type SpecificResource =
  | MarketplaceResource
  | UserResource
  | StripeAccountResource
  | ListingResource
  | ImageResource
  | TransactionResource
  | BookingResource
  | StockResource
  | StockAdjustmentResource
  | StockReservationResource
  | AvailabilityExceptionResource
  | ReviewResource
  | MessageResource
  | EventResource;

// Error response interface
export interface ApiError extends Error {
  status: number;
  statusText: string;
  data?: {
    errors?: Array<{
      status: number;
      code?: string;
      title: string;
      details?: { [key: string]: any };
    }>;
  };
}

// Query and command parameters
export interface QueryParams {
  [key: string]: any;
}

export interface BodyParams {
  [key: string]: any;
}

// Specific query parameter interfaces

// Common pagination and include parameters
export interface BaseQueryParams {
  page?: number; // positive integer - page number
  perPage?: number; // positive integer between 1 and 100 - number of resources per page
  include?: string[]; // comma-separated list of relationships to include
  expand?: boolean; // for write endpoints - return full resource or just reference
}

// Sparse attributes support - fields.* parameters
export interface SparseAttributes {
  [key: `fields.${string}`]: string[]; // e.g., "fields.listing": ["title", "description"]
}

// Relationship limiting support - limit.* parameters
export interface RelationshipLimits {
  [key: `limit.${string}`]: number; // e.g., "limit.images": 2
}

// Combined query parameters with sparse attributes support
export interface EnhancedQueryParams
  extends BaseQueryParams,
    SparseAttributes,
    RelationshipLimits {
  [key: string]: any;
}

// User query parameters
export interface UserQueryParams extends EnhancedQueryParams {
  createdAtStart?: Date | string; // ISO 8601 timestamp
  createdAtEnd?: Date | string; // ISO 8601 timestamp
  meta_?: string; // metadata filters, use meta_ATTRIBUTE_KEY=VALUE syntax
  priv_?: string; // privateData filters, use priv_ATTRIBUTE_KEY=VALUE syntax
  prot_?: string; // protectedData filters, use prot_ATTRIBUTE_KEY=VALUE syntax
  pub_?: string; // publicData filters, use pub_ATTRIBUTE_KEY=VALUE syntax
  sort?: string; // sorting criteria
}

// Listing query parameters
export interface ListingQueryParams extends EnhancedQueryParams {
  authorId?: ID;
  ids?: ID[]; // comma separated list, max 100
  states?: ListingState[];
  createdAtStart?: Date | string; // ISO 8601 timestamp
  createdAtEnd?: Date | string; // ISO 8601 timestamp
  keywords?: string;
  origin?: string; // "lat,lng" format
  bounds?: string; // "NE_lat,NE_lng,SW_lat,SW_lng" format
  price?: string; // price range, e.g., "1000,2000"
  start?: Date | string; // availability start time ISO 8601 timestamp
  end?: Date | string; // availability end time ISO 8601 timestamp
  seats?: number;
  availability?: "day-full" | "day-partial" | "time-full" | "time-partial";
  minDuration?: number;
  stockMode?: "strict" | "match-undefined";
  minStock?: number;
  pub_?: string; // publicData filters
  meta_?: string; // metadata filters
  sort?: string;
}

// Transaction query parameters
export interface TransactionQueryParams extends EnhancedQueryParams {
  createdAtStart?: Date | string; // ISO 8601 timestamp
  createdAtEnd?: Date | string; // ISO 8601 timestamp
  userId?: ID; // either customer or provider
  customerId?: ID;
  providerId?: ID;
  listingId?: ID;
  lastTransitions?: string[]; // transition names
  processNames?: string[];
  states?: string[];
  hasBooking?: boolean;
  hasStockReservation?: boolean;
  hasPayin?: boolean;
  hasMessage?: boolean;
  bookingStates?: string[];
  stockReservationStates?: string[];
  bookingStart?: Date | string; // ISO 8601 timestamp range
  bookingEnd?: Date | string; // ISO 8601 timestamp range
  prot_?: string; // protectedData filters
  meta_?: string; // metadata filters
  sort?: string;
}

// Availability Exception query parameters
export interface AvailabilityExceptionQueryParams extends EnhancedQueryParams {
  listingId: ID;
  start: Date | string; // ISO 8601 timestamp
  end: Date | string; // ISO 8601 timestamp
}

// Event query parameters
export interface EventQueryParams extends EnhancedQueryParams {
  startAfterSequenceId?: number;
  createdAtStart?: Date | string; // ISO 8601 timestamp
  resourceId?: ID;
  relatedResourceId?: ID;
  eventTypes?: string[];
}

// Stock Adjustment query parameters
export interface StockAdjustmentQueryParams extends EnhancedQueryParams {
  listingId: ID;
  start: Date | string; // ISO 8601 timestamp
  end: Date | string; // ISO 8601 timestamp
}

// Specific body parameter interfaces based on API documentation

// User API body parameters
export interface UpdateUserProfileParams {
  id: ID;
  firstName?: string;
  lastName?: string;
  displayName?: string | null;
  bio?: string | null;
  publicData?: ExtendedData;
  protectedData?: ExtendedData;
  privateData?: ExtendedData;
  metadata?: ExtendedData;
  profileImageId?: ID | null;
}

export interface ApproveUserParams {
  id: ID;
}

export interface UpdateUserPermissionsParams {
  id: ID;
  postListings?: "permission/allow" | "permission/deny";
  initiateTransactions?: "permission/allow" | "permission/deny";
  read?: "permission/allow" | "permission/deny";
}

// Listing API body parameters
export interface CreateListingParams {
  title: string;
  authorId: ID;
  state: "published" | "pendingApproval";
  description?: string;
  geolocation?: LatLng;
  price?: Money;
  availabilityPlan?: AvailabilityPlan;
  publicData?: ExtendedData;
  privateData?: ExtendedData;
  metadata?: ExtendedData;
  images?: ID[];
}

export interface UpdateListingParams {
  id: ID;
  title?: string;
  description?: string;
  geolocation?: LatLng | null;
  price?: Money | null;
  availabilityPlan?: AvailabilityPlan | null;
  publicData?: ExtendedData;
  privateData?: ExtendedData;
  metadata?: ExtendedData;
  images?: ID[];
}

export interface ApproveListingParams {
  id: ID;
}

export interface OpenListingParams {
  id: ID;
}

export interface CloseListingParams {
  id: ID;
}

// Transaction API body parameters
export interface TransitionTransactionParams {
  id: ID;
  transition: string;
  params?: ExtendedData;
}

export interface TransitionSpeculativeParams {
  id: ID;
  transition: string;
  params?: ExtendedData;
}

export interface UpdateTransactionMetadataParams {
  id: ID;
  metadata?: ExtendedData;
}

// Image API body parameters
export interface UploadImageParams {
  image: string | File | Blob; // File path string, File object, or Blob
}

// Availability Exception API body parameters
export interface CreateAvailabilityExceptionParams {
  listingId: ID;
  seats: number;
  start: Date | string; // ISO 8601 timestamp
  end: Date | string; // ISO 8601 timestamp
}

export interface DeleteAvailabilityExceptionParams {
  id: ID;
}

// Stock API body parameters
export interface CompareAndSetStockParams {
  listingId: ID;
  oldTotal: number | null;
  newTotal: number;
}

// Stock Adjustment API body parameters
export interface CreateStockAdjustmentParams {
  listingId: ID;
  quantity: number;
}

export interface CommandOptions extends SparseAttributes, RelationshipLimits {
  expand?: boolean;
  include?: string[];
  [key: string]: any;
}

// Rate limiter configuration
export interface RateLimiterConfig {
  bucketInitial: number;
  bucketIncreaseInterval: number;
  bucketIncreaseAmount: number;
  bucketMaximum: number;
}

export function createRateLimiter(config: RateLimiterConfig): any;

// Utility functions
export function objectQueryString(obj: { [key: string]: any }): string;

// Pre-defined rate limiter configurations
export const devQueryLimiterConfig: RateLimiterConfig;
export const devCommandLimiterConfig: RateLimiterConfig;
export const prodQueryLimiterConfig: RateLimiterConfig;
export const prodCommandLimiterConfig: RateLimiterConfig;

// Token stores
export interface MemoryStore extends TokenStore {}
export interface FileStore extends TokenStore {
  new (filePath: string): FileStore;
}

export function memoryStore(): MemoryStore;
export function fileStore(filePath: string): FileStore;

// SDK Method return types
type SDKMethodResult<T = any> = Promise<ApiResponse<T>>;

// SDK API structure
export interface MarketplaceAPI {
  show(
    queryParams?: { id?: ID } & SparseAttributes & RelationshipLimits,
    opts?: CommandOptions
  ): SDKMethodResult<MarketplaceResource>;
}

export interface UsersAPI {
  show(
    queryParams?: { id?: ID; email?: string } & SparseAttributes &
      RelationshipLimits,
    opts?: CommandOptions
  ): SDKMethodResult<UserResource>;
  query(
    queryParams?: UserQueryParams,
    opts?: CommandOptions
  ): Promise<PaginatedResponse<UserResource>>;
  updateProfile(
    bodyParams: UpdateUserProfileParams,
    opts?: CommandOptions
  ): SDKMethodResult<UserResource>;
  approve(
    bodyParams: ApproveUserParams,
    opts?: CommandOptions
  ): SDKMethodResult<UserResource>;
  updatePermissions(
    bodyParams: UpdateUserPermissionsParams,
    opts?: CommandOptions
  ): SDKMethodResult<UserResource>;
}

export interface ListingsAPI {
  show(
    queryParams?: { id?: ID } & SparseAttributes & RelationshipLimits,
    opts?: CommandOptions
  ): SDKMethodResult<ListingResource>;
  query(
    queryParams?: ListingQueryParams,
    opts?: CommandOptions
  ): Promise<PaginatedResponse<ListingResource>>;
  create(
    bodyParams: CreateListingParams,
    opts?: CommandOptions
  ): SDKMethodResult<ListingResource>;
  update(
    bodyParams: UpdateListingParams,
    opts?: CommandOptions
  ): SDKMethodResult<ListingResource>;
  approve(
    bodyParams: ApproveListingParams,
    opts?: CommandOptions
  ): SDKMethodResult<ListingResource>;
  open(
    bodyParams: OpenListingParams,
    opts?: CommandOptions
  ): SDKMethodResult<ListingResource>;
  close(
    bodyParams: CloseListingParams,
    opts?: CommandOptions
  ): SDKMethodResult<ListingResource>;
}

export interface TransactionsAPI {
  show(
    queryParams?: { id?: ID } & SparseAttributes & RelationshipLimits,
    opts?: CommandOptions
  ): SDKMethodResult<TransactionResource>;
  query(
    queryParams?: TransactionQueryParams,
    opts?: CommandOptions
  ): Promise<PaginatedResponse<TransactionResource>>;
  transition(
    bodyParams: TransitionTransactionParams,
    opts?: CommandOptions
  ): SDKMethodResult<TransactionResource>;
  transitionSpeculative(
    bodyParams: TransitionSpeculativeParams,
    opts?: CommandOptions
  ): SDKMethodResult<TransactionResource>;
  updateMetadata(
    bodyParams: UpdateTransactionMetadataParams,
    opts?: CommandOptions
  ): SDKMethodResult<TransactionResource>;
}

export interface ImagesAPI {
  upload(
    bodyParams: UploadImageParams,
    opts?: CommandOptions
  ): SDKMethodResult<ImageResource>;
}

export interface AvailabilityExceptionsAPI {
  query(
    queryParams: AvailabilityExceptionQueryParams,
    opts?: CommandOptions
  ): Promise<PaginatedResponse<AvailabilityExceptionResource>>;
  create(
    bodyParams: CreateAvailabilityExceptionParams,
    opts?: CommandOptions
  ): SDKMethodResult<AvailabilityExceptionResource>;
  delete(
    bodyParams: DeleteAvailabilityExceptionParams,
    opts?: CommandOptions
  ): SDKMethodResult<AvailabilityExceptionResource>;
}

export interface EventsAPI {
  query(
    queryParams?: EventQueryParams,
    opts?: CommandOptions
  ): Promise<PaginatedResponse<EventResource>>;
}

export interface StockAdjustmentsAPI {
  query(
    queryParams: StockAdjustmentQueryParams,
    opts?: CommandOptions
  ): Promise<PaginatedResponse<StockAdjustmentResource>>;
  create(
    bodyParams: CreateStockAdjustmentParams,
    opts?: CommandOptions
  ): SDKMethodResult<StockAdjustmentResource>;
}

export interface StockAPI {
  compareAndSet(
    bodyParams: CompareAndSetStockParams,
    opts?: CommandOptions
  ): SDKMethodResult<StockResource>;
}

export interface StockReservationsAPI {
  show(
    queryParams?: { id?: ID } & SparseAttributes & RelationshipLimits,
    opts?: CommandOptions
  ): SDKMethodResult<StockReservationResource>;
}

// Main SDK interface
export interface SharetribeIntegrationSDK {
  marketplace: MarketplaceAPI;
  users: UsersAPI;
  listings: ListingsAPI;
  transactions: TransactionsAPI;
  images: ImagesAPI;
  availabilityExceptions: AvailabilityExceptionsAPI;
  events: EventsAPI;
  stockAdjustments: StockAdjustmentsAPI;
  stock: StockAPI;
  stockReservations: StockReservationsAPI;

  // Authentication methods
  authInfo(): Promise<AuthInfo>;
  revoke(): Promise<void>;
}

// Create SDK instance function
export function createInstance(config: SdkConfig): SharetribeIntegrationSDK;

// Export namespace for types
export namespace types {
  export {
    UUID,
    ID,
    LatLng,
    LatLngBounds,
    Money,
    BigDecimal,
    toType,
    replacer,
    reviver,
  };
}

// Export namespace for token stores
export namespace tokenStore {
  export { memoryStore, fileStore, MemoryStore, FileStore };
}

// Export namespace for utilities
export namespace util {
  export {
    objectQueryString,
    createRateLimiter,
    devQueryLimiterConfig,
    devCommandLimiterConfig,
    prodQueryLimiterConfig,
    prodCommandLimiterConfig,
  };
}

// Pagination constraint types for better type safety
export type PageNumber = number; // Positive integer
export type PerPageNumber = number; // Positive integer between 1 and 100

// Enhanced pagination parameters with constraints
export interface PaginationParams {
  page?: PageNumber; // Positive integer - the page number
  perPage?: PerPageNumber; // Positive integer between 1 and 100 (default: 100)
}

// Pagination behavior documentation and utility types
export interface PaginationInfo {
  /** The default page size is 100 */
  readonly DEFAULT_PAGE_SIZE: 100;
  /** Minimum allowed page size */
  readonly MIN_PAGE_SIZE: 1;
  /** Maximum allowed page size */
  readonly MAX_PAGE_SIZE: 100;
  /** First page number */
  readonly FIRST_PAGE: 1;
}

// Common pagination response type for queries that return multiple resources
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: ResponseData<T[]> & {
    meta: ResponseMeta & {
      totalItems?: number | null;
      totalPages?: number | null;
      page: number;
      perPage: number;
      paginationLimit?: number;
      paginationUnsupported?: boolean;
    };
  };
}

// Utility types for denormalized data
// These types represent resources with their relationships resolved and included directly

// Helper type to resolve a relationship reference to its actual resource
type ResolveRelationship<T> = T extends { data: { id: ID; type: infer Type } }
  ? Type extends "user"
    ? UserResource
    : Type extends "listing"
    ? ListingResource
    : Type extends "transaction"
    ? TransactionResource
    : Type extends "booking"
    ? BookingResource
    : Type extends "image"
    ? ImageResource
    : Type extends "marketplace"
    ? MarketplaceResource
    : Type extends "stripeAccount"
    ? StripeAccountResource
    : Type extends "stock"
    ? StockResource
    : Type extends "stockReservation"
    ? StockReservationResource
    : Type extends "stockAdjustment"
    ? StockAdjustmentResource
    : Type extends "availabilityException"
    ? AvailabilityExceptionResource
    : Type extends "review"
    ? ReviewResource
    : Type extends "message"
    ? MessageResource
    : Type extends "event"
    ? EventResource
    : BaseResource
  : never;

// Helper type to resolve array relationships
type ResolveArrayRelationship<T> = T extends {
  data: Array<{ id: ID; type: infer Type }>;
}
  ? Type extends "image"
    ? ImageResource[]
    : Type extends "review"
    ? ReviewResource[]
    : Type extends "message"
    ? MessageResource[]
    : Type extends "stockAdjustment"
    ? StockAdjustmentResource[]
    : BaseResource[]
  : never;

// Utility type to denormalize relationships in a resource
type DenormalizeRelationships<T> = T extends { relationships?: infer R }
  ? R extends Record<string, any>
    ? {
        [K in keyof R]: R[K] extends { data: Array<any> }
          ? ResolveArrayRelationship<R[K]>
          : ResolveRelationship<R[K]>;
      }
    : {}
  : {};

// Base denormalized resource type
export type DenormalizedResource<T extends BaseResource> = Omit<
  T,
  "relationships"
> & {
  relationships?: DenormalizeRelationships<T>;
};

// Specific denormalized resource types
export type DenormalizedUserResource = DenormalizedResource<UserResource>;
export type DenormalizedListingResource = DenormalizedResource<ListingResource>;
export type DenormalizedTransactionResource =
  DenormalizedResource<TransactionResource>;
export type DenormalizedBookingResource = DenormalizedResource<BookingResource>;
export type DenormalizedStockAdjustmentResource =
  DenormalizedResource<StockAdjustmentResource>;
export type DenormalizedStockReservationResource =
  DenormalizedResource<StockReservationResource>;
export type DenormalizedAvailabilityExceptionResource =
  DenormalizedResource<AvailabilityExceptionResource>;
export type DenormalizedReviewResource = DenormalizedResource<ReviewResource>;
export type DenormalizedMessageResource = DenormalizedResource<MessageResource>;

// Union type for all denormalized resources
export type DenormalizedSpecificResource =
  | DenormalizedUserResource
  | DenormalizedListingResource
  | DenormalizedTransactionResource
  | DenormalizedBookingResource
  | DenormalizedStockAdjustmentResource
  | DenormalizedStockReservationResource
  | DenormalizedAvailabilityExceptionResource
  | DenormalizedReviewResource
  | DenormalizedMessageResource
  | MarketplaceResource // Marketplace typically doesn't have complex relationships
  | ImageResource // Images are typically leaf nodes
  | StockResource // Stock is simple
  | EventResource; // Events contain snapshot data

// Denormalized response types
export interface DenormalizedResponseData<T = any> {
  data: T;
  meta?: ResponseMeta;
  // Note: included array is not present in denormalized format as data is embedded
}

export interface DenormalizedApiResponse<T = any> {
  status: number;
  statusText: string;
  data: DenormalizedResponseData<T>;
}

export interface DenormalizedPaginatedResponse<T>
  extends DenormalizedApiResponse<T[]> {
  data: DenormalizedResponseData<T[]> & {
    meta: ResponseMeta & {
      totalItems?: number | null;
      totalPages?: number | null;
      page: number;
      perPage: number;
      paginationLimit?: number;
      paginationUnsupported?: boolean;
    };
  };
}

// Utility function types for denormalization
export interface DenormalizationOptions {
  include?: string[]; // Relationships to denormalize
  depth?: number; // Maximum depth of denormalization (default: 1)
}

// Overloaded denormalize function types for precise return type matching
export interface DenormalizeFunction {
  // Single resource overload
  <T extends SpecificResource>(
    response: ApiResponse<T>,
    options?: DenormalizationOptions
  ): DenormalizedApiResponse<DenormalizedResource<T>>;

  // Array of resources overload
  <T extends SpecificResource>(
    response: ApiResponse<T[]>,
    options?: DenormalizationOptions
  ): DenormalizedApiResponse<DenormalizedResource<T>[]>;

  // Paginated response overload
  <T extends SpecificResource>(
    response: PaginatedResponse<T>,
    options?: DenormalizationOptions
  ): DenormalizedPaginatedResponse<DenormalizedResource<T>>;
}
