declare class UUID {
  uuid: string;
  _sdkType: 'UUID';
  constructor(uuid: string)
}

declare class LatLng {
  lat: number;
  lng: number;
  _sdkType: 'LatLng'
  constructor(lat: number, lng: number)
}

declare class LatLngBounds {
  ne: LatLng;
  sw: LatLng;
  _sdkType: 'LatLngBounds';
  constructor(ne: LatLng, sw: LatLng);
}

declare class Money {
  amount: number;
  currency: string;
  _sdkType: 'Money';
  constructor(amount: number, currency: string);
}

declare class BigDecimal {
  value: number;
  _sdkType: 'BigDecimal';
  constructor(value: number) 
}

export type types = {
  UUID: typeof UUID,
  LatLng: typeof LatLng
  LatLngBounds: typeof LatLngBounds;
  Money: typeof Money;
  BigDecimal: typeof BigDecimal;
}