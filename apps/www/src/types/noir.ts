export type Coordinate = {
  latitude: {
    negative: boolean;
    integral: number;
    fractional: number;
  };
  longitude: {
    negative: boolean;
    integral: number;
    fractional: number;
  };
};

export type ZKGuesserInputs = {
  range: [number, number];
  operator: string;
  hashed_message: number[];
  signature: number[];
  publicKey: {
    pub_x: number[];
    pub_y: number[];
  };
  guess: Coordinate;
  actual: Coordinate;
};
