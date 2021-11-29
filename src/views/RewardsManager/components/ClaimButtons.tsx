import React, { memo, useState } from "react";
import UnlockButton from "components/UnlockButton";
import { AutoRenewIcon, Button } from "cryption-uikit";
import { useToast } from "state/hooks";
import styled from "styled-components";
import { getRewardsManagerContract } from "utils/contractHelpers";
import Web3 from "web3";

export const ClaimButtons = ({ vestedValues, account }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const web3 = new Web3(window.ethereum);

  const { toastError, toastSuccess, toastInfo } = useToast();

  const handleClaimClick = async () => {
    try {
      const rewardMgSmartContract = getRewardsManagerContract(web3);

      setBtnLoading(() => true);
      toastInfo("Processing...");

      await rewardMgSmartContract.methods.drawDown().send({ from: account });

      setBtnLoading(() => false);
      toastSuccess("Success", "you have successfully claimed the rewards");
    } catch (e) {
      setBtnLoading(() => false);
      console.error("Error on normal claim action: ", e);
      toastError("Error", `could not perform claim action`);
    }
  };

  return (
    <ButtonContainer>
      {account ? (
        <>
          {btnLoading ? (
            <Button
              isLoading
              endIcon={<AutoRenewIcon spin color="currentColor" />}
              style={{ marginRight: "2px" }}
              variant="secondary"
            >
              Processing...
            </Button>
          ) : (
            <>
              {vestedValues.Claimable === "0" ||
              vestedValues.Claimable === "-1" ? (
                <Button style={{ marginRight: "20px" }} disabled>
                  Claim
                </Button>
              ) : (
                <Button
                  onClick={handleClaimClick}
                  style={{ marginRight: "20px" }}
                  variant="success"
                >
                  Claim
                </Button>
              )}
            </>
          )}
        </>
      ) : (
        <div>
          <UnlockButton />
        </div>
      )}
    </ButtonContainer>
  );
};
const ButtonContainer = styled.div`
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default memo(ClaimButtons);
