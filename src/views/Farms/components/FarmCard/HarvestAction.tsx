import React, { useCallback, useState } from "react";
import BigNumber from "bignumber.js";
import { AutoRenewIcon, Button, Flex, Heading } from "yugen-uikit";
import { useHarvest, useHarvestAndStake } from "hooks/useHarvest";
import { getBalanceNumber } from "utils/formatBalance";
import ConfirmSwapModal from "components/harvestAndStake/ConfirmSwapModal";
import { useActiveWeb3React } from "hooks";
import {
  getCNTStakerContract,
  getFygnBurnerContract,
} from "utils/contractHelpers";
import useWeb3 from "hooks/useWeb3";

interface FarmCardActionsProps {
  earnings?: BigNumber;
  pid?: number;
  canHarvest?: boolean;
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({
  earnings,
  pid,
  canHarvest,
}) => {
  const [
    { fYgynBalance, ygnBalance, xYgnBalance, isFetchingHarvestValues },
    setHarvestValues,
  ] = useState({
    fYgynBalance: new BigNumber(0),
    ygnBalance: new BigNumber(0),
    xYgnBalance: new BigNumber(0),
    isFetchingHarvestValues: false,
  });
  const { account } = useActiveWeb3React();
  const web3 = useWeb3();
  const recipient = account ?? null;

  const fetchHarvestValues = async () => {
    setHarvestValues({
      isFetchingHarvestValues: true,
      fYgynBalance,
      ygnBalance,
      xYgnBalance,
    });
    try {
      let ygnResp = new BigNumber(1);
      let xYgnResp = new BigNumber(1);
      const burnerContract = getFygnBurnerContract(web3);
      const stakerContract = getCNTStakerContract();

      ygnResp = await burnerContract.methods
        .getYGNAmount(earnings.toString())
        .call();

      xYgnResp = await stakerContract.methods
        .getXYGNAmount(ygnResp.toString())
        .call();

      setHarvestValues({
        isFetchingHarvestValues: false,
        fYgynBalance: new BigNumber(earnings).dividedBy(
          new BigNumber(10).pow(18)
        ),
        ygnBalance: new BigNumber(ygnResp).dividedBy(new BigNumber(10).pow(18)),
        xYgnBalance: new BigNumber(xYgnResp).dividedBy(
          new BigNumber(10).pow(18)
        ),
      });
    } catch (e) {
      setHarvestValues({
        isFetchingHarvestValues: false,
        fYgynBalance,
        ygnBalance,
        xYgnBalance,
      });
    }
  };

  const [
    { showConfirm, harvestErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    attemptingTxn: boolean;
    harvestErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    attemptingTxn: false,
    harvestErrorMessage: undefined,
    txHash: undefined,
  });
  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useHarvest(pid);
  const { onRewardAndStake } = useHarvestAndStake(pid);
  const rawEarningsBalance = getBalanceNumber(earnings);
  let harvestDisabled = false;
  if (earnings.isZero()) {
    harvestDisabled = true;
  }

  const displayBalance = rawEarningsBalance.toLocaleString();

  const handleConfirmDismiss = () => {
    setSwapState(() => ({
      showConfirm: false,
      attemptingTxn,
      harvestErrorMessage,
      txHash,
    }));
  };

  const handleHarvestAndStake = useCallback(async () => {
    setSwapState(() => ({
      attemptingTxn: true,
      harvestErrorMessage,
      showConfirm: true,
      txHash: undefined,
    }));

    try {
      const hash = await onRewardAndStake();
      setSwapState(() => ({
        attemptingTxn: false,
        harvestErrorMessage: undefined,
        showConfirm: true,
        txHash: hash,
      }));
    } catch (e: any) {
      setSwapState(() => ({
        attemptingTxn: false,
        harvestErrorMessage: e.message,
        showConfirm: true,
        txHash: undefined,
      }));
    }
  }, [harvestErrorMessage, onRewardAndStake]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const BtnLoadingComp =
    pendingTx === false ? (
      <Flex justifyContent="space-around" width="100%">
        <Button
          variant="secondary"
          disabled={harvestDisabled}
          onClick={async () => {
            setPendingTx(true);
            await onReward();
            setPendingTx(false);
          }}
        >
          Harvest
        </Button>
        <Button
          disabled={harvestDisabled}
          onClick={async () => {
            setSwapState(() => ({
              attemptingTxn: false,
              harvestErrorMessage: undefined,
              showConfirm: true,
              txHash: undefined,
            }));
          }}
        >
          Harvest & Stake
        </Button>
      </Flex>
    ) : (
      <Button
        isLoading
        endIcon={<AutoRenewIcon spin color="currentColor" />}
        width="100%"
      >
        Processing
      </Button>
    );

  const TempBtnLoadingComp = (
    <Flex justifyContent="space-around" width="100%">
      <Button variant="secondary" disabled>
        Harvest
      </Button>
      <Button disabled>Harvest & Stake</Button>
    </Flex>
  );

  return (
    <Flex
      mb="8px"
      justifyContent="space-between"
      alignItems="center"
      flexDirection="column"
    >
      <Heading
        color={rawEarningsBalance === 0 ? "textDisabled" : "text"}
        mb="10px"
      >
        {displayBalance}
      </Heading>
      <ConfirmSwapModal
        isOpen={showConfirm}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        onConfirm={handleHarvestAndStake}
        swapErrorMessage={harvestErrorMessage}
        onDismiss={handleConfirmDismiss}
        ygnGiven={ygnBalance}
        fYgnToHarvest={fYgynBalance}
        xYgnGiven={xYgnBalance}
        isFetchingValues={isFetchingHarvestValues}
        fetchHarvestValuesFunction={fetchHarvestValues}
      />
      {canHarvest ? (
        // BtnLoadingComp
        TempBtnLoadingComp
      ) : (
        <Flex justifyContent="space-around" width="100%">
          <Button variant="secondary" disabled>
            Harvest
          </Button>
          <Button disabled>Harvest and Stake</Button>
        </Flex>
      )}
    </Flex>
  );
};

export default HarvestAction;
