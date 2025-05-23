import { Ntt } from "@wormhole-foundation/sdk-definitions-ntt";
import { Chain } from "@wormhole-foundation/sdk";
import dotenv from "dotenv"

dotenv.config();

export type NttContracts = {
  [key in Chain]?: Ntt.Contracts;
};

// export const DEVNET_SOL_PRIVATE_KEY = encoding.b58.encode(
//   new Uint8Array(
//     [218,95 //.. rest of the key
//     ])
// );
// export const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY


export const SQD_NTT_TOKENS: NttContracts = {
  Bsc: {
    token: "0xe50E3d1A46070444F44df911359033F2937fcC13",
    manager: "0x37DCb4E443a06A3FE0E7098519C1d81181E5322B",
    transceiver: {
      wormhole: "0xB9Abf20854E254Fe6A810523410235923EB280A1",
    }
  },
  Arbitrum: {
    token: "0x1337420dED5ADb9980CFc35f8f2B054ea86f8aB1",
    manager: "0x37DCb4E443a06A3FE0E7098519C1d81181E5322B",
    transceiver: { wormhole: "0xB9Abf20854E254Fe6A810523410235923EB280A1" },
  },
};