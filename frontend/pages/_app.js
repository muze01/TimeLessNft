import '../styles/globals.css';
import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createClient, WagmiConfig, goerli } from "wagmi";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My Wallet",
  chains,
});

const wagmiclient = createClient({
  // autoConnect: true,
  provider,
  connectors,
  webSocketProvider,
});

export default function App({ Component, pageProps }) {

  return (
    <WagmiConfig client={wagmiclient}>
      <RainbowKitProvider chains={chains} modalSize="compact" >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
