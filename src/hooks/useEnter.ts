import { useCallback } from "react";

import { useWeb3React } from "@web3-react/core";
import { useProfile } from "state/hooks";
import { enter, enterGasless } from "utils/callHelpers";

// import { useProfile } from "state/hooks";
// const { metaTranscation } = useProfile();

import { useCNTStaker, useCNTStakerGasless } from "./useContract";

const useEnter = () => {
  const { account, library } = useWeb3React("web3");
  const cntStaker = useCNTStaker();
  const cntStakerGasless = useCNTStakerGasless();
  const { metaTranscation } = useProfile();

  const handle = useCallback(
    async (amount: string) => {
      if (metaTranscation) {
        await enterGasless(cntStakerGasless, amount, account, library);
      } else {
        await enter(cntStaker, amount, account);
      }
    },
    [account, cntStaker, cntStakerGasless, metaTranscation, library]
  );

  return { onEnter: handle };
};

export default useEnter;
