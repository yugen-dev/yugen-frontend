/* eslint-disable react/no-danger */
import React, { useEffect, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { RowType, Toggle, Text } from "yugen-uikit";
import styled from "styled-components";
import { CROSS_CHAIN_API_LINK } from "config";
import { useVaults } from "state/hooks";
// import {useProxy} from "state/hooks"; // useProxy
import useRefresh from "hooks/useRefresh";
import useI18n from "hooks/useI18n";
import { useChainId } from "state/application/hooks";
import { orderBy } from "lodash";
import { fetchVaultUserDataAsync } from "state/actions";
import { getBalanceNumber } from "utils/formatBalance";
import { Vault } from "state/types";
import { VaultWithStakedValue } from "./components/FarmCard/FarmCard";
import Table from "./components/FarmTable/FarmTable";
import FarmTabButtons from "./components/FarmTabButtons";
import SearchInput from "./components/SearchInput";
import { RowProps } from "./components/FarmTable/Row";
import { DesktopColumnSchema, ViewMode } from "./components/types";
import Select, { OptionProps } from "./components/Select/Select";

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  padding-left: 16px;
  padding-right: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 24px;
    padding-right: 24px;
  }
`;
const Page = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`;

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 0px;
  }
`;
const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;
const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
  margin-top: 10px;
`;
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
  flex-wrap: wrap;
  justify-content: space-around;
`;
const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  > ${Text} {
    font-size: 15px;
    margin-right: 15px;
  }

  margin: 10px 10px 0px 10px;

  @media (max-width: 570px) {
    margin: 10px 0px 0px 0px;
  }
`;

