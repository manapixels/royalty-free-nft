import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
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


  const OGs = 29//24






/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS['localhost']; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true

const newScale = 0.77
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

const cleanPosterID = (num)=>{
  //console.log(num)
  if(num=="6"||num=="13"){
    return num+"_1"
  }
  return num
}


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


  const [scrollTop, setScrollTop] = useState(0);
  useEffect(() => {
    const onScroll = e => {
      setScrollTop(Math.min(e.target.documentElement.scrollTop,1100));
      //setScrolling(e.target.documentElement.scrollTop > scrollTop);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

console.log("scrollTop",scrollTop)


  //const [ started, setStarted ] = useState()

  const bounds = [ 700, 1936, 512, 1150  ]

  const randomOG = ()=>{ return Math.floor(Math.random()*OGs)+1 }

  let startingOG
  while(!startingOG || startingOG == 1){
    startingOG = randomOG()
  }

  const [ currentPoster, setCurrentPoster ] = useState( startingOG )//random of posters

  useEffect(()=>{
    setTimeout(()=>{
      window.scrollTo( window.screen.width/10, 0 );
    },500)

  },[])

  const [ renderedThings, setRenderedThings ] = useState([])


  let renderList = []

  const posterSize = 140

  for( let r in renderedThings ){
    //console.log(renderedThings[r])
    renderList.push(
      <div key={"poster"+r} style={{opacity:1-0.5*scrollTop/1700,position:"absolute", left: renderedThings[r].x-posterSize/2, top: renderedThings[r].y-(posterSize)/2 }}>
        <img src={"./"+cleanPosterID(renderedThings[r].poster)+".png"} style={{translate:"rotate()",maxWidth:110}}/>
      </div>
    )
  }

  const [ mouseLocation, setMouseLocation ] = useState()
  let currentDisplay = ""
  let valid = false
  if( currentPoster && mouseLocation ){

    if(mouseLocation[0]>bounds[0]*newScale && mouseLocation[0]<bounds[1]*newScale && mouseLocation[1]>bounds[2]*newScale && mouseLocation[1]<bounds[3]*newScale ){
      valid = true
    }

    currentDisplay =   (
      <div style={{position:"absolute", left: mouseLocation[0]-posterSize/2, top: mouseLocation[1]-(posterSize)/2 }}>
        <img src={"./"+cleanPosterID(currentPoster)+".png"} style={{opacity:valid?0.5:0.1,maxWidth:110}}/>
      </div>
    )

  }

  const [playSound1] = useSound(sound1);
  const [playSound2] = useSound(sound2);
  const [playSound4] = useSound(sound4);
  const [playSound5] = useSound(sound5);



  const clickFunction = (e)=>{
    //console.log("CLICK",e)

    let validDoubleCheck = false
    if(e.pageX>bounds[0]*newScale && e.pageX<bounds[1]*newScale && e.pageY>bounds[2]*newScale && e.pageY<bounds[3]*newScale ){
      validDoubleCheck = true
    }

    if(validDoubleCheck){
      console.log("PASTE IT!",e.pageX,e.pageY)

        let newRenderedThingsShouldBe = [...renderedThings,{poster:currentPoster,x:e.pageX, y:e.pageY, r: 1+Math.random()*0.1-Math.random()*0.1, s: 1+Math.random()*0.1-Math.random()*0.1 }]
        //console.log("newRenderedThingsShouldBe",newRenderedThingsShouldBe)
        setRenderedThings( newRenderedThingsShouldBe )
        setCurrentPoster( randomOG() )

                if(Math.random()>0.3){
                  playSound1()
                }else if(Math.random()>0.2){
                  playSound2()
                }else if(Math.random()>0.3){
                  playSound4()
                }else{
                  playSound5()
                }
    }else{

    }

  }



  useEffect(()=>{
    window.addEventListener('touchstart', clickFunction, false);
  },[ setRenderedThings, renderedThings ])

  const hardSpacer = 16
  const scheduleZoom = 0.8
  const scheduleOrigin = "0% 0%"
  const wallSize = 1300

  const rowStyle = { borderBottom: "8px solid #444444", paddingBottom:hardSpacer }
  const colStyle = { marginTop:hardSpacer, padding:8, letterSpacing:-1.5 }
  const posterStyle = { maxWidth:136 }

  const textStyle = { fontFamily:"'Press Start 2P'", fontSize:22 }
  const secondTextStyle = { fontFamily:"'Press Start 2P'", fontSize:16}

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

      <div style={{position:"relative",opacity:1-1*scrollTop/1700}}>
        <img src="/ognftdate.png" style={{width:2660*newScale, height:1540*newScale}}/>
        {/*<img src="/tv.gif" style={{zIndex:1,position:"absolute",top:1033*newScale,left:517*newScale,maxWidth:240*newScale}} />*/}

        <div style={{position:"fixed",right:32,top:16,zIndex:2}}>

          <img src="./twitter.png" style={{maxWidth:100, cursor:"pointer"}} onClick={()=>{
            window.open("https://twitter.com/OG_NFT")
          }}/>

          <img src="./twitch.png" style={{marginLeft:8,maxWidth:80, cursor:"pointer"}} onClick={()=>{
            window.open("https://www.twitch.tv/ognft")
          }}/>

          <img src="./youtube.png" style={{marginLeft:26, maxWidth:80, cursor:"pointer"}} onClick={()=>{
            window.open("https://www.youtube.com/channel/UCtEWm5BNiZJi-2sfcYjGTjw")
          }}/>

        </div>
      </div>

      {renderList}

      {currentDisplay}

      <div onTouchStart={clickFunction}  onClick={clickFunction} style={{position:"absolute",left:0,top:0,width:window.screen.width+100, height: window.screen.height+100}}>

      </div>

      <div style={{position:"absolute",opacity:1,top:1900-Math.min(2000,scrollTop*1.6),left:500}}>
        <img src="./middlebuilding.png" style={{minWidth:wallSize*0.9}} />
      </div>

      <div style={{position:"absolute",top:2000-scrollTop,left:400}}>
        <div><img src="./bdl.png" style={{minWidth:wallSize}} /></div>
        <div><img src="./bdl2.png" style={{minWidth:wallSize}} /></div>
      </div>

      {/* <div style={{position:"absolute",top:400-scrollTop,left:280, fontFamily:"'Press Start 2P'", fontSize:16,color:"#ffffff" }}> MINT NFTs  <CaretRightOutlined /></div> */}

      <div style={{position:"absolute",top:600-scrollTop,left:280, fontFamily:"'Press Start 2P'", fontSize:16,color:"#ffffff" }}> SCHEDULE  <CaretDownOutlined /></div>

      {/* <div style={{position:"absolute",top:800-scrollTop,left:1580, fontFamily:"'Press Start 2P'", fontSize:16,color:"#ffffff" }}> <Button type="primary" onClick={()=>{alert("coming soon ;)")}}>MINT NFT</Button></div>
*/}

      <div style={{position:"absolute",top:2100-scrollTop,left:522,width:1448,transform:"scale("+scheduleZoom+")",transformOrigin:scheduleOrigin}}>

        <Row style={rowStyle} >
          <Col span={4} style={colStyle}>
            <div style={textStyle}>INTRO</div>
            <div style={secondTextStyle}>~ 11:00 AM ET</div>
            <div style={secondTextStyle}>4/20</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./4.png"} style={posterStyle}/>
          </Col>
          <Col style={colStyle}>
            <img src={"./9.png"} style={posterStyle}/>
          </Col>
        </Row>

        <Row style={rowStyle} >
          <Col span={4} style={colStyle}>
            <div style={textStyle}>TBD</div>
            <div style={secondTextStyle}>~ 11:15 AM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./8.png"} style={posterStyle}/>
          </Col>
          <Col span={4} style={colStyle}>
            <div style={textStyle}>Lessons From Early Days of Ujo</div>
            <div style={secondTextStyle}>~ 11:30 AM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./2.png"} style={posterStyle}/>
          </Col>
          <Col span={4} style={colStyle}>
            <div style={textStyle}>Behavioral Economics and NFTs (Live Experiment!!!)</div>
            <div style={secondTextStyle}>~ 11:45 AM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./13_1.png"} style={posterStyle}/>
          </Col>
        </Row>



        <Row style={rowStyle} >
          <Col span={4} style={colStyle}>
            <div style={textStyle}>OG PANEL</div>
            <div style={secondTextStyle}>~ 12:00 PM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./5.png"} style={posterStyle}/>
          </Col>
          <Col style={colStyle}>
            <img src={"./4.png"} style={posterStyle}/>
          </Col>
          <Col  style={colStyle}>
            <img src={"./2.png"} style={posterStyle}/>
          </Col>
          <Col style={colStyle}>
            <img src={"./8.png"} style={posterStyle}/>
          </Col>
          <Col span={4} style={colStyle}>
            <div style={textStyle}>An Introduction to Flowertokens</div>
            <div style={secondTextStyle}>~ 12:45 PM ET</div>
          </Col>
          <Col  style={colStyle}>
             <img src={"./29.png"} style={posterStyle}/>
          </Col>
        </Row>


        <Row style={rowStyle} >

          <Col span={6} style={colStyle}>
            <div style={textStyle}>How It Started ... How It’s Going</div>
            <div style={secondTextStyle}>~ 1:00 PM ET</div>
          </Col>
          <Col  style={colStyle}>
             <img src={"./30.png"} style={posterStyle}/>
          </Col>
          <Col span={6} style={colStyle}>
            <div style={textStyle}>Wanderer Above a Sea of FUD</div>
            <div style={secondTextStyle}>~ 1:15 PM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./5.png"} style={posterStyle}/>
          </Col>
          <Col style={colStyle}>
            <img src={"./27.png"} style={posterStyle}/>
          </Col>
        </Row>

        <Row style={rowStyle} >
          <Col span={6} style={colStyle}>
            <div style={textStyle}>Evolution of Cryptoart</div>
            <div style={secondTextStyle}>~ 1:30 PM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./11.png"} style={posterStyle}/>
          </Col>
          <Col style={colStyle}>
            <img src={"./16.png"} style={posterStyle}/>
          </Col>
          <Col style={colStyle}>
            <img src={"./27.png"} style={posterStyle}/>
          </Col>
        </Row>


        <Row style={rowStyle} >
          <Col span={4} style={colStyle}>
            <div style={textStyle}>AUDIO PANEL</div>
            <div style={secondTextStyle}>~ 2:00 PM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./6_1.png"} style={posterStyle}/>
          </Col>
          <Col  style={colStyle}>
            <img src={"./25.png"} style={posterStyle}/>
          </Col>
          <Col  style={colStyle}>
            <img src={"./28.png"} style={posterStyle}/>
          </Col>
          <Col  style={colStyle}>
            <img src={"./2.png"} style={posterStyle}/>
          </Col>
          <Col  style={colStyle}>
            <img src={"./26.png"} style={posterStyle}/>
          </Col>
        </Row>


        <Row style={rowStyle} >
          <Col span={4} style={colStyle}>
            <div style={textStyle}>FUTURE PANEL</div>
            <div style={secondTextStyle}>~ 2:30 PM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./17.png"} style={posterStyle}/>
          </Col>
          <Col  style={colStyle}>
            <img src={"./14.png"} style={posterStyle}/>
          </Col>
          <Col  style={colStyle}>
            <img src={"./15.png"} style={posterStyle}/>
          </Col>
          <Col  style={colStyle}>
            <img src={"./7.png"} style={posterStyle}/>
          </Col>
          <Col style={colStyle}>
            <img src={"./3.png"} style={posterStyle}/>
          </Col>
        </Row>


        <Row style={rowStyle} >
          <Col span={6} style={colStyle}>
            <div style={textStyle}>The Curse of Non-Fungibility</div>
            <div style={secondTextStyle}>~ 3:00 PM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./10.png"} style={posterStyle}/>
          </Col>
          <Col span={6} style={colStyle}>
            <div style={textStyle}>TBD</div>
            <div style={secondTextStyle}>~ 3:15 PM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./12.png"} style={posterStyle}/>
          </Col>
        </Row>

        <Row style={rowStyle} >
          <Col span={6} style={colStyle}>
            <div style={textStyle}>TBD</div>
            <div style={secondTextStyle}>~ 3:30 PM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./11.png"} style={posterStyle}/>
          </Col>
          <Col span={6} style={colStyle}>
            <div style={textStyle}>Notes on the Synthesis of Digital Form</div>
            <div style={secondTextStyle}>~ 3:45 PM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./4.png"} style={posterStyle}/>
          </Col>
        </Row>


        <Row style={rowStyle} >
          <Col span={4} style={colStyle}>
            <div style={textStyle}>ERC721 ORIGIN STORY</div>
            <div style={secondTextStyle}>~ 4PM ET</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./19.png"} style={posterStyle}/>
          </Col>
          <Col style={colStyle}>
            <img src={"./18.png"} style={posterStyle}/>
          </Col>
          <Col  style={colStyle}>
            <img src={"./20.png"} style={posterStyle}/>
          </Col>
          <Col style={colStyle}>
            <img src={"./21.png"} style={posterStyle}/>
          </Col>
          <Col  style={colStyle}>
            <img src={"./22.png"} style={posterStyle}/>
          </Col>
          <Col style={colStyle}>
            <img src={"./23.png"} style={posterStyle}/>
          </Col>
          <Col  style={colStyle}>
            <img src={"./24.png"} style={posterStyle}/>
          </Col>

        </Row>

        <Row style={rowStyle} >
          <Col span={4} style={colStyle}>
            <div style={textStyle}>CLOSING</div>
            <div style={secondTextStyle}>~ 4:45 PM ET</div>
            <div style={secondTextStyle}>4/20</div>
          </Col>
          <Col  style={colStyle}>
            <img src={"./9.png"} style={posterStyle}/>
          </Col>
        </Row>


        <div style={{marginLeft:-100,position:"relative"}}>

          <img src="./twitter.png" style={{maxWidth:300, cursor:"pointer",marginTop:-16,marginRight:8}} onClick={()=>{
            window.open("https://twitter.com/OG_NFT")
          }}/>

          <img src="./twitch.png" style={{maxWidth:190, cursor:"pointer"}} onClick={()=>{
            window.open("https://www.twitch.tv/ognft")
          }}/>

          <img src="./youtube.png" style={{marginLeft:64, maxWidth:160, cursor:"pointer"}} onClick={()=>{
            window.open("https://www.youtube.com/channel/UCtEWm5BNiZJi-2sfcYjGTjw")
          }}/>

        </div>
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
/*
window.addEventListener('t ouchstart', function onFirstTouch() {
  alert("you")
}, false);
*/

export default App;
