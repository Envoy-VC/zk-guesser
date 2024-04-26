export interface Row {
  id: number;
  location_point: LocationPoint[];
  created_at: string;
}

export interface LocationPoint {
  x: number;
  y: number;
}
