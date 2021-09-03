/* eslint-disable react/no-danger */
import React, { useEffect, useCallback, useState } from "react";
import { Route, useRouteMatch, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { RowType, Toggle, Text } from "cryption-uikit";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID, CROSS_CHAIN_API_LINK } from "config";
import {
  useFarms,
  usePriceBnbBusd,
  usePriceBtcBusd,
  usePriceCakeBusd,
  usePriceEthBusd,
} from "state/hooks";
import useRefresh from "hooks/useRefresh";
import { fetchFarmUserDataAsync } from "state/actions";
import { QuoteToken } from "config/constants/types";
import useI18n from "hooks/useI18n";
import { getBalanceNumber } from "utils/formatBalance";
import { orderBy } from "lodash";
import cntMascot from "images/Cryption Network Mascot Farming.png";
import CountdownTimer from "components/CountdownTimer";
import FarmCard, { FarmWithStakedValue } from "./components/FarmCard/FarmCard";
import Table from "./components/FarmTable/FarmTable";
import FarmTabButtons from "./components/FarmTabButtons";
import SearchInput from "./components/SearchInput";
import { RowProps } from "./components/FarmTable/Row";
import { DesktopColumnSchema, ViewMode } from "./components/types";
import Select, { OptionProps } from "./components/Select/Select";
import MrCNTaah from "../../images/MrCNTaah.png";

const FlexLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 25px;
  & > * {
    min-width: 280px;
    max-width: 31.5%;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 32px;
  }
`;
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
`;
const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  > ${Text} {
    font-size: 15px;
    margin-right: 15px;
  }
`;
const CNHeading = styled.div`
  font-size: 45px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;

