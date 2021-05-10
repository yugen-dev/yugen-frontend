import BigNumber from 'bignumber.js'
import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import {
  Button,
  useModal
} from "@pancakeswap-libs/uikit";


import Label from "components/Label";
import Value from 'components/Value'
import useTokenBalance from 'hooks/useTokenBalance'


import contracts from "config/constants/contracts";
import useEnter from "hooks/useEnter";
import {useStakingAllowance} from "hooks/useAllowance";
import { useApproveStaking } from "hooks/useApprove";
import Card from "./Card";
import CardContent from "./CardContent";
import {getBalanceNumber} from '../../../utils/formatBalance'
import DepositModal from './DepositModal'

const StakeCNT: React.FC = () => {
  const tokenName = "CNT"
  const [requestedApproval, setRequestedApproval] = useState(false)

  const allowance = useStakingAllowance()
  const {onApprove} = useApproveStaking()

  const tokenBalance = useTokenBalance(contracts.cake[80001])

  const {onEnter} = useEnter()

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onEnter}
      tokenName={tokenName}
    />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <Value value={getBalanceNumber(tokenBalance)}/>
            <Label text="CNT Tokens Available"/>
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() ? (
              <Button
                disabled={requestedApproval}
                onClick={handleApprove}
              >
              Approve CNT
              </Button>
            ) : (
              <>
                <Button
                  disabled={tokenBalance.eq(new BigNumber(0))}
                  onClick={onPresentDeposit}
                >
                Convert to xCNT
                </Button>
                <StyledActionSpacer/>
              </>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default StakeCNT
