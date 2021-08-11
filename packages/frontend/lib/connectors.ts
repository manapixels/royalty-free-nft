import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const MUMBAI_API_KEY = process.env.MUMBAI_API_KEY

const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: string } = {
  1: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
  4: 'https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213',
  80001: `https://polygon-mumbai.g.alchemy.com/v2/${MUMBAI_API_KEY}`,
}
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1], 4: RPC_URLS[4], 80001: RPC_URLS[80001] },
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})
