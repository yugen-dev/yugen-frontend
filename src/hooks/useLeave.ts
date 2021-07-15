import { useCallback } from "react";

import { useWeb3React } from "@web3-react/core";

import { leave, leaveGasless } from "utils/callHelpers";

import { useProfile } from "state/hooks";

import { useCNTStaker, useCNTStakerGasless } from "./useContract";

const useLeave = () => {
  const { account, library } = useWeb3React("web3");
  const { metaTranscation } = useProfile();
  const cntStaker = useCNTStaker();
  const cntStakerGasless = useCNTStakerGasless();

  const handle = useCallback(
    async (amount: string) => {
      if (metaTranscation) {
        await leaveGasless(cntStakerGasless, amount, account, library);
      } else {
        await leave(cntStaker, amount, account);
      }
    },
    [account, cntStaker, cntStakerGasless, metaTranscation, library]
  );

  return { onLeave: handle };
};

export default useLeave;
