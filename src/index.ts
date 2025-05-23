import {
    TransactionId,
    Wormhole,
    amount,
    signSendWait,
  } from "@wormhole-foundation/sdk";
  import evm from "@wormhole-foundation/sdk/platforms/evm";

  // register protocol implementations
  import "@wormhole-foundation/sdk-evm-ntt";
  import "@wormhole-foundation/sdk-solana-ntt";
  import { SQD_NTT_TOKENS } from "./utils/const";
  import { getSigner } from "./utils/helpers";


  (async function () {
    const wh = new Wormhole("Mainnet", [evm.Platform, evm.Platform]);
    const src = wh.getChain("Arbitrum");
    const dst = wh.getChain("Bsc");

    const srcSigner = await getSigner(src);
    const dstSigner = await getSigner(dst);
  
    const srcNtt = await src.getProtocol("Ntt", {
      ntt: SQD_NTT_TOKENS[src.chain],
    });
    const dstNtt = await dst.getProtocol("Ntt", {
      ntt: SQD_NTT_TOKENS[dst.chain],
    });
  
    //TODO: change to token amount that should be transferred
    const amt = amount.units(
      amount.parse("10", await srcNtt.getTokenDecimals())
    );
  
    const xfer = () =>
      srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
        queue: false,
        automatic: false,
        gasDropoff: 0n,
      });

    // // Get calldata for simulation on tenderly (optional)
    // const firstTx = await xfer().next();
    // if (!firstTx.done) {
    //   const txData = firstTx.value.transaction.data;
    //   console.log("Transfer Calldata for EVM simulation:", txData);
    // }
  
    // Initiate the transfer
    const txids: TransactionId[] = await signSendWait(src, xfer(), srcSigner.signer);
    console.log("Source txs", txids);
  
    const vaa = await wh.getVaa(
      txids[txids.length - 1]!.txid,
      "Ntt:WormholeTransfer",
      25 * 60 * 1000
    );
    console.log(vaa);
  
    const dstTxids = await signSendWait(
      dst,
      dstNtt.redeem([vaa!], dstSigner.address.address),
      dstSigner.signer
    );
    console.log("dstTxids", dstTxids);
  })();