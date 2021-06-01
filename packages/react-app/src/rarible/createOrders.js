import { utils } from "ethers";
import { sign, getMessageHash } from "./order";

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
  return resJson;
}

function createERC721ForEthOrder(maker, contract, tokenId, price, salt) {
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
    salt,
  };
}

function createEthForERC721Order(maker, contract, tokenId, price, salt) {
  return {
    type: "RARIBLE_V2",
    maker: maker,
    take: {
      assetType: {
        assetClass: "ERC721",
        contract: contract,
        tokenId: tokenId,
      },
      value: "1",
    },
    make: {
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
    salt,
  };
}
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
        params.salt,
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

/*
  MAKE_ERC721_TAKE_ETH params
  - accountAddress
  - exchangeContract
  - makeERC721Address
  - makeERC721TokenId
  - ethAmt
*/
export const createSellOrderAsContract = async (type, provider, params, writeContracts) => {
  let order;
  let msgHash;
  const magicValue = "0x1626ba7e";
  switch (type) {
    case "MAKE_ERC721_TAKE_ETH":
      order = createERC721ForEthOrder(
        params.accountAddress,
        params.makeERC721Address,
        params.makeERC721TokenId,
        params.ethAmt,
        params.salt,
      );
      console.log({ order });
      const preparedOrder = await prepareOrderMessage(order);
      msgHash = await getMessageHash(provider, preparedOrder, params.accountAddress, params.exchangeContract);
      console.log({ msgHash });

      break;

    default:
      break;
  }

  console.log({ params });
  const signatureHash = utils.solidityKeccak256(["bytes"], [params.signature]);

  await writeContracts.NFTHolder.setFakeSignature(msgHash, signatureHash, magicValue, params.proposalId);
};

export const sendOrderToRarible = async (type, params) => {
  let order;
  switch (type) {
    case "MAKE_ERC721_TAKE_ETH":
      order = createERC721ForEthOrder(
        params.accountAddress,
        params.makeERC721Address,
        params.makeERC721TokenId,
        params.ethAmt,
        params.salt,
      );
      console.log({ order });
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
      signature: params.signature,
    }),
  });
  console.log({ raribleOrderResult });
};

export const matchSellOrder = async (sellOrder, params) => {
  const matchingOrder = createEthForERC721Order(
    params.accountAddress,
    sellOrder.make.assetType.contract,
    sellOrder.make.assetType.tokenId,
    sellOrder.take.value,
    params.salt || 0,
  );
  const preparedOrder = await prepareOrderMessage(matchingOrder);
  console.log({ preparedOrder });
  
  console.log({sellOrder})
  
  const preparedSellOrder = await prepareOrderMessage(createERC721ForEthOrder(
    sellOrder.maker,
    sellOrder.make.assetType.contract,
    sellOrder.make.assetType.tokenId,
    sellOrder.take.value,
    parseInt(Number(sellOrder.salt), 10)
  ))
  return {preparedOrder, preparedSellOrder};
};

export const matchOrder = async (provider, order) => {};
