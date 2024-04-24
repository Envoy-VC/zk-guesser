use dep::std;
mod ecrecover;
mod coordinates;

#[export]
unconstrained fn get_distance(c1: coordinates::Coordinate, c2: coordinates::Coordinate) -> u64 {
    coordinates::distance(c1, c2)
}

fn main(
    range: pub [u64; 2],
    guess: coordinates::Coordinate,
    actual: coordinates::Coordinate,
    publicKey: ecrecover::PublicKey,
    signature: [u8; 64],
    hashed_message: [u8; 32]
) {
    let operator = 0x73979880be5A498fC205D4Ad7EB517d9B2e03c9d;
    assert(publicKey.ecrecover(signature, hashed_message) == operator, "ZKGuesser: Invalid Signature");

    let distance = get_distance(guess, actual);
    assert(distance >= range[0], "ZKGuesser: Distance out of range");
    assert(distance <= range[1], "ZKGuesser: Distance out of range");
}

#[test]
fn test_guess() {
    let range = [0, 1000];
    let c1 = coordinates::Coordinate {
        latitude: coordinates::Latitude { negative: false, integral: 52, fractional: 52 },
        longitude: coordinates::Longitude { negative: false, integral: 13, fractional: 4050 }
    };

    let c2 = coordinates::Coordinate {
        latitude: coordinates::Latitude { negative: false, integral: 51, fractional: 5047 },
        longitude: coordinates::Longitude { negative: true, integral: 0, fractional: 1278 }
    };

    let signature = [
        191, 21, 84, 47, 7, 134, 56, 201, 195, 27, 124,
        255, 117, 104, 176, 211, 125, 65, 43, 101, 47, 5,
        74, 223, 246, 18, 164, 19, 22, 15, 148, 97, 17,
        156, 245, 230, 49, 207, 16, 142, 6, 254, 75, 255,
        230, 54, 52, 161, 84, 138, 253, 252, 75, 146, 30,
        193, 63, 156, 134, 225, 7, 52, 210, 76
    ];
    let publicKey = ecrecover::PublicKey {
        pub_x: [
            57, 75, 55, 39, 97, 142, 247, 86,
            26, 215, 46, 10, 196, 46, 217, 135,
            26, 114, 151, 135, 65, 26, 58, 81,
            34, 20, 128, 84, 89, 69, 113, 80
        ],
        pub_y: [
            194, 204, 236, 13, 142, 215, 50,
            113, 123, 172, 198, 209, 211, 249,
            162, 5, 109, 90, 233, 85, 81,
            127, 75, 191, 251, 191, 103, 225,
            206, 206, 211, 50
        ]
    };

    let hashed_message = [
        29, 189, 253, 193, 67, 240, 35, 230,
        34, 55, 70, 114, 37, 234, 124, 228,
        108, 45, 102, 115, 115, 181, 253, 190,
        165, 57, 67, 99, 118, 95, 55, 104
    ];

    main(range, c1, c2, publicKey, signature, hashed_message);
}

#[test]
fn test_key_to_address() {
    let pub_key_x = [
        57, 75, 55, 39, 97, 142, 247, 86,
        26, 215, 46, 10, 196, 46, 217, 135,
        26, 114, 151, 135, 65, 26, 58, 81,
        34, 20, 128, 84, 89, 69, 113, 80
    ];
    let pub_key_y = [
        194, 204, 236, 13, 142, 215, 50,
        113, 123, 172, 198, 209, 211, 249,
        162, 5, 109, 90, 233, 85, 81,
        127, 75, 191, 251, 191, 103, 225,
        206, 206, 211, 50
    ];

    let key = ecrecover::PublicKey { pub_x: pub_key_x, pub_y: pub_key_y };
    let addr = key.to_eth_address();
    assert(addr == 0x73979880be5A498fC205D4Ad7EB517d9B2e03c9d);
}

#[test]
fn test_verifySig() {
    let pub_key_x = [
        57, 75, 55, 39, 97, 142, 247, 86,
        26, 215, 46, 10, 196, 46, 217, 135,
        26, 114, 151, 135, 65, 26, 58, 81,
        34, 20, 128, 84, 89, 69, 113, 80
    ];
    let pub_key_y = [
        194, 204, 236, 13, 142, 215, 50,
        113, 123, 172, 198, 209, 211, 249,
        162, 5, 109, 90, 233, 85, 81,
        127, 75, 191, 251, 191, 103, 225,
        206, 206, 211, 50
    ];

    let signature = [
        191, 21, 84, 47, 7, 134, 56, 201, 195, 27, 124,
        255, 117, 104, 176, 211, 125, 65, 43, 101, 47, 5,
        74, 223, 246, 18, 164, 19, 22, 15, 148, 97, 17,
        156, 245, 230, 49, 207, 16, 142, 6, 254, 75, 255,
        230, 54, 52, 161, 84, 138, 253, 252, 75, 146, 30,
        193, 63, 156, 134, 225, 7, 52, 210, 76
    ];
    let hashed_message = [
        29, 189, 253, 193, 67, 240, 35, 230,
        34, 55, 70, 114, 37, 234, 124, 228,
        108, 45, 102, 115, 115, 181, 253, 190,
        165, 57, 67, 99, 118, 95, 55, 104
    ];

    let key = ecrecover::PublicKey { pub_x: pub_key_x, pub_y: pub_key_y };
    assert(key.ecrecover(signature, hashed_message) == 0x73979880be5A498fC205D4Ad7EB517d9B2e03c9d);
}
