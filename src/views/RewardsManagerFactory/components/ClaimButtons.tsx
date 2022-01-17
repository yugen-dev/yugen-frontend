import React, { memo, useState } from "react";
import UnlockButton from "components/UnlockButton";
import { AutoRenewIcon, Button } from "yugen-uikit";
import { useToast } from "state/hooks";
import styled from "styled-components";
import QuestionHelper from "components/QuestionHelper";
import { getRewardsManagerContract } from "utils/contractHelpers";
import Web3 from "web3";

export const ClaimButtons = ({ vestedValues, account, penaltyValue }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const web3 = new Web3(window.ethereum);

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
        .send({ from: account, gasPrice: 32000000000 });

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

      await rewardMgSmartContract.methods
        .drawDown()
        .send({ from: account, gasPrice: 32000000000 });

      setBtnLoading(() => false);
      toastSuccess("Success", "you have successfully claimed the rewards");
    } catch (e) {
      setBtnLoading(() => false);
      console.error("Error on normal claim action: ", e);
      toastError("Error", `could not perform claim action`);
    }
  };

  const handleForceClaimAndStakeClick = async () => {
    try {
      setBtnLoading(() => true);
      toastWarning(
        "You requested to force claim your rewards",
        "35% of rewards will be deducted as burn fees"
      );

      const rewardMgSmartContract = getRewardsManagerContract(web3);
      await rewardMgSmartContract.methods
        .preMatureDrawAndStake()
        .send({ from: account, gasPrice: 32000000000 });

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

  const handleClaimAndStakeClick = async () => {
    try {
      const rewardMgSmartContract = getRewardsManagerContract(web3);

      setBtnLoading(() => true);
      toastInfo("Processing...");

      await rewardMgSmartContract.methods
        .drawDownAndStake()
        .send({ from: account, gasPrice: 32000000000 });

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
                  <Button style={{ marginRight: "5px" }} disabled>
                    Claim
                  </Button>
                  <Button style={{ marginRight: "20px" }} disabled>
                    Claim & Stake
                  </Button>
                  {vestedValues.Unclaimable === "0" ? (
                    <>
                      <Button
                        variant="danger"
                        style={{
                          marginLeft: "20px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        disabled
                      >
                        <div>Force Claim</div>
                        <div>
                          <QuestionHelper
                            text={`Force claiming will incur a loss of ${
                              penaltyValue / 10
                            }% as burn fees.`}
                          />
                        </div>
                      </Button>
                      <Button
                        variant="danger"
                        style={{
                          marginLeft: "5px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        disabled
                      >
                        <div>Force Claim & Stake</div>
                        <div>
                          <QuestionHelper
                            text={`Force claiming will incur a loss of ${
                              penaltyValue / 10
                            }% as burn fees.`}
                          />
                        </div>
                      </Button>
                    </>
                  ) : (
                    <>
                      <StyledForceBtn
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
                            text={`Force claiming will incur a loss of ${
                              penaltyValue / 10
                            }% as burn fees.`}
                          />
                        </div>
                      </StyledForceBtn>
                      <Button
                        variant="danger"
                        onClick={handleForceClaimAndStakeClick}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "5px",
                        }}
                      >
                        <div>Force Claim & Stake</div>
                        <div>
                          <QuestionHelper
                            text={`Force claiming will incur a loss of ${
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
                    style={{ marginRight: "5px" }}
                    variant="secondary"
                  >
                    Claim
                  </Button>
                  <Button
                    onClick={handleClaimAndStakeClick}
                    style={{ marginRight: "20px" }}
                    variant="primary"
                  >
                    Claim & Stake
                  </Button>

                  <StyledForceBtn
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
                        text={`Force claiming will incur a loss of ${
                          penaltyValue / 10
                        }% as burn fees.`}
                      />
                    </div>
                  </StyledForceBtn>
                  <Button
                    onClick={handleForceClaimAndStakeClick}
                    style={{
                      marginLeft: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    variant="danger"
                  >
                    <div>Force Claim & Stake</div>
                    <div>
                      <QuestionHelper
                        text={`Force claiming will incur a loss of ${
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

const StyledForceBtn = styled(Button)`
  background: #ffffff;
  color: rgb(156, 44, 44);
  border: 2px solid rgb(156, 44, 44);
`;

const ButtonContainer = styled.div`
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default memo(ClaimButtons);
