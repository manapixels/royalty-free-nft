import React from "react";
import { Button, Input, Tooltip } from "antd";
import {AddressInput} from './'
import { createLazyMint, putLazyMint } from "../rarible/createLazyMint";

export default function LazyMint(props) {
  const [contractAddress, setContractAddress] = React.useState();
  const [ipfsHash, setIpfsHash] = React.useState();
  const [sending, setSending] = React.useState();
  console.log({writeContracts: props.writeContracts})
  return (
    <div>
      <AddressInput
        ensProvider={props.ensProvider}
        placeholder="Contract Address"
        value={contractAddress}
        onChange={newValue => {
          setContractAddress(newValue);
        }}
      />
      <Input
        value={ipfsHash}
        placeholder="IPFS Hash"
        onChange={e => {
          setIpfsHash(e.target.value);
        }}
      />
      <Button
        style={{ margin: 8 }}
        loading={sending}
        size="large"
        shape="round"
        type="primary"
        onClick={async () => {
          setSending(true);
          console.log("sending");
          const form = await createLazyMint(props.provider, contractAddress, props.accountAddress, ipfsHash)
          await putLazyMint(form)
          setSending(false);
        }}
      >
        Mint
      </Button>
    </div>
  );
}
