import {
  EventTypes,
  ExtendedData,
  IAvailabilityException,
  IEntity,
  IEvent,
  IImage,
  IListing,
  ImageVariants,
  IStock,
  IStockAdjustment,
  IStockReservation,
  ITransaction,
  IUser,
  ListingRelationships,
  StockReservationRelationships,
  TransactionRelationships,
  UserRelationships
} from "./entities";
import { LatLng, LatLngBounds, Money, UUID } from "./types";

export type SdkResponse<T extends IEntity | IEntity[] = IEntity> = {
  status: number;
  statusText: string;
  data: {
    data: T;
    included?: Array<IEntity>;
    meta: T extends IEntity[]
      ? {
          page: number;
          perPage?: number;
          totalItems: number;
          totalPages: number;
        }
      : undefined;
  };
};

export type IntegrationSdk = {
  users: {
    show: (
      params:
        | {
            id: UUID;
            include?: Array<UserRelationships>;
            "fields.images"?: Array<ImageVariants>;
            "fields.user"?: keyof IUser["attributes"];
          }
        | {
            email: string;
            include?: Array<UserRelationships>;
            "fields.images"?: Array<ImageVariants>;
            "fields.user"?: keyof IUser["attributes"];
          }
    ) => Promise<SdkResponse<IUser>>;
    query: (
      params?: Partial<{
        createdAtStart: Date;
        createdAtEnd: Date;
        [
          key:
            | `meta_${string}`
            | `pub_${string}`
            | `priv_${string}`
            | `prot_${string}`
        ]: string | number | string[] | number[] | undefined;
        sort?: string;
        include?: Array<UserRelationships>;
        "fields.images"?: Array<ImageVariants>;
        "fields.user"?: keyof IUser["attributes"];
        page?: number;
        perPage?: number;
      }>
    ) => Promise<SdkResponse<IUser[]>>;
    updateProfile: (
      params?: {
        id: UUID;
      } & Partial<{
        firstName: string;
        lastName: string;
        displayName: string;
        bio: string;
        publicData: ExtendedData;
        protectedData: ExtendedData;
        privateData: ExtendedData;
        metadata: ExtendedData;
        profileImageId: UUID;
      }>,
      queryParams?: {
        expand: boolean;
        include?: Array<UserRelationships>;
        "fields.images"?: Array<ImageVariants>;
        "fields.user"?: keyof IUser["attributes"];
      }
    ) => Promise<SdkResponse<IUser>>;
  };
  listings: {
    show: (params: {
      id: UUID;
      include?: Array<ListingRelationships>;
      "fields.images"?: Array<ImageVariants>;
      "fields.user"?: keyof IUser["attributes"];
      "fields.listing"?: keyof IListing["attributes"];
    }) => Promise<SdkResponse<IListing>>;
    query: (
      params?: Partial<{
        authorId: UUID;
        ids: string | UUID[];
        stats:
          | string
          | Array<"draft" | "pendingApproval" | "published" | "closed">;
        createdAtStart: Date;
        createdAtEnd: Date;
        keywords: string;
        origin: LatLng;
        bounds: LatLngBounds;
        price: Money;
        start: Date;
        end: Date;
        seats: number;
        availability: "day-full" | "day-partial" | "time-full" | "time-partial";
        minDuration: number;
        minStock: number;
        [key: `pub_${string}` | `meta_${string}`]:
          | undefined
          | string
          | Array<string>
          | number
          | number[];
        sort: string;
        include?: Array<ListingRelationships>;
        "fields.images"?: Array<ImageVariants>;
        "fields.user"?: keyof IUser["attributes"];
        "fields.listing"?: keyof IListing["attributes"];
        page?: number;
        perPage?: number;
      }>
    ) => Promise<SdkResponse<IListing[]>>;
    update: (
      params: {
        id: UUID;
      } & Partial<{
        title: string;
        description: string;
        geolocation: LatLng;
        price: Money;
        availabilityPlan:
          | {
              type: "availability-plan/day";
              entries: Array<{
                dayOfWeek:
                  | "mon"
                  | "tue"
                  | "wed"
                  | "thu"
                  | "fri"
                  | "sat"
                  | "sun";
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
        publicData: ExtendedData;
        privateData: ExtendedData;
        metadata: ExtendedData;
        images: UUID[];
      }>,
      queryParams?: {
        expand: boolean;
        include?: Array<ListingRelationships>;
        "fields.images"?: Array<ImageVariants>;
        "fields.user"?: keyof IUser["attributes"];
        "fields.listing"?: keyof IListing["attributes"];
      }
    ) => Promise<SdkResponse<IListing>>;
    close: (
      params: {
        id: UUID;
      },
      queryParams?: {
        expand: boolean;
        include?: Array<ListingRelationships>;
        "fields.images"?: Array<ImageVariants>;
        "fields.user"?: keyof IUser["attributes"];
        "fields.listing"?: keyof IListing["attributes"];
      }
    ) => Promise<SdkResponse<IListing>>;
    open: (
      params: {
        id: UUID;
      },
      queryParams?: {
        expand: boolean;
        include?: Array<ListingRelationships>;
        "fields.images"?: Array<ImageVariants>;
        "fields.user"?: keyof IUser["attributes"];
        "fields.listing"?: keyof IListing["attributes"];
      }
    ) => Promise<SdkResponse<IListing>>;
    approve: (
      params: {
        id: UUID;
      },
      queryParams?: {
        expand: boolean;
        include?: Array<ListingRelationships>;
        "fields.images"?: Array<ImageVariants>;
        "fields.user"?: keyof IUser["attributes"];
        "fields.listing"?: keyof IListing["attributes"];
      }
    ) => Promise<SdkResponse<IListing>>;
  };
  availabilityExceptions: {
    query: (params: {
      listingId: UUID;
      start: Date;
      end: Date;
      include?: Array<"listing">;
      "fields.listing"?: keyof IListing["attributes"];
      page?: number;
      perPage?: number;
    }) => Promise<SdkResponse<IAvailabilityException[]>>;
    create: (
      params: {
        listingId: UUID;
        start: Date;
        end: Date;
        seats: number;
      },
      queryParams?: {
        expand: boolean;
        include?: Array<"listing">;
        "fields.listing"?: keyof IListing["attributes"];
      }
    ) => Promise<SdkResponse<IAvailabilityException>>;
    delete: (
      params: {
        id: UUID;
      },
      queryParams?: {
        expand: boolean;
        include?: Array<"listing">;
        "fields.listing"?: keyof IListing["attributes"];
      }
    ) => Promise<SdkResponse<IAvailabilityException>>;
  };
  images: {
    upload: (
      params: {
        image: any;
      },
      queryParams?: {
        expand: boolean;
        "fields.images"?: Array<ImageVariants>;
      }
    ) => Promise<SdkResponse<IImage>>;
  };
  transactions: {
    show: (params: {
      id: UUID;
      include?: Array<TransactionRelationships>;
      "fields.listing"?: keyof IListing["attributes"];
      "fields.user"?: keyof IUser["attributes"];
      "fields.images"?: Array<ImageVariants>;
    }) => Promise<SdkResponse<ITransaction>>;
    query: (
      params?: Partial<{
        createdAtStart: Date;
        createdAtEnd: Date;
        userId: UUID;
        customerId: UUID;
        providerId: UUID;
        listingId: UUID;
        include?: Array<TransactionRelationships>;
        "fields.listing"?: keyof IListing["attributes"];
        "fields.user"?: keyof IUser["attributes"];
        "fields.images"?: Array<ImageVariants>;
        page?: number;
        perPage?: number;
      }>
    ) => Promise<SdkResponse<ITransaction[]>>;
    transition: (
      params: {
        id: UUID;
        transition: string;
        params: Record<string, unknown>;
      },
      queryParams?: {
        expand: boolean;
        include?: Array<TransactionRelationships>;
        "fields.listing"?: keyof IListing["attributes"];
        "fields.user"?: keyof IUser["attributes"];
        "fields.images"?: Array<ImageVariants>;
      }
    ) => Promise<SdkResponse<ITransaction>>;
    transitionSpeculative: (
      params: {
        id: UUID;
        transition: string;
        params: Record<string, unknown>;
      },
      queryParams?: {
        expand: boolean;
        include?: Array<TransactionRelationships>;
        "fields.listing"?: keyof IListing["attributes"];
        "fields.user"?: keyof IUser["attributes"];
        "fields.images"?: Array<ImageVariants>;
      }
    ) => Promise<SdkResponse<ITransaction>>;
    updateMetadata: (
      params: {
        id: UUID;
        metadata: Record<string, unknown>;
      },
      queryParams?: {
        expand: boolean;
        include?: Array<TransactionRelationships>;
        "fields.listing"?: keyof IListing["attributes"];
        "fields.user"?: keyof IUser["attributes"];
        "fields.images"?: Array<ImageVariants>;
      }
    ) => Promise<SdkResponse<ITransaction>>;
  };
  stock: {
    compareAndSet: (
      params: {
        listingId: UUID;
        oldTotal: number;
        newTotal: number;
      },
      queryParams?: {
        expand: boolean;
      }
    ) => Promise<SdkResponse<IStock>>;
  };
  stockAdjustments: {
    query: (params: {
      listingId: UUID;
      start: Date;
      end: Date;
      include?: Array<"listing" | "stockReservation">;
      page?: number;
      perPage?: number;
    }) => Promise<SdkResponse<IStockAdjustment[]>>;
    create: (
      params: {
        listingId: UUID;
        quantity: number;
      },
      queryParams?: {
        expand: boolean;
        include?: Array<"listing" | "stockReservation">;
      }
    ) => Promise<SdkResponse<IStockAdjustment>>;
  };
  stockReservations: {
    show: (params: {
      id: UUID;
      include?: Array<StockReservationRelationships>;
    }) => Promise<SdkResponse<IStockReservation>>;
  };
  events: {
    query: (
      params?: Partial<{
        startAfterSequenceId: number;
        createdAtStart: Date;
        resourceId: UUID;
        relatedResourceId: UUID;
        eventTypes: Array<EventTypes>;
        page?: number;
        perPage?: number;
      }>
    ) => Promise<SdkResponse<IEvent[]>>;
  };
};
