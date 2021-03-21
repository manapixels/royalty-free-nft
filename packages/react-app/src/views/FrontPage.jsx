import React, { useCallback, useEffect, useState } from "react";
import { Button, List, Modal, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { parseEther, formatEther } from "@ethersproject/units";
import { ethers } from "ethers";
import QR from "qrcode.react";
import { useContractReader, useEventListener, useLocalStorage, useLookupAddress } from "../hooks";
import { Address, AddressInput, Balance, Blockie } from "../components";

const axios = require("axios");

export default function FrontPage({
  executeTransactionEvents,
  contractName,
  localProvider,
  readContracts,
  price,
  mainnetProvider,
  blockExplorer,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };
  const [methodName, setMethodName] = useLocalStorage("addSigner");
  const [txnInfo, setTxnInfo] = useState(null);
  return (
    <div style={{ padding: 32, maxWidth: 750, margin: "auto" }}>
      <div style={{ paddingBottom: 32 }}>
        <div>
          <Balance
            address={readContracts ? readContracts[contractName].address : readContracts}
            provider={localProvider}
            dollarMultiplier={price}
            size={64}
          />
        </div>
        <div>
          <QR
            value={readContracts ? readContracts[contractName].address : ""}
            size="180"
            level="H"
            includeMargin
            renderAs="svg"
            imageSettings={{ excavate: false }}
          />
        </div>
        <div>
          <Address
            address={readContracts ? readContracts[contractName].address : readContracts}
            ensProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            fontSize={32}
          />
        </div>
      </div>
      <List
        bordered
        dataSource={executeTransactionEvents}
        renderItem={item => {
          let txnData = readContracts[contractName].interface.parseTransaction(item);
          // let ensAddress = useLookupAddress(mainnetProvider, txnData.args[0]);
          return (
            <>       
            <Modal title="Transaction Details" visible={isModalVisible} onOk={handleOk}>
              {txnInfo && <div>
                  <p><b>Event Name :</b> {txnInfo.functionFragment.name}</p>
                  <p><b>Function Signature :</b> {txnInfo.signature}</p>
                  <h4>Arguments :&nbsp;</h4>
              {
                txnInfo.functionFragment.inputs.map((element,index) => {
                  if(element.type === "address"){
                    return <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'left'}}>
                              <b>{element.name} :&nbsp;</b>
                      <Address address={txnInfo.args[index]} ensProvider={mainnetProvider}/>
                            </div>
                  }else if(element.type === "uint256"){
                    return <p><b>{element.name} : </b> {txnInfo.args[index] && txnInfo.args[index].toString()}</p>
                  }

                })
              }
                  <p><b>SigHash : &nbsp;</b>{txnInfo.sighash}</p>
              </div>}

            </Modal>
            <List.Item style={{ position: "relative" }}>
              
              <div style={{ position: "absolute", top: 55, fontSize: 12, opacity: 0.5, display:'flex', flexDirection:'row', width: "90%", justifyContent:'space-between' }}>
                  <p><b>Event Name :&nbsp;</b>{txnData.functionFragment.name}&nbsp;</p>
                  <p><b>Addressed to :&nbsp;</b>{txnData.args[0]}</p>
              </div>
              <b style={{ padding: 16 }}>#{item.nonce.toNumber()}</b>
              <span>
                <Blockie size={4} scale={8} address={item.hash} /> {item.hash.substr(0, 6)}
              </span>
              <Address address={item.to} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={16} />
              <Balance balance={item.value} dollarMultiplier={price} />
              <Button
                onClick={() => {
                    setTxnInfo(readContracts[contractName].interface.parseTransaction(item))
                  showModal()
                  console.log(
                    "🔥🔥🔥🔥",
                    // item
                    readContracts[contractName].interface.parseTransaction(item)
                  );
                }}
              >
                Txn Details
              </Button>
            </List.Item>
            </>
          );
        }}
      />
    </div>
  );
}
