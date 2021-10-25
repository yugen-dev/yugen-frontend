import { MenuEntry } from "cryption-uikit";

const config: MenuEntry[] = [
  {
    label: "Home",
    icon: "HomeIcon",
    href: "/",
  },
  {
    label: "Exchange",
    icon: "TradeIcon",
    href: "https://cryption.network/",
  },
  {
    label: "Farms",
    icon: "FarmIcon",
    href: "/farms",
  },
  {
    label: "Vaults",
    icon: "FarmIcon",
    href: "/vaults",
  },
  {
    label: "YGN Staker",
    icon: "TicketIcon",
    href: "/cntstaker",
  },
  {
    label: "Rewards Manager",
    icon: "RewardsManagerIcon",
    href: "/rewardsmanager",
  },
];

export const socials = [
  {
    label: "Telegram",
    icon: "TelegramIcon",
    href: "https://t.me/CryptionNetwork",
  },
  {
    label: "Twitter",
    icon: "TwitterIcon",
    href: "https://twitter.com/Polydex_",
  },
];
export const networks = [
  {
    title: "Polygon Mainnet",
    chainId: "137",
    imgSrc: "",
    rpcUrl:
      "https://billowing-ancient-wave.matic.quiknode.pro/ff002e91f8c0779e0c7295f4a8bf3908546404ca/",
  },
  {
    title: "Ethereum Mainnet",
    chainId: "1",
    imgSrc: "",
    rpcUrl: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  {
    title: "Mumbai Testnet",
    chainId: "80001",
    imgSrc: "",
    rpcUrl: "https://rpc-mumbai.maticvigil.com/",
  },
  {
    title: "Goerli Test Network",
    chainId: "5",
    imgSrc: "",
    rpcUrl: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
];
export default config;
