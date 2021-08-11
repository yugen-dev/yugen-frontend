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
    href: "/swap",
  },
  {
    label: "Farms",
    icon: "FarmIcon",
    items: [
      {
        label: "Core",
        href: "/farms",
      },
      {
        label: "Multi Reward",
        href: "/multirewards",
      },
    ],
  },
  {
    label: "Pools",
    icon: "PoolIcon",
    href: "/pools",
  },
  {
    label: "CNT Staker",
    icon: "TicketIcon",
    href: "/cntstaker",
  },
  {
    label: "Migrate",
    icon: "NftIcon",
    href: "/migrate",
  },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: 'Collectibles',
  //   icon: 'NftIcon',
  //   href: '/collectibles',
  // },
  // {
  //   label: 'Teams & Profile',
  //   icon: 'GroupsIcon',
  //   calloutClass: 'rainbow',
  //   items: [
  //     {
  //       label: 'Leaderboard',
  //       href: '/teams',
  //     },
  //     {
  //       label: 'Task Center',
  //       href: '/profile/tasks',
  //     },
  //     {
  //       label: 'Your Profile',
  //       href: '/profile',
  //     },
  //   ],
  // },
  // {
  //   label: "Analytics (Coming Soon)",
  //   icon: "InfoIcon",
  //   items: [],
  // },
  {
    label: "IFO",
    icon: "IfoIcon",
    href: "/ifo",
  },
  {
    label: "More",
    icon: "MoreIcon",
    items: [
      {
        label: "Audit Report",
        href: "https://www.certik.org/projects/cryptionnetwork",
      },
      {
        label: "Github",
        href: "https://github.com/cryption-network",
      },
      // hiding bcoz Menu bar will highlight if pointed to home otherwise
      {
        label: "Docs",
        href: "https://docs.cryption.network/",
      },
      {
        label: "Blog",
        href: "https://blog.cryption.network/",
      },
    ],
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
export default config;
