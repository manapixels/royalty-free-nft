import React from "react";
import { Button, Input, Tooltip } from "antd";
import { createSellOrderAsContract, sendOrderToRarible } from "../rarible/createOrders";
import { RARIBLE_EXCHANGE_RINKEBY, RINKEBY_NFT_HOLDER_ADDRESS } from "../constants";
const { utils } = require("ethers");

function handleMenuClick(e) {
  console.log("click", e);
}

export default function SellAsContract(props) {
  const [sellState, setSellState] = React.useState();
  const [sellForEthValue, setSellForEthValue] = React.useState();
  const [proposalId, setProposalId] = React.useState();
  const [salt, setSalt] = React.useState();
  const [daoSig, setDaoSig] = React.useState();
  const buttons = (
    <Tooltip placement="right" title="* 10 ** 18">
      <div
        type="dashed"
        style={{ cursor: "pointer" }}
        onClick={async () => {
          try {
            setSellForEthValue(utils.parseEther(sellForEthValue));
          } catch {
            console.log("enter a value");
          }
        }}
      >
        ✴️
      </div>
    </Tooltip>
  );
  return (
    <div>
      <Button onClick={() => setSellState("YERC")}>Sell for YERC</Button>
      <Button onClick={() => setSellState("ETH")}>Sell for ETH</Button>

      {(sellState && sellState === "ETH" && (
        <div>
          <Input
            value={sellForEthValue}
            placeholder="ETH"
            onChange={e => {
              setSellForEthValue(e.target.value);
            }}
            suffix={buttons}
          />
          <Input
            value={proposalId}
            placeholder="0"
            onChange={e => {
              setProposalId(e.target.value);
            }}
          />
          <Input
            value={daoSig}
            placeholder="Signature..."
            onChange={e => {
              setDaoSig(e.target.value);
            }}
          />
          <Input
            value={salt}
            placeholder="salt... 0-10000"
            onChange={e => {
              setSalt(e.target.value);
            }}
          />
          <Button
            onClick={() =>
              createSellOrderAsContract(
                "MAKE_ERC721_TAKE_ETH",
                props.provider,
                {
                  accountAddress: RINKEBY_NFT_HOLDER_ADDRESS,
                  exchangeContract: RARIBLE_EXCHANGE_RINKEBY,
                  makeERC721Address: props.ERC721Address,
                  makeERC721TokenId: props.tokenId,
                  ethAmt: sellForEthValue.toString(),
                  proposalId: proposalId.toString(),
                  salt: salt.toString(),
                  signature: daoSig,
                },
                props.writeContracts,
              )
            }
          >
            Create Sell Order as Contract
          </Button>
          <Button
            onClick={() =>
              sendOrderToRarible("MAKE_ERC721_TAKE_ETH", {
                accountAddress: RINKEBY_NFT_HOLDER_ADDRESS,
                exchangeContract: RARIBLE_EXCHANGE_RINKEBY,
                makeERC721Address: props.ERC721Address,
                makeERC721TokenId: props.tokenId,
                ethAmt: sellForEthValue.toString(),
                proposalId: proposalId.toString(),
                salt: salt.toString(),
                signature: daoSig,
              })
            }
          >
            Send order (once tx mines)
          </Button>
        </div>
      )) ||
        (sellState === "YERC" && <span>YERC</span>)}
    </div>
  );
}
