struct Latitude {
    negative: bool,
    integral: i32,
    fractional: u32,
}

struct Longitude {
    negative: bool,
    integral: i32,
    fractional: u32,
}

struct Coordinate {
    latitude: Latitude,
    longitude: Longitude,
}

#[oracle(get_distance)]
unconstrained pub fn distance(c1: Coordinate, c2: Coordinate) -> u64 {}
