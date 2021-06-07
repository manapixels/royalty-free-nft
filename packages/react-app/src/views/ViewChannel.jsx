import React from "react";
import { Spin, Card } from "antd";
import { useParams } from "react-router-dom";
import { formatEther } from "@ethersproject/units";

import { Address } from "../components";
import { useContractReader } from "../hooks";

const ViewChannel = ({ readContracts, mainnetProvider }) => {
  const { id } = useParams();
  const session = useContractReader(readContracts, "MVPC", "getSession", [id]);

  const timeLeft = Math.max(session.timeout - Date.now() / 1000, 0);

  return session ? (
    <div>
      <Card>
        <p>
          <b>Channel status: </b>
          {session.status === 1 ? "Opened" : "Closed"}
        </p>
        <p>
          <b>Stake: </b>
          {formatEther(session.stake)}
        </p>
        <p>
          <b>Signer: </b>
          <Address address={session.signer} ensProvider={mainnetProvider} fontSize={16} />
        </p>
        <p style={{ marginBottom: 0 }}>
          <b>Destination: </b>
          <Address address={session.destination} ensProvider={mainnetProvider} fontSize={16} />
        </p>
      </Card>
    </div>
  ) : (
    <div style={{ textAlign: "center" }}>
      <Spin />
    </div>
  );
};

export default ViewChannel;
