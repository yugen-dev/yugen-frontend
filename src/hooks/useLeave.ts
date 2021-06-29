import { useCallback } from "react";

import { useWeb3React } from "@web3-react/core";

import { leave, leaveGasless } from "utils/callHelpers";

import { useProfile } from "state/hooks";

import { useCake, useCNTStaker, useCNTStakerGasless } from "./useContract";

const useLeave = () => {
  const { account } = useWeb3React("web3");
  const { metaTranscation } = useProfile();
  const cake = useCake();
  const cntStaker = useCNTStaker();
  const cntStakerGasless = useCNTStakerGasless();

  const handle = useCallback(
    async (amount: string) => {
      if (metaTranscation) {
        const txHash = await leaveGasless(cntStakerGasless, amount, account);
      } else {
        const txHash = await leave(cntStaker, amount, account);
      }
    },
    [account, cntStaker, cntStakerGasless, metaTranscation]
  );

  return { onLeave: handle };
};

export default useLeave;