const Vaults: React.FC = () => {
  const { pathname } = useLocation();
  const TranslateString = useI18n();
  const vaultsLP = useVaults();
  const [query, setQuery] = useState("");
  const [viewMode] = useState(ViewMode.TABLE);
  const { account } = useWeb3React("web3");
  const [sortOption, setSortOption] = useState("hot");
  const [, setCrossChainData] = useState([]);
  const chainId = useChainId().toString();
  const dispatch = useDispatch();
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    if (account) {
      dispatch(fetchVaultUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);
  useEffect(() => {
    const getAllCrossChainTranscations = async (accountId) => {
      if (accountId) {
        let network = "testnet";
        if (chainId === "80001" || chainId === "5") {
          network = "testnet";
        }
        const Header = new Headers();
        Header.append("Content-Type", "application/x-www-form-urlencoded");
        const urlencoded = new URLSearchParams();
        urlencoded.append("account", account.toLowerCase());
        urlencoded.append("network", network);
        const requestOptions = {
          method: "POST",
          headers: Header,
          body: urlencoded,
        };
        const getAllTrx = await fetch(
          `${CROSS_CHAIN_API_LINK}/getAllTranscations`,
          requestOptions
        );
        const resp = await getAllTrx.json();
        setCrossChainData(resp);
      }
    };
    if (account) {
      getAllCrossChainTranscations(account);
    }
    const interval = setInterval(() => {
      getAllCrossChainTranscations(account);
    }, 5000);
    return () => clearInterval(interval);
  }, [account, chainId]);
  const [stackedOnly, setStackedOnly] = useState(false);

  const activeVaults = vaultsLP.filter((vault) => vault.multiplier !== "0.00X");
  const inactiveVaults = vaultsLP.filter(
    (vault) => vault.multiplier === "0.00X"
  );

  const stackedOnlyVaults = activeVaults.filter(
    (vault) =>
      vault.userData &&
      new BigNumber(vault.userData.stakedBalance).isGreaterThan(0)
  );

  const sortVaults = (vaults) => {
    switch (sortOption) {
      case "apy":
        return orderBy(vaults, "apy", "desc");
      case "liquidity":
        return orderBy(vaults, (vault) => Number(vault.liquidity), "desc");
      default:
        return vaults;
    }
  };

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const vaultsList = useCallback(
    (vaultsToDisplay): VaultWithStakedValue[] => {
      let vaultsToDisplayWithAPY: VaultWithStakedValue[] = vaultsToDisplay.map(
        (vault: Vault) => {
          if (!vault.nonQuoteTokenAmount || !vault.lpTotalInQuoteToken) {
            return vault;
          }

          let liquidity = new BigNumber(vault.lpTotalInQuoteToken);
          liquidity = new BigNumber(vault?.priceOfQuoteToken).times(
            vault.lpTotalInQuoteToken
          );

          const priceOf1RewardToken = new BigNumber(vault?.priceOfRewardToken);

          const apr = new BigNumber(vault.totalapr);

          const n = 365 * 24;
          const apyValueInBN = new BigNumber(
            apr.dividedBy(100).dividedBy(n).plus(1).toFixed(6)
          )
            .pow(n)
            .minus(1)
            .multipliedBy(100);
          const apy = new BigNumber(apyValueInBN.toFixed(2));

          return { ...vault, apy, liquidity };
        }
      );

      if (query) {
        const lowercaseQuery = query.toLowerCase();
        vaultsToDisplayWithAPY = vaultsToDisplayWithAPY.filter(
          (vault: VaultWithStakedValue) => {
            if (vault.lpTokenName.toLowerCase().includes(lowercaseQuery)) {
              return true;
            }
            return false;
          }
        );
      }
      return vaultsToDisplayWithAPY;
    },
    [query]
  );

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const isActive = !pathname.includes("history");
  let vaultsStaked = [];
  if (isActive) {
    vaultsStaked = stackedOnly
      ? vaultsList(stackedOnlyVaults)
      : vaultsList(activeVaults);
  } else {
    vaultsStaked = vaultsList(inactiveVaults);
  }

  vaultsStaked = sortVaults(vaultsStaked);

  const rowData = vaultsStaked.map((vault) => {
    const lpLabel =
      vault.lpTokenName &&
      vault.lpTokenName.toUpperCase().replace("PANCAKE", "");
    const row: RowProps = {
      farm: {
        image: vault.lpTokenName.split(" ")[0].toLocaleLowerCase(),
        label: lpLabel,
        pid: vault.pid,
        tag: vault.tag,
      },
      apy: {
        value:
          vault.apy &&
          vault.apy
            .toNumber()
            .toLocaleString("en-US", { maximumFractionDigits: 2 }),
        originalValue: vault.apy,
      },
      apr: {
        value:
          new BigNumber(vault.totalapr).dividedBy(365).toString() &&
          new BigNumber(vault.totalapr)
            .dividedBy(365)
            .toNumber()
            .toLocaleString("en-US", { maximumFractionDigits: 2 }),
        originalValue: new BigNumber(vault.totalapr).dividedBy(365),
      },
      wallet: {
        value: vault.userData
          ? getBalanceNumber(new BigNumber(vault.userData.lpTokenBalance))
              .toFixed(2)
              .toString()
          : "0",
        originalValue: vault.userData
          ? new BigNumber(vault.userData.lpTokenBalance)
          : null,
      },
      deposited: {
        value: vault.userData
          ? getBalanceNumber(new BigNumber(vault.userData.stakedBalance))
              .toFixed(2)
              .toString()
          : "0",
        originalValue: vault.userData
          ? new BigNumber(vault.userData.stakedBalance)
          : null,
      },
      liquidity: {
        liquidity: vault.liquidity,
        realLiquidityInVaults: new BigNumber(vault?.priceOfQuoteToken)
          .times(vault.lpTotalInQuoteTokenOfVaults)
          .toNumber(),
      },
      totalapr: vault.totalapr,
      details: vault,
    };

    return row;
  });

  const renderContent = (): JSX.Element => {
    console.log("render", vaultsStaked);

    console.log(rowData);
    if (viewMode === ViewMode.TABLE && rowData.length) {
      const columnSchema = DesktopColumnSchema;

      const columns = columnSchema.map((column) => ({
        id: column.id,
        name: column.name,
        label: column.label,
        sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
          switch (column.name) {
            case "farm":
              return b.id - a.id;
            case "apr":
              if (a.original.apr.value && b.original.apr.value) {
                return (
                  Number(a.original.apr.value) - Number(b.original.apr.value)
                );
              }

              return 0;
            default:
              return 1;
          }
        },
        sortable: column.sortable,
      }));

      return <Table data={rowData} columns={columns} />;
    }

    return <></>;
  };

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value);
  };

  const StyledContainer = styled(Container)`
    margin-top: 40px;
    background-color: #887963;
    display: flex;
    min-height: 200px;
    align-items: center;
    border-radius: 10px;
    text-align: left;
  `;
  const StyledSubContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  `;
  const StyledHeading = styled.div`
    font-size: 45px;
    color: #ffffff;
    font-weight: bold;
    text-align: center;
  `;
  const StyledSubHeading = styled.div`
    margin-top: 30px;
    font-size: 35px;
    color: #ffffff;
    text-align: center;
  `;

  return (
    <>
      <StyledContainer>
        <StyledSubContainer>
          <StyledHeading>Vaults</StyledHeading>
          <StyledSubHeading>stake LP tokens to earn</StyledSubHeading>
        </StyledSubContainer>
      </StyledContainer>
      <Page>
        <ControlContainer>
          <ViewControls>
            <ToggleWrapper>
              <Toggle
                checked={stackedOnly}
                onChange={() => setStackedOnly(!stackedOnly)}
                scale="sm"
              />
              <Text> {TranslateString(1116, "Staked only")}</Text>
            </ToggleWrapper>

            <FarmTabButtons />
          </ViewControls>
          <FilterContainer>
            <LabelWrapper>
              <Text>SORT BY</Text>
              <Select
                options={[
                  {
                    label: "Hot",
                    value: "hot",
                  },
                  {
                    label: "APR",
                    value: "apr",
                  },
                  {
                    label: "Liquidity",
                    value: "liquidity",
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </LabelWrapper>
            <LabelWrapper style={{ minWidth: "300px" }}>
              <Text>SEARCH</Text>
              <SearchInput onChange={handleChangeQuery} value={query} />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        {renderContent()}
      </Page>
    </>
  );
};

export default Vaults;
