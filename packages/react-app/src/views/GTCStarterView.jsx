/* eslint-disable jsx-a11y/accessible-emoji */

import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import {ethers } from "ethers";
import { request } from 'graphql-request';

import { Address, Balance } from "../components";
import externalConfig from "../contracts/external_contracts.js";
export default function GTCStarterView({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [delegatorAddress, setDelegatorAddress] = useState("loading...");
  const [delegate, setDelegate] = useState([]);
  const endpoint = 'https://api.thegraph.com/subgraphs/name/viraj124/gtc';
  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>GTC Starter Kit</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
            onChange={e => {
              setDelegatorAddress(e.target.value)
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              const DELEGATOR_QUERY = `{
                delegate(id: "${delegatorAddress}") {
                  delegators
                }
              }`;
              const result = await request(endpoint, DELEGATOR_QUERY);
              const delegatee = result.delegate.delegators;
              setDelegate(delegatee);
            }}
          >
            Get Delegators
          </Button>
        </div>
      </div>
      <div style={{ textAlign: "left", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ marginTop: "20px", marginBottom: "10px" }}>Delegators</h2>
        {delegate.length === 0 && <p>Fetching delegates..</p>}
        {delegate.map(member => {
          return (
            <div style={{ marginTop: "10px" }}>
              <h3>{member}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
