export type TableProps = {
  data?: TableDataTypes[];
  selectedFilters?: string;
  sortBy?: string;
  sortDir?: string;
  onSort?: (value: string) => void;
};

export type ColumnsDefTypes = {
  id: number;
  label: string;
  name: string;
  translationId: number;
  sortable: boolean;
};

export type ScrollBarProps = {
  ref: string;
  width: number;
};

export type TableDataTypes = {
  POOL: string;
  APY: string;
  STAKED: string;
  DETAILS: string;
  LINKS: string;
};

export const MobileColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: "farm",
    translationId: 999,
    sortable: true,
    label: "",
  },
  {
    id: 2,
    name: "deposited",
    translationId: 1072,
    sortable: true,
    label: "Deposited",
  },
  {
    id: 3,
    name: "apr",
    translationId: 736,
    sortable: true,
    label: "APR",
  },
  {
    id: 6,
    name: "details",
    translationId: 999,
    sortable: true,
    label: "",
  },
];

export const DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: "farm",
    translationId: 999,
    sortable: true,
    label: "Pays in",
  },
  {
    id: 2,
    name: "apy",
    translationId: 736,
    sortable: true,
    label: "APY",
  },
  {
    id: 3,
    name: "apr",
    translationId: 736,
    sortable: true,
    label: "Daily",
  },
  {
    id: 4,
    name: "wallet",
    translationId: 736,
    sortable: false,
    label: "Wallet",
  },
  {
    id: 5,
    name: "deposited",
    translationId: 736,
    sortable: false,
    label: "Deposited",
  },
  {
    id: 6,
    name: "liquidity",
    translationId: 736,
    sortable: true,
    label: "TVL",
  },
  {
    id: 7,
    name: "details",
    translationId: 736,
    sortable: false,
    label: "Details",
  },
];

export enum ViewMode {
  "TABLE" = "TABLE",
  "CARD" = "CARD",
}
