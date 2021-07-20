import { MigrateConfig } from "./types";

const migrate: MigrateConfig[] = [
  {
    label: "Exchange1",
    value: "0x2A59Dcd63A4F7a23d4fF0d2542ab44870199dA17",
    migratorAddress: {
      80001: "0xa55E852c885E8800966D150a663115Bd0505fD69"
    },
  },
  {
    label: "Exchange2",
    value: "0x2A59Dcd63A4F7a23d4fF0d2542ab44870199dA17",
    migratorAddress: {
      80001: "0xa55E852c885E8800966D150a663115Bd0505fD69"
    },
  },
];
export default migrate;