const Farms: React.FC = () => {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const TranslateString = useI18n();
  const farmsLP = useFarms();
  const cakePrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [viewMode, setViewMode] = useState(ViewMode.CARD);
  const ethPriceUsd = usePriceEthBusd();
  const btcPriceUsd = usePriceBtcBusd();
  const { account } = useWeb3React("web3");
  const [sortOption, setSortOption] = useState("hot");
  const [crossChainData, setCrossChainData] = useState([]);

  const dispatch = useDispatch();
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);
  useEffect(() => {
    const getAllCrossChainTranscations = async (accountId) => {
      if (accountId) {
        const Header = new Headers();
        Header.append("Content-Type", "application/x-www-form-urlencoded");
        const urlencoded = new URLSearchParams();
        urlencoded.append("account", account);
        const requestOptions = {
          method: 'POST',
          headers: Header,
          body: urlencoded,
        };
        const getAllTrx = await fetch(`${CROSS_CHAIN_API_LINK}/getAllTranscations`, requestOptions)
        const resp = await getAllTrx.json();
        setCrossChainData(resp)
      }
    }
    if (account) {
      getAllCrossChainTranscations(account);
    }
    const interval = setInterval(() => {
      getAllCrossChainTranscations(account)
    }, 5000);
    return () => clearInterval(interval);
  }, [account]);
  const [stackedOnly, setStackedOnly] = useState(false);

  const activeFarms = farmsLP.filter((farm) => farm.multiplier !== "0X");
  const inactiveFarms = farmsLP.filter((farm) => farm.multiplier === "0X");

  const stackedOnlyFarms = activeFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
    switch (sortOption) {
      case "apr":
        return orderBy(farms, "apy", "desc");
      case "multiplier":
        return orderBy(
          farms,
          (farm: FarmWithStakedValue) => Number(farm.multiplier.slice(0, -1)),
          "desc"
        );
      case "earned":
        return orderBy(
          farms,
          (farm: FarmWithStakedValue) =>
            farm.userData ? farm.userData.earnings : 0,
          "desc"
        );
      case "liquidity":
        return orderBy(
          farms,
          (farm: FarmWithStakedValue) => Number(farm.liquidity),
          "desc"
        );
      default:
        return farms;
    }
  };

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay): FarmWithStakedValue[] => {
      const cakePriceVsBNB = new BigNumber(
        farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote ||
        0
      );
      let farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map(
        (farm) => {
          if (!farm.tokenAmount || !farm.lpTotalInQuoteToken) {
            return farm;
          }
          const cakeRewardPerBlock = CAKE_PER_BLOCK.times(farm.poolWeight);
          const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR);

          // cakePriceInQuote * cakeRewardPerYear / lpTotalInQuoteToken
          let apy = cakePriceVsBNB
            .times(cakeRewardPerYear)
            .div(farm.lpTotalInQuoteToken);

          if (
            farm.quoteTokenSymbol === QuoteToken.BUSD ||
            farm.quoteTokenSymbol === QuoteToken.UST
          ) {
            apy = cakePriceVsBNB
              .times(cakeRewardPerYear)
              .div(new BigNumber(farm.tokenAmount).plus(farm.quoteTokenAmount))
              .times(bnbPrice);
          } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
            apy = cakePrice
              .div(ethPriceUsd)
              .times(cakeRewardPerYear)
              .div(farm.lpTotalInQuoteToken);
          } else if (farm.quoteTokenSymbol === QuoteToken.BTC) {
            const usdcBTCAmt = new BigNumber(farm.tokenAmount).div(btcPriceUsd);
            const totalTokensInLp = new BigNumber(farm.quoteTokenAmount).plus(
              usdcBTCAmt
            );
            apy = cakePrice
              .div(btcPriceUsd)
              .times(cakeRewardPerYear)
              .div(totalTokensInLp);
          } else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
            apy = cakeRewardPerYear.div(farm.lpTotalInQuoteToken);
          } else if (farm.dual) {
            const cakeApy =
              farm &&
              cakePriceVsBNB
                .times(cakeRewardPerBlock)
                .times(BLOCKS_PER_YEAR)
                .div(farm.lpTotalInQuoteToken);
            const dualApy =
              farm.tokenPriceVsQuote &&
              new BigNumber(farm.tokenPriceVsQuote)
                .times(farm.dual.rewardPerBlock)
                .times(BLOCKS_PER_YEAR)
                .div(farm.lpTotalInQuoteToken);

            apy = cakeApy && dualApy && cakeApy.plus(dualApy);
          }

          let liquidity = farm.lpTotalInQuoteToken;

          if (!farm.lpTotalInQuoteToken) {
            liquidity = null;
          }
          if (farm.quoteTokenSymbol === QuoteToken.BNB) {
            liquidity = bnbPrice.times(farm.lpTotalInQuoteToken);
          }
          if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
            liquidity = cakePrice.times(farm.lpTotalInQuoteToken);
          }

          if (farm.quoteTokenSymbol === QuoteToken.ETH) {
            liquidity = ethPriceUsd.times(farm.lpTotalInQuoteToken);
          }

          if (farm.quoteTokenSymbol === QuoteToken.BTC) {
            liquidity = btcPriceUsd
              .times(farm.quoteTokenAmount)
              .plus(new BigNumber(farm.tokenAmount));
          }

          return { ...farm, apy, liquidity };
        }
      );

      if (query) {
        const lowercaseQuery = query.toLowerCase();
        farmsToDisplayWithAPY = farmsToDisplayWithAPY.filter(
          (farm: FarmWithStakedValue) => {
            if (farm.lpSymbol.toLowerCase().includes(lowercaseQuery)) {
              return true;
            }

            return false;
          }
        );
      }
      return farmsToDisplayWithAPY;
    },
    [bnbPrice, farmsLP, query, cakePrice, ethPriceUsd, btcPriceUsd]
  );

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const isActive = !pathname.includes("history");
  let farmsStaked = [];
  if (isActive) {
    farmsStaked = stackedOnly
      ? farmsList(stackedOnlyFarms)
      : farmsList(activeFarms);
  } else {
    farmsStaked = farmsList(inactiveFarms);
  }

  farmsStaked = sortFarms(farmsStaked);

  const rowData = farmsStaked.map((farm) => {
    const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm;
    const lpLabel =
      farm.lpSymbol && farm.lpSymbol.toUpperCase().replace("PANCAKE", "");
    const row: RowProps = {
      apr: {
        value:
          farm.apy &&
          farm.apy
            .times(new BigNumber(100))
            .toNumber()
            .toLocaleString("en-US", { maximumFractionDigits: 2 }),
        multiplier: farm.multiplier,
        lpLabel,
        quoteTokenAdresses,
        quoteTokenSymbol,
        tokenAddresses,
        cakePrice,
        originalValue: farm.apy,
      },
      farm: {
        image: farm.lpSymbol.split(" ")[0].toLocaleLowerCase(),
        label: lpLabel,
        pid: farm.pid,
      },
      earned: {
        earnings: farm.userData
          ? getBalanceNumber(new BigNumber(farm.userData.earnings))
          : null,
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm.liquidity,
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      details: farm,
    };

    return row;
  });

  const renderContent = (): JSX.Element => {
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
            case "earned":
              return a.original.earned.earnings - b.original.earned.earnings;
            default:
              return 1;
          }
        },
        sortable: column.sortable,
      }));

      return <Table data={rowData} columns={columns} />;
    }

    return (
      <div>
        <FlexLayout>
          <Route exact path={`${path}`}>
            {farmsStaked.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                crossChainTranscations={crossChainData.filter(eachTrx => eachTrx.pid === farm.pid)}
                bnbPrice={bnbPrice}
                cakePrice={cakePrice}
                ethPrice={ethPriceUsd}
                btcPrice={btcPriceUsd}
                account={account}
                removed={false}
              />
            ))}

            {farmsStaked.length === 0 && (
              <div
                style={{
                  width: "100%",
                  display: "grid",
                  justifyContent: "center",
                }}
              >
                <img src={MrCNTaah} alt="Cannot find" width="250px" />
              </div>
            )}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsStaked.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                crossChainTranscations={crossChainData.filter(eachTrx => eachTrx.pid === farm.pid)}
                bnbPrice={bnbPrice}
                cakePrice={cakePrice}
                ethPrice={ethPriceUsd}
                btcPrice={btcPriceUsd}
                account={account}
                removed
              />
            ))}
          </Route>
        </FlexLayout>
      </div>
    );
  };

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value);
  };

  return (
    <>
      {/* <Header>
        <Heading as="h1" size="xxl" color="secondary" mb="24px">
          {TranslateString(999, "Farms")}
        </Heading>
        <Heading size="lg" color="text">
          {TranslateString(999, "Stake Liquidity Pool (LP) tokens to earn.")}
        </Heading> 
      </Header> */}
      <Container>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <CNHeading>Core Farms</CNHeading>
            <CountdownTimer unixEndTimeInSeconds={1627569000} />
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={cntMascot} alt="Cryption Netwrok" width="250px" />
            </div>
          </Grid>
        </Grid>
      </Container>
      <Page>
        <ControlContainer>
          <ViewControls>
            {/* <ToggleView
              viewMode={viewMode}
              onToggle={(mode: ViewMode) => setViewMode(mode)}
            /> */}
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
                    label: "Multiplier",
                    value: "multiplier",
                  },
                  {
                    label: "Earned",
                    value: "earned",
                  },
                  {
                    label: "Liquidity",
                    value: "liquidity",
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 20 }}>
              <Text>SEARCH</Text>
              <SearchInput onChange={handleChangeQuery} value={query} />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        {renderContent()}
        {/* <StyledImage
          src="/images/3dpan.png"
          alt="Swapcafe illustration"
          width={120}
          height={103}
        /> */}
      </Page>
    </>
  );
};

export default Farms;
