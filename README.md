# 🏗 scaffold-eth - Streaming Multi Signature Wallet

> an off-chain signature based multi sig with streaming

---

## quickstart

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git streaming-meta-multi-sig

cd streaming-meta-multi-sig

git checkout streaming-meta-multi-sig
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash
cd scaffold-eth
yarn chain

```


🔏 Edit your smart contract `StreamingMetaMultiSigWallet.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment script `deploy.js` in `packages/hardhat/scripts`

📱 Open http://localhost:3000 to see the app

> in a third terminal window:

```bash
yarn backend

```

🔧 Configure your deployment in `packages/hardhat/scripts/deploy.js`

> Edit the chainid, your owner addresses, and the number of signatures required:

![image](https://user-images.githubusercontent.com/2653167/99156751-bfc59b00-2680-11eb-8d9d-e33777173209.png)



> in a fourth terminal deploy with your frontend address as one of the owners:

```bash

yarn deploy

```


> Use the faucet wallet to send your multi-sig contract some funds:

![image](https://user-images.githubusercontent.com/2653167/99156785-fd2a2880-2680-11eb-8665-f8415cc77d5d.png)

> To add new owners, use the "Owners" tab:

![image](https://user-images.githubusercontent.com/2653167/99156881-e6380600-2681-11eb-8161-43aeb7618af6.png)

This will take you to a populated transaction create page:

![image](https://user-images.githubusercontent.com/31567169/116584822-cabb7180-a928-11eb-8470-32d80717e704.png)



> Create & sign the new transaction:

![image](https://user-images.githubusercontent.com/31567169/116584952-f2aad500-a928-11eb-82a1-906550008988.png)

You will see the new transaction in the pool (this is all off-chain):

![image](https://user-images.githubusercontent.com/31567169/116585121-1bcb6580-a929-11eb-8e43-b5b0921cca2e.png)

Click on the ellipsses button [...] to read the details of the transaction


![image](https://user-images.githubusercontent.com/31567169/116585196-300f6280-a929-11eb-8ecf-be11b59b44c3.png)


> Give your account some gas at the faucet and execute the transaction

The transction will appear as "executed" on the front page:

![image](https://user-images.githubusercontent.com/31567169/116585477-82e91a00-a929-11eb-9e2c-dbd5af894e4a.png)


> Create a transaction to open a stream to your frontend account:

![image](https://user-images.githubusercontent.com/31567169/116585714-b7f56c80-a929-11eb-8abe-0e06b1629f38.png)



Again, this will take you to a populated transaction form:

![image](https://user-images.githubusercontent.com/31567169/116585998-03a81600-a92a-11eb-9a33-cd49d7eae0b7.png)



This time we will need a second signature:

![image](https://user-images.githubusercontent.com/31567169/116586177-38b46880-a92a-11eb-82c9-396db404773b.png)


> Sign the transacton with enough owners:


(You'll notice you don't need ⛽️gas to sign transactions.)

> Execute the transction to open the stream:

![image](https://user-images.githubusercontent.com/31567169/116586333-66011680-a92a-11eb-8637-ffa70ae5c05a.png)


The stream will live update with each new block mined:

![image](https://user-images.githubusercontent.com/31567169/116586420-7e713100-a92a-11eb-804e-016e627d91e3.png)


(You might need to trigger a new block by sending yourself some faucet funds or something. HartHat blocks only get mined when there is a transaction.)

> Click the button any time and it will withdraw:


![image](https://user-images.githubusercontent.com/31567169/116586516-9ea0f000-a92a-11eb-97a1-dfae6070c634.png)
