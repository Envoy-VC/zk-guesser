use dep::std;

struct PublicKey {
    pub_x: [u8; 32],
    pub_y: [u8; 32],
}

impl PublicKey {
    fn from_xy(pub_x: [u8; 32], pub_y: [u8; 32]) -> PublicKey {
        PublicKey { pub_x, pub_y }
    }

    fn from_unified(pub_key: [u8; 64]) -> PublicKey {
        let (pub_x, pub_y) = split_u8_64_unconstrained(pub_key);

        PublicKey { pub_x, pub_y }
    }

    pub fn to_eth_address(self) -> Field {
        let pub_key = u8_32_to_u8_64_unconstrained(self.pub_x, self.pub_y);
        let hashed_pub_key = std::hash::keccak256(pub_key, 64);

        let mut addr: Field = 0;
        for i in 0..20 {
            addr = (addr * 256) + hashed_pub_key[i + 12] as Field;
        }

        addr
    }

    fn ecrecover(self, signature: [u8; 64], hashed_message: [u8; 32]) -> Field {
        let valid_signature = std::ecdsa_secp256k1::verify_signature(self.pub_x, self.pub_y, signature, hashed_message);
        assert(valid_signature, "Invalid signature");
        let addr = self.to_eth_address();
        addr
    }
}

unconstrained pub fn split_u8_64_unconstrained(arr: [u8; 64]) -> ([u8; 32], [u8; 32]) {
    let mut arr_a: [u8; 32] = [0; 32];
    let mut arr_b: [u8; 32] = [0; 32];

    for i in 0..32 {
        arr_a[i] = arr[i];
        arr_b[i] = arr[i + 32];
    }

    (arr_a, arr_b)
}

unconstrained pub fn u8_32_to_u8_64_unconstrained(arr_a: [u8; 32], arr_b: [u8; 32]) -> [u8; 64] {
    let mut combined: [u8; 64] = [0; 64];

    for i in 0..32 {
        combined[i] = arr_a[i];
    }
    for i in 0..32 {
        combined[i + 32] = arr_b[i];
    }

    combined
}
