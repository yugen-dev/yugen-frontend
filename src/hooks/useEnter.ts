import { useCallback } from "react";

import { useWeb3React } from "@web3-react/core";
import { useProfile } from "state/hooks";
import { enter, enterGasless } from "utils/callHelpers";

// import { useProfile } from "state/hooks";
// const { metaTranscation } = useProfile();

import { useYgnStaker, useYgnStakerGasless } from "./useContract";

const useEnter = () => {
  const { account, library } = useWeb3React("web3");
  const ygnStaker = useYgnStaker();
  const ygnStakerGasless = useYgnStakerGasless();
  const { metaTranscation } = useProfile();

  const handle = useCallback(
    async (amount: string) => {
      if (metaTranscation) {
        await enterGasless(ygnStakerGasless, amount, account, library);
      } else {
        await enter(ygnStaker, amount, account);
      }
    },
    [metaTranscation, ygnStakerGasless, account, library, ygnStaker]
  );

  return { onEnter: handle };
};

export default useEnter;
