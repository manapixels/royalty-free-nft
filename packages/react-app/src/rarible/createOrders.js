import { enc, ETH, ERC721 } from "./assets";
import { Asset, Order, sign } from "./order";

const ZERO = "0x0000000000000000000000000000000000000000";

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
      order = Order(
        params.accountAddress,
        Asset(ERC721, enc(params.makeERC721Address, params.makeERC721TokenId), 1),
        ZERO,
        Asset(ETH, "0x", params.ethAmt),
        1,
        0,
        0,
        "0xffffffff", // Todo replace with real order data
        "0x", //todo replace with real order data
      );
      console.log({ order });
      signature = await sign(provider, order, params.accountAddress, params.exchangeContract);

      break;

    default:
      break;
  }

  const raribleOrderUrl = "https://api-dev.rarible.com/protocol/v0.1/ethereum/order/orders";
  const raribleOrderResult = await fetch(raribleOrderUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...order,
      signature,
      type: "RARIBLE_V1",
      data: {
        dataType: "LEGACY",
        fee: 0,
      },
    }),
  });
  console.log({ raribleOrderResult });
};
