use dep::std;
mod ecrecover;
mod coordinates;

#[export]
unconstrained fn get_distance(c1: coordinates::Coordinate, c2: coordinates::Coordinate) -> u64 {
    coordinates::distance(c1, c2)
}

fn main(
    range: pub [u64; 2],
    operator: pub Field,
    hashed_message: pub [u8; 32],
    signature: [u8; 64],
    publicKey: ecrecover::PublicKey,
    guess: coordinates::Coordinate,
    actual: coordinates::Coordinate
) {
    let recovered = publicKey.ecrecover(signature, hashed_message);
    assert(recovered == operator, "ZKGuesser: Invalid Signature");

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

    let hashed_message = [
        106, 66, 40, 170, 243, 63, 60, 17,
        56, 150, 90, 247, 119, 140, 24, 98,
        183, 76, 104, 12, 120, 164, 239, 194,
        63, 35, 27, 195, 193, 110, 80, 6
    ];

    let signature = [
        238, 40, 53, 223, 85, 186, 149, 138, 146, 3, 11,
        177, 242, 12, 241, 111, 50, 97, 95, 64, 246, 175,
        94, 161, 189, 107, 13, 229, 61, 221, 34, 54, 51,
        178, 47, 31, 48, 45, 218, 68, 130, 26, 16, 205,
        224, 81, 82, 188, 218, 175, 255, 197, 188, 225, 228,
        201, 184, 92, 195, 71, 113, 219, 141, 107
    ];
    let publicKey = ecrecover::PublicKey {
        pub_x: [
            224, 117, 65, 44, 181, 126, 126, 206,
            100, 136, 127, 140, 111, 57, 8, 6,
            16, 68, 199, 139, 215, 145, 174, 95,
            86, 106, 121, 40, 250, 45, 18, 86
        ],
        pub_y: [
            93, 241, 76, 152, 89, 186, 145, 163,
            91, 68, 228, 13, 213, 15, 15, 133,
            185, 64, 236, 186, 59, 140, 113, 57,
            87, 136, 133, 137, 109, 152, 133, 57
        ]
    };

    main(
        range,
        0x0009D5d42d946c42E8138D7EfE483118dbCA414B,
        hashed_message,
        signature,
        publicKey,
        c1,
        c2
    );
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
