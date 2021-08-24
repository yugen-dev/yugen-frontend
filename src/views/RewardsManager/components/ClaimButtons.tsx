import React, { memo, useState } from "react";
import UnlockButton from "components/UnlockButton";
import { AutoRenewIcon, Button } from "cryption-uikit";
import { useToast } from "state/hooks";
import styled from "styled-components";
import QuestionHelper from "components/QuestionHelper";
import { getRewardsManagerContract } from "utils/contractHelpers";
import Web3 from "web3";

export const ClaimButtons = ({
  vestedValues,
  account,
  endDistributionTime,
  penaltyValue,
}) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const web3 = new Web3(window.ethereum);

  let formatTimerValue = Date.now().toString();
  if (endDistributionTime) {
    // use toLocaleDateString() for exact time
    formatTimerValue = new Date(endDistributionTime * 1000).toLocaleDateString(
      "en-US"
    );
  }

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast();

  const handleForceClaimClick = async () => {
    try {
      setBtnLoading(() => true);
      toastWarning(
        "You requested to force claim your rewards",
        "35% of rewards will be deducted as burn fees"
      );

      const rewardMgSmartContract = getRewardsManagerContract(web3);
      await rewardMgSmartContract.methods
        .preMatureDraw()
        .send({ from: account });

      setBtnLoading(() => false);
      toastSuccess(
        "Success",
        "you have successfully force claimed the rewards"
      );
    } catch (e) {
      setBtnLoading(() => false);
      toastError("Error", `could not perform force claim action`);
    }
  };

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
                <>
                  <Button style={{ marginRight: "20px" }} disabled>
                    Claim
                  </Button>
                  {vestedValues.Unclaimable === "0" ? (
                    <>
                      <Button
                        variant="danger"
                        style={{
                          marginLeft: "20px",
                          color: "#100C18",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        disabled
                      >
                        <div>Force Claim</div>
                        <div>
                          <QuestionHelper
                            text={`Withdrawing before ${formatTimerValue} will incur a loss of ${
                              penaltyValue / 10
                            }% as burn fees.`}
                          />
                        </div>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="danger"
                        onClick={handleForceClaimClick}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "20px",
                        }}
                      >
                        <div>Force Claim</div>
                        <div>
                          <QuestionHelper
                            text={`Withdrawing before ${formatTimerValue} will incur a loss of ${
                              penaltyValue / 10
                            }% as burn fees.`}
                          />
                        </div>
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Button
                    onClick={handleClaimClick}
                    style={{ marginRight: "20px" }}
                    variant="success"
                  >
                    Claim
                  </Button>
                  <Button
                    onClick={handleForceClaimClick}
                    style={{
                      marginLeft: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    variant="danger"
                  >
                    <div>Force Claim</div>
                    <div>
                      <QuestionHelper
                        text={`Withdrawing before ${formatTimerValue} will incur a loss of ${
                          penaltyValue / 10
                        }% as burn fees.`}
                      />
                    </div>
                  </Button>
                </>
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
