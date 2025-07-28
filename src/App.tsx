import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import metaMaskLogo from "./assets/mm-fox.svg";
import "./App.css";

import { MetaMaskSDK, type SDKProvider } from "@metamask/sdk";
import { useEffect, useState } from "react";

const MMSDK = new MetaMaskSDK({
  checkInstallationImmediately: false,
  checkInstallationOnAllCalls: false,
  dappMetadata: {
    name: "MetaMask SDK Demo",
    url: window.location.href,
    iconUrl: "https://docs.metamask.io/img/metamask-logo.svg",
  },
  // defaultReadOnlyChainId: 11155111,
  // enableAnalytics: true,
  // extensionOnly: false,
  // headless: false,
  infuraAPIKey: import.meta.env.VITE_INFURA_API_KEY,
});

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState<SDKProvider | undefined>();
  const [account, setAccount] = useState<string | undefined>();
  const [balance, setBalance] = useState<number | undefined>();

  useEffect(() => {
    setProvider(MMSDK.getProvider());
  }, []);

  const connect = async () => {
    const accounts = await MMSDK.connect();
    setAccount(accounts[0]);
    if (accounts.length > 0) {
      setIsConnected(true);
    }
  };

  const getBalance = async () => {
    if (!account || !provider) {
      return;
    }
    const result = await provider?.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
    const decimal = BigInt(result as string);
    const balance = (await Number(decimal)) / 10 ** 18;
    console.log(balance.toFixed(4));
    setBalance(balance);
  };

  const batchRequest = async () => {
    if (!account || !provider) {
      return;
    }
    const batchResults = await provider.request({
      method: "metamask_batch",
      params: [
        { method: "eth_accounts" },
        { method: "eth_getBalance", params: [account, "latest"] },
        { method: "eth_chainId" },
      ],
    });
    console.log(batchResults);
  };

  const terminate = async () => {
    await MMSDK.terminate();
    setIsConnected(false);
    setBalance(undefined);
    setAccount(undefined);
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://metamask.io" target="_blank">
          <img src={metaMaskLogo} className="logo" alt="MetaMask logo" />
        </a>
      </div>
      <h1>MetaMask SDK Demo</h1>
      <div className="card">
        {isConnected ? (
          <>
            <p>Connected to {account}</p>
            {balance && <p>Balance: {balance?.toFixed(4)} Sepolia ETH</p>}
            <button onClick={getBalance}>Get Balance</button>
            <button onClick={batchRequest}>Batch Request</button>
            <button onClick={terminate}>Disconnect</button>
          </>
        ) : (
          <>
            <button onClick={connect}>Connect</button>
          </>
        )}
      </div>
      <p className="read-the-docs underline">
        <a
          href="https://docs.metamask.io/sdk/connect/javascript/"
          target="_blank"
        >
          SDK Documentation
        </a>
      </p>
    </>
  );
}

export default App;
