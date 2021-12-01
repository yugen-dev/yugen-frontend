import { MenuEntry } from "cryption-uikit";

const fantomMainnetConfig: MenuEntry[] = [
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
    href: "/ygnstaker",
  },
  {
    label: "Rewards Manager",
    icon: "RewardsManagerIcon",
    href: "/rewardsmanager",
  },
  {
    label: "fYGN Burner",
    icon: "TicketIcon",
    href: "/fygnburner",
  },
  {
    label: "Bonds",
    subText: "Coming soon",
    icon: "RewardsManagerIcon",
    href: "/bonds",
  },
];

export const maticTestnetConfig: MenuEntry[] = [
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
    href: "/ygnstaker",
  },
  {
    label: "Rewards Manager",
    icon: "RewardsManagerIcon",
    href: "/rewardsmanager",
  },
  {
    label: "fYGN Burner",
    icon: "TicketIcon",
    href: "/fygnburner",
  },
  {
    label: "Bonds",
    subText: "Coming soon",
    icon: "RewardsManagerIcon",
    href: "/bonds",
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
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
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
  {
    title: "Fantom Opera",
    chainId: "250",
    imgSrc: "",
    rpcUrl: "https://rpc.ftm.tools/",
  },
  {
    title: "Fantom Testnet",
    chainId: "4002",
    imgSrc: "",
    rpcUrl: "https://rpc.testnet.fantom.network/",
  },
];
export default fantomMainnetConfig;
