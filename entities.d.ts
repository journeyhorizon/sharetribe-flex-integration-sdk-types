import { LatLng, Money, UUID } from "./types";

type ExtendedData = Record<string, unknown>;
type EntityType =
  | "marketplace"
  | "user"
  | "stripeAccount"
  | "listing"
  | "availabilityException"
  | "image"
  | "transaction"
  | "booking"
  | "stock"
  | "stockAdjustment"
  | "stockReservation"
  | "review"
  | "message"
  | "event";

export interface IEntity<T extends EntityType = EntityType> {
  id: UUID;
  type: T;
  attributes: Record<string, unknown>;
  relationships: {
    [key: string]: {
      data:
        | { id: UUID; type: EntityType }
        | Array<{ id: UUID; type: EntityType }>;
    };
  };
}

export type PredefinedImageVariants =
  | "default"
  | "landscape-crop"
  | "landscape-crop2x"
  | "landscape-crop4x"
  | "landscape-crop6x"
  | "scaled-small"
  | "scaled-medium"
  | "scaled-large"
  | "scaled-xlarge"
  | "square-small"
  | "square-small2x"
  | "facebook"
  | "twitter";

export type ImageVariants = `variants.${PredefinedImageVariants}`;
export interface IImage extends IEntity<"image"> {
  attributes: {
    variants:
      | Record<
          PredefinedImageVariants,
          {
            name: string;
            width: number;
            height: number;
            url: string;
          }
        >
      | Record<
          string,
          {
            name: string;
            width: number;
            height: number;
            url: string;
          }
        >;
  };
}

export interface IMarketplace extends IEntity<"marketplace"> {
  attributes: {
    name: string;
  };
}

export interface IStripeAccount extends IEntity<"stripeAccount"> {
  attributes: {
    stripeAccountId: string;
  };
}

export type UserRelationships =
  | "marketplace"
  | "profileImage"
  | "stripeAccount";
export interface IUser<
  TPublicData extends ExtendedData = ExtendedData,
  TProtectedData extends ExtendedData = ExtendedData,
  TPrivateData extends ExtendedData = ExtendedData,
  TMetadata extends ExtendedData = ExtendedData
> extends IEntity<"user"> {
  attributes: {
    banned: boolean;
    deleted: boolean;
    createdAt: Date;
    email: string;
    emailVerified: boolean;
    pendingEmail: string | null;
    stripeConnected: boolean;
    identityProviders: Array<{ idpId: string; userId: string }>;
    profile: {
      firstName: string;
      lastName: string;
      displayName: string;
      abbreviatedName: string;
      bio: string | null;
      publicData: TPublicData;
      protectedData: TProtectedData;
      privateData: TPrivateData;
      metadata: TMetadata;
    };
  };
  profileImage: IImage | null;
  marketplace: IMarketplace;
  stripeAccount: IStripeAccount | null;
}

export interface IStock extends IEntity<"stock"> {
  attributes: {
    quantity: number;
  };
}

export type ListingRelationships =
  | "marketplace"
  | "author"
  | "author.profileImage"
  | "images"
  | "currentStock";
export interface IListing<
  TPublicData extends ExtendedData = ExtendedData,
  TPrivateData extends ExtendedData = ExtendedData,
  TMetadata extends ExtendedData = ExtendedData
> extends IEntity<"listing"> {
  attributes: {
    deleted: boolean;
    title: string;
    description: string | null;
    geolocation: LatLng | null;
    createdAt: Date;
    price: Money | null;
    state: "draft" | "pendingApproval" | "published" | "closed";
    availabilityPlan:
      | {
          type: "availability-plan/day";
          entries: Array<{
            dayOfWeek: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
            seats: number;
          }>;
        }
      | {
          type: "availability-plan/time";
          timezone: string;
          entries: Array<{
            seats: number;
            startTime: string;
            endTime: string;
          }>;
        };
    publicData: TPublicData;
    privateData: TPrivateData;
    metadata: TMetadata;
  };
  author: IUser;
  marketplace: IMarketplace;
  images: IImage[];
  currentStock: IStock | null;
}

export interface IAvailabilityException
  extends IEntity<"availabilityException"> {
  attributes: {
    seats: number;
    start: Date;
    end: Date;
  };
  listing: IListing;
}

