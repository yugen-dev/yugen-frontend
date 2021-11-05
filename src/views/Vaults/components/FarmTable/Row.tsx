import React, { useState } from "react";
import styled from "styled-components";
import { VaultWithStakedValue } from "views/Farms/components/FarmCard/FarmCard";
import { useMatchBreakpoints } from "cryption-uikit";
import useI18n from "hooks/useI18n";

import Apr, { AprProps } from "./Apr";
import Farm, { FarmProps } from "./Farm";
import Details from "./Details";
import Liquidity, { LiquidityProps } from "./Liquidity";
import ActionPanel from "./Actions/ActionPanel";
import CellLayout from "./CellLayout";
import { DesktopColumnSchema, MobileColumnSchema } from "../types";
import Apy, { ApyProps } from "./Apy";
import Wallet, { WalletProps } from "./Wallet";
import Deposited, { DepositedProps } from "./Deposited";

export interface RowProps {
  farm: FarmProps;
  apy: AprProps;
  apr: ApyProps;
  wallet: WalletProps;
  liquidity: LiquidityProps;
  deposited: DepositedProps;
  details: VaultWithStakedValue;
}

const cells = {
  farm: Farm,
  apy: Apr,
  apr: Apr,
  wallet: Apr,
  liquidity: Liquidity,
  deposited: Deposited,
  details: Details,
};

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 32px;
  }
`;

const StyledTr = styled.tr`
  cursor: pointer;
  border-bottom: 1px solid #5b5b5b;
`;

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`;

const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`;

const FarmMobileCell = styled.td`
  padding-top: 24px;
`;

const Row: React.FunctionComponent<RowProps> = (props) => {
  const { details } = props;
  const [actionPanelToggled, setActionPanelToggled] = useState(false);
  const TranslateString = useI18n();

  const toggleActionPanel = () => {
    setActionPanelToggled(!actionPanelToggled);
  };

  const { isXl, isXs } = useMatchBreakpoints();

  const isMobile = !isXl;
  const tableSchema = isMobile ? MobileColumnSchema : DesktopColumnSchema;
  const columnNames = tableSchema.map((column) => column.name);

  const handleRenderRow = () => {
    if (!isXs) {
      return (
        <StyledTr onClick={toggleActionPanel}>
          {Object.keys(props).map((key) => {
            const columnIndex = columnNames.indexOf(key);
            if (columnIndex === -1) {
              return null;
            }

            switch (key) {
              case "details":
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        <Details actionPanelToggled={actionPanelToggled} />
                      </CellLayout>
                    </CellInner>
                  </td>
                );
              case "apr":
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label="Daily APR">
                        <Apr {...props.apr} />
                      </CellLayout>
                    </CellInner>
                  </td>
                );
              case "apy":
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label="APY">
                        <Apy {...props.apy} />
                      </CellLayout>
                    </CellInner>
                  </td>
                );
              case "wallet":
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label="Wallet">
                        <Wallet {...props.wallet} />
                      </CellLayout>
                    </CellInner>
                  </td>
                );
              case "deposited":
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label="Deposited">
                        <Deposited {...props.deposited} />
                      </CellLayout>
                    </CellInner>
                  </td>
                );
              default:
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout
                        label={TranslateString(
                          tableSchema[columnIndex].translationId,
                          tableSchema[columnIndex].label
                        )}
                      >
                        {React.createElement(cells[key], props[key])}
                      </CellLayout>
                    </CellInner>
                  </td>
                );
            }
          })}
        </StyledTr>
      );
    }

    return (
      <StyledTr onClick={toggleActionPanel}>
        <td>
          <tr>
            <FarmMobileCell>
              <CellLayout>
                <Farm {...props.farm} />
              </CellLayout>
            </FarmMobileCell>
          </tr>
          <tr>
            <EarnedMobileCell>
              <CellLayout label={TranslateString(1072, "Earned")}>
                <Deposited {...props.deposited} />
              </CellLayout>
            </EarnedMobileCell>
            <AprMobileCell>
              <CellLayout label={TranslateString(736, "APY")}>
                <Apy {...props.apy} />
              </CellLayout>
            </AprMobileCell>
          </tr>
        </td>
        <td>
          <CellInner>
            <CellLayout>
              <Details actionPanelToggled={actionPanelToggled} />
            </CellLayout>
          </CellInner>
        </td>
      </StyledTr>
    );
  };

  return (
    <>
      {handleRenderRow()}
      {actionPanelToggled && details && (
        <tr>
          <td colSpan={8}>
            <ActionPanel {...props} />
          </td>
        </tr>
      )}
    </>
  );
};

export default Row;
