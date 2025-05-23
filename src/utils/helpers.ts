import {
    Chain,
    ChainAddress,
    ChainContext,
    Network,
    Signer,
    Wormhole,
    chainToPlatform,
    
  } from "@wormhole-foundation/sdk";
  
  import evm from "@wormhole-foundation/sdk/platforms/evm";
  import solana from "@wormhole-foundation/sdk/platforms/solana";
import { NttContracts, SQD_NTT_TOKENS } from "./const";
import { NttRoute } from "@wormhole-foundation/sdk-route-ntt";
  
  export interface SignerStuff<N extends Network, C extends Chain> {
    chain: ChainContext<N, C>;
    signer: Signer<N, C>;
    address: ChainAddress<C>;
  }
  
  export async function getSigner<N extends Network, C extends Chain>(
    chain: ChainContext<N, C>
  ): Promise<SignerStuff<N, C>> {
    // Read in from `.env`
    (await import("dotenv")).config();
  
    let signer: Signer;
    const platform = chainToPlatform(chain.chain);
    switch (platform) {
      // case "Solana":
      //   signer = await solana.getSigner(
      //     await chain.getRpc(),
      //     getEnv("OTHER_SOL_PRIVATE_KEY", DEVNET_SOL_PRIVATE_KEY),
      //     { debug: false }
      //   );
      //   break;
      case "Evm":
        signer = await evm.getSigner(
          await chain.getRpc(),
          getEnv("ETH_PRIVATE_KEY")
        );
        break;
      default:
        throw new Error("Unrecognized platform: " + platform);
    }
  
    return {
      chain,
      signer: signer as Signer<N, C>,
      address: Wormhole.chainAddress(chain.chain, signer.address()),
    };
  }
  
  // Use .env.example as a template for your .env file and populate it with secrets
  // for funded accounts on the relevant chain+network combos to run the example
  function getEnv(key: string, dev?: string): string {
    // If we're in the browser, return empty string
    if (typeof process === undefined) return "";
    // Otherwise, return the env var or error
    const val = process.env[key];
    if (!val) {
      if (dev) return dev;
      throw new Error(
        `Missing env var ${key}, did you forget to set values in '.env'?`
      );
    }
  
    return val;
  }

  // Reformat NTT contracts to fit TokenConfig for Route
function reformat(contracts: NttContracts) {
  return Object.entries(SQD_NTT_TOKENS).map(([chain, contracts]) => {
    const { token, manager, transceiver: xcvrs } = contracts!;
    const transceiver = Object.entries(xcvrs).map(([k, v]) => {
      return { type: k as NttRoute.TransceiverType, address: v };
    });
    return { chain: chain as Chain, token, manager, transceiver };
  });
}

export const NttTokens = {
  Test: reformat(SQD_NTT_TOKENS),
};