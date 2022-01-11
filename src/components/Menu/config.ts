import { MenuEntry } from "cryption-uikit";

const fantomMainnetConfig: MenuEntry[] = [
  {
    label: "Home",
    icon: "HomeIcon",
    href: "/",
  },
  {
    label: "Get YGN",
    icon: "TradeIcon",
    href: "https://spookyswap.finance/swap?inputCurrency=usdcAddressOnFantom&outputCurrency=ygnAddressOnFantom",
  },
  {
    label: "Farms",
    icon: "FarmIcon",
    href: "/farms",
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

export const maticMainnetConfig: MenuEntry[] = [
  {
    label: "Home",
    icon: "HomeIcon",
    href: "/",
  },
  {
    label: "Get YGN",
    icon: "TradeIcon",
    href: "https://quickswap.exchange/#/swap?inputCurrency=0x2791bca1f2de4661ed88a30c99a7a9449aa84174&outputCurrency=0xA33aAa07853038943eF2c32cDE73a094cF993EE0",
  },
  {
    label: "Farms",
    icon: "FarmIcon",
    href: "/farms",
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
    label: "Farms",
    icon: "FarmIcon",
    href: "/farms",
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
    title: "Mumbai Testnet",
    chainId: "80001",
    imgSrc: "",
    rpcUrl: "https://rpc-mumbai.maticvigil.com/",
  },
  // {
  //   title: "Fantom Opera",
  //   chainId: "250",
  //   imgSrc: "",
  //   rpcUrl: "https://rpc.ftm.tools/",
  // },
  {
    title: "Fantom Testnet",
    chainId: "4002",
    imgSrc: "",
    rpcUrl: "https://rpc.testnet.fantom.network/",
  },
];

export default fantomMainnetConfig;
