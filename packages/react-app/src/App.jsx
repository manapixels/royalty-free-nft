import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Row, Col, Button, Menu, Alert, Switch as SwitchD } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { usePoller, useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, ThemeSwitch } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";
//import Hints from "./Hints";
import { Hints, ExampleUI, Subgraph } from "./views"
import { useThemeSwitcher } from "react-css-theme-switcher";
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, NETWORK, NETWORKS } from "./constants";
import ReactScrollWheelHandler from "react-scroll-wheel-handler";

import useSound from 'use-sound';
import sound1 from './1.mp3';
import sound2 from './2.mp3';
import sound4 from './4.mp3';
import sound5 from './5.mp3';
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/


/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS['localhost']; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true



// 🛰 providers
if(DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
const scaffoldEthProvider = new JsonRpcProvider("https://rpc.scaffoldeth.io:48544")
const mainnetInfura = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if(DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = mainnetInfura//new JsonRpcProvider(localProviderUrlFromEnv);


// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;


function App(props) {

  const mainnetProvider = (scaffoldEthProvider && scaffoldEthProvider._network) ? scaffoldEthProvider : mainnetInfura
  //if(DEBUG) console.log("🌎 mainnetProvider",mainnetProvider)

  const [injectedProvider, setInjectedProvider] = useState();
/*  const price = useExchangePrice(targetNetwork,mainnetProvider);

  const gasPrice = useGasPrice(targetNetwork,"fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);
  if(DEBUG) console.log("👩‍💼 selected address:",address)

  // You can warn the user if you would like them to be on a specific network
  let localChainId = localProvider && localProvider._network && localProvider._network.chainId
  if(DEBUG) console.log("🏠 localChainId",localChainId)

  let selectedChainId = userProvider && userProvider._network && userProvider._network.chainId
  if(DEBUG) console.log("🕵🏻‍♂️ selectedChainId:",selectedChainId)

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  if(DEBUG) console.log("💵 yourLocalBalance",yourLocalBalance?formatEther(yourLocalBalance):"...")

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);
  if(DEBUG) console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  if(DEBUG) console.log("📝 readContracts",readContracts)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)
  if(DEBUG) console.log("🔐 writeContracts",writeContracts)

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)
  console.log("🌍 DAI contract on mainnet:",mainnetDAIContract)
  //
  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])
  console.log("🥇 myMainnetDAIBalance:",myMainnetDAIBalance)


  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(readContracts,"YourContract", "purpose")
  console.log("🤗 purpose:",purpose)

  //📟 Listen for broadcast events
  const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);
  console.log("📟 SetPurpose events:",setPurposeEvents)



  let networkDisplay = ""
  if(localChainId && selectedChainId && localChainId != selectedChainId ){
    networkDisplay = (
      <div style={{zIndex:2, position:'absolute', right:0,top:60,padding:16}}>
        <Alert
          message={"⚠️ Wrong Network"}
          description={(
            <div>
              You have <b>{NETWORK(selectedChainId).name}</b> selected and you need to be on <b>{NETWORK(localChainId).name}</b>.
            </div>
          )}
          type="error"
          closable={false}
        />
      </div>
    )
  }else{
    networkDisplay = (
      <div style={{zIndex:-1, position:'absolute', right:154,top:28,padding:16,color:targetNetwork.color}}>
        {targetNetwork.name}
      </div>
    )
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [setRoute]);

  let faucetHint = ""
  const faucetAvailable = localProvider && localProvider.connection && localProvider.connection.url && localProvider.connection.url.indexOf(window.location.hostname)>=0 && !process.env.REACT_APP_PROVIDER && price > 1;

  const [ faucetClicked, setFaucetClicked ] = useState( false );
  if(!faucetClicked&&localProvider&&localProvider._network&&localProvider._network.chainId==31337&&yourLocalBalance&&formatEther(yourLocalBalance)<=0){
    faucetHint = (
      <div style={{padding:16}}>
        <Button type={"primary"} onClick={()=>{
          faucetTx({
            to: address,
            value: parseEther("0.01"),
          });
          setFaucetClicked(true)
        }}>
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    )
  }
  <img src="/glow.png" style={{position:"absolute",top:"11%",left:"%70",transform:"scale(5)",opacity:0.5}} />
*/
/*
  const [ light, setLight ] = useState(false)

  usePoller(()=>{
    if(Date.now()%16==1){
      setLight(true)
      let delay = Math.random()*64+64
      setTimeout(()=>{
        setLight(false)
      },delay)
      if(Math.random()*64>32){
        setTimeout(()=>{
          setLight(true)
        },delay+30)
        setTimeout(()=>{
          setLight(false)
        },delay+32+Math.random()*32)
      }
    }
  }, 60)*/

  const OGs = 10

  //const [ started, setStarted ] = useState()

  const bounds = [ 678, 1856, 478, 1089 ]

  const randomOG = ()=>{ return Math.floor(Math.random()*OGs)+1 }

  let startingOG
  while(!startingOG || startingOG == 1){
    startingOG = randomOG()
  }

  const [ currentPoster, setCurrentPoster ] = useState( startingOG )//random of posters

  useEffect(()=>{
    window.scrollTo( window.screen.width/6,window.screen.height/2 );
  },[])

  const [ renderedThings, setRenderedThings ] = useState([])

  let renderList = []

  const posterSize = 140

  for( let r in renderedThings ){
    //console.log(renderedThings[r])
    renderList.push(
      <div style={{position:"absolute", left: renderedThings[r].x-posterSize/2, top: renderedThings[r].y-(posterSize)/2 }}>
        <img src={"./"+renderedThings[r].poster+".png"} style={{translate:"rotate()",maxWidth:110}}/>
      </div>
    )
  }

  const [ mouseLocation, setMouseLocation ] = useState()
  let currentDisplay = ""
  let valid = false
  if( currentPoster && mouseLocation ){

    if(mouseLocation[0]>bounds[0] && mouseLocation[0]<bounds[1] && mouseLocation[1]>bounds[2] && mouseLocation[1]<bounds[3] ){
      valid = true
    }

    currentDisplay =   (
      <div style={{position:"absolute", left: mouseLocation[0]-posterSize/2, top: mouseLocation[1]-(posterSize)/2 }}>
        <img src={"./"+currentPoster+".png"} style={{opacity:valid?0.5:0.1,maxWidth:110}}/>
      </div>
    )

  }

  const [playSound1] = useSound(sound1);
  const [playSound2] = useSound(sound2);
  const [playSound4] = useSound(sound4);
  const [playSound5] = useSound(sound5);

  return (
    <ReactScrollWheelHandler
        upHandler={(e) => {
          let prevPoster = currentPoster-1
          if(prevPoster<=0) prevPoster = OGs;
          setCurrentPoster(prevPoster)
        }}
        downHandler={(e) => {
          let prevPoster = currentPoster-1
          if(prevPoster<=0) prevPoster = OGs;
          setCurrentPoster(prevPoster)
        }}
        onMouseMove = {(e) => {
          setMouseLocation([e.pageX,e.pageY])
        }}
    >
    <div className="App" >

      <div style={{position:"relative"}}>
        <img src="/animatedPNG.png" style={{width:window.screen.width}}/>
      </div>

      {renderList}

      {currentDisplay}

      <div onClick={(e)=>{
        if(valid){
          console.log("CKLIWDF",e.pageX,e.pageY)
          if (e.nativeEvent.which === 1) {
             console.log('Left click');
           } else if (e.nativeEvent.which === 3) {
             console.log('Right click');
           }

            if(Math.random()>0.3){
              playSound1()
            }else if(Math.random()>0.2){
              playSound2()
            }else if(Math.random()>0.3){
              playSound4()
            }else{
              playSound5()
            }

            setRenderedThings([...renderedThings,{poster:currentPoster,x:e.pageX, y:e.pageY, r: 1+Math.random()*0.1-Math.random()*0.1, s: 1+Math.random()*0.1-Math.random()*0.1 }])
            //setCurrentPoster( randomOG() )

        }else{

        }

      }} style={{position:"absolute",left:0,top:0,width:window.screen.width+100, height: window.screen.height+100}}>

      </div>


    </div>
    </ReactScrollWheelHandler>
  );
}


/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

 window.ethereum && window.ethereum.on('chainChanged', chainId => {
  setTimeout(() => {
    window.location.reload();
  }, 1);
})

export default App;
