import { MigrateConfig } from "./types";

const migrate: MigrateConfig[] = [
  {
    label: "Exchange1",
    value: "0x2A59Dcd63A4F7a23d4fF0d2542ab44870199dA17",
    migratorAddress: {
      80001: "0x9fBbcBed6a5205411aCe1C01d102194e92A17888"
    },
  },
  {
    label: "Exchange2",
    value: "0x2A59Dcd63A4F7a23d4fF0d2542ab44870199dA17",
    migratorAddress: {
      80001: "0x9fBbcBed6a5205411aCe1C01d102194e92A17888"
    },
  },
];
export default migrate;
