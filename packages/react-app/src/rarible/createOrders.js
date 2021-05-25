import { enc, ETH, ERC721 } from "./assets";
import { Asset, Order, sign } from "./order";

const ZERO = "0x0000000000000000000000000000000000000000";
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

async function prepareOrderMessage(form) {
  const raribleEncodeOrderUrl = "https://api-staging.rarible.com/protocol/v0.1/ethereum/order/encoder/order";
  const res = await fetch(raribleEncodeOrderUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  const resJson = await res.json();
  console.log({ resJson });
  return resJson
}

function createERC721ForEthOrder(maker, contract, tokenId, price) {
  return {
    type: "RARIBLE_V2",
    maker: maker,
    make: {
      assetType: {
        assetClass: "ERC721",
        contract: contract,
        tokenId: tokenId,
      },
      value: "1",
    },
    take: {
      assetType: {
        assetClass: "ETH",
      },
      value: price,
    },
    data: {
      dataType: "RARIBLE_V2_DATA_V1",
      payouts: [],
      originFees: [],
    },
    salt: `${random(1, 10000)}`,
  };
}
/*
  MAKE_ERC721_TAKE_ETH params
  - accountAddress
  - exchangeContract
  - makeERC721Address
  - makeERC721TokenId
  - ethAmt
*/
export const createSellOrder = async (type, provider, params) => {
  let order;
  let signature;
  switch (type) {
    case "MAKE_ERC721_TAKE_ETH":
      order = createERC721ForEthOrder(
        params.accountAddress,
        params.makeERC721Address,
        params.makeERC721TokenId,
        params.ethAmt,
      );
      console.log({ order });
      const preparedOrder = await prepareOrderMessage(order);
      signature = await sign(provider, preparedOrder, params.accountAddress, params.exchangeContract);

      break;

    default:
      break;
  }

  const raribleOrderUrl = "https://api-staging.rarible.com/protocol/v0.1/ethereum/order/orders";
  const raribleOrderResult = await fetch(raribleOrderUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...order,
      signature,
    }),
  });
  console.log({ raribleOrderResult });
};