export type TransactionRelationships =
  | "marketplace"
  | "listing"
  | "listing.images"
  | "listing.currentStock"
  | "provider"
  | "provider.profileImage"
  | "customer"
  | "customer.profileImage"
  | "booking"
  | "stockReservation"
  | "stockReservation.stockAdjustments"
  | "reviews"
  | "reviews.author"
  | "reviews.author.profileImage"
  | "reviews.subject"
  | "reviews.subject.profileImage"
  | "messages"
  | "messages.sender"
  | "messages.sender.profileImage";
export interface ITransaction<
  TProtectedData extends ExtendedData = ExtendedData,
  TMetadata extends ExtendedData = ExtendedData
> extends IEntity<"transaction"> {
  attributes: {
    createdAt: Date;
    processName: string;
    processVersion: number;
    lastTransition: string;
    lastTransitionedAt: Date;
    lineItems: Array<{
      code: string;
      unitPrice: Money;
      quantity?: number;
      units?: number;
      seats?: number;
      percentage?: number;
      lineTotal: Money;
      reversal: boolean;
      includedFor: Array<"customer" | "provider">;
    }>;
    payinTotal: Money;
    payoutTotal: Money;
    protectedData: TProtectedData;
    metadata: TMetadata;
    transitions: Array<{
      transition: string;
      createdAt: Date;
      by: "customer" | "provider" | "operator" | "system";
    }>;
  };
  marketplace: IMarketplace;
  listing: IListing;
  provider: IUser;
  customer: IUser;
  booking: IBooking | null;
  reviews: IReview[];
  messages: IMessage[];
  stockReservation: IStockReservation;
}

export interface IReview extends IEntity<"review"> {
  attributes: {
    type: "ofProvider" | "ofCustomer";
    state: "public" | "pending";
    rating: 0 | 1 | 2 | 3 | 4 | 5;
    content: string;
    createdAt: Date;
    deleted: boolean;
  };
  author: IUser;
  listing: IListing;
  subject: IUser;
  transaction: ITransaction;
}

export interface IMessage extends IEntity<"message"> {
  attributes: {
    content: string;
    createdAt: Date;
  };
  sender: IUser;
  transaction: ITransaction;
}

export interface IBooking extends IEntity<"booking"> {
  attributes: {
    seats: number;
    start: Date;
    end: Date;
    displayStart: Date;
    displayEnd: Date;
    state: "pending" | "proposed" | "accepted" | "declined" | "cancelled";
  };
  listing: IListing;
  transaction: ITransaction;
}

export type StockReservationRelationships =
  | "listing"
  | "listing.author"
  | "listing.currentStock"
  | "transaction"
  | "transaction.customer"
  | "transaction.provider"
  | "stockAdjustments";
export interface IStockReservation extends IEntity<"stockReservation"> {
  attributes: {
    quantity: number;
    state: "pending" | "proposed" | "accepted" | "declined" | "cancelled";
  };
  listing: IListing;
  transaction: ITransaction;
  stockAdjustment: IStockAdjustment;
}

export interface IStockAdjustment extends IEntity<"stockAdjustment"> {
  attributes: {
    quantity: number;
    at: Date;
  };
}

type EventTypes =
  | `${
      | "listing"
      | "user"
      | "availabilityException"
      | "message"
      | "booking"
      | "review"
      | "stockAdjustment"
      | "stockReservation"}.${"created" | "updated" | "deleted"}`
  | "transaction/initiated"
  | "transaction/transitioned"
  | "transaction/updated"
  | "transaction/deleted";

export interface IEvent extends IEntity<"event"> {
  attributes: {
    eventType: EventTypes;
    createdAt: Date;
    sequenceId: number;
    marketplaceId: UUID;
    source:
      | "source/marketplace-api"
      | "source/integration-api"
      | "source/transaction"
      | "source/console"
      | "source/admin";
    resourceId: UUID;
    resourceType: EntityType;
    resource: IEntity;
    previousValues: Record<string, unknown>;
    auditData: {
      userId: UUID | null;
      adminId: UUID | null;
      requestId: UUID | null;
      clientId: UUID | null;
    };
  };
}
