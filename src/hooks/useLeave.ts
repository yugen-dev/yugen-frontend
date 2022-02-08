import { useCallback } from "react";

import { useWeb3React } from "@web3-react/core";

import { leave, leaveGasless } from "utils/callHelpers";

import { useProfile } from "state/hooks";

import { useYgnStaker, useYgnStakerGasless } from "./useContract";

const useLeave = () => {
  const { account, library } = useWeb3React("web3");
  const { metaTranscation } = useProfile();
  const ygnStaker = useYgnStaker();
  const ygnStakerGasless = useYgnStakerGasless();

  const handle = useCallback(
    async (amount: string) => {
      if (metaTranscation) {
        await leaveGasless(ygnStakerGasless, amount, account, library);
      } else {
        await leave(ygnStaker, amount, account);
      }
    },
    [metaTranscation, ygnStakerGasless, account, library, ygnStaker]
  );

  return { onLeave: handle };
};

export default useLeave;
