import React, { useMemo } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import partition from "lodash/partition";
import {
  usePools,
  useBlock,
  usePriceCakeBusd,
  usePriceEthBusd,
  usePriceBnbBusd,
} from "state/hooks";
import IfoCard from "./components/IfoCard";
import Header from "./icons/Header.png";
import PoolCard from "./components/PoolCard";

const IFO = () => {
  const { account } = useWeb3React("web3");
  const pools = usePools(account);
  const cntPrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();
  const ethPrice = usePriceEthBusd();
  const currentBlock = useBlock();

  const [, openPools] = useMemo(
    () =>
      partition(
        pools,
        (pool) =>
          pool.isFinished ||
          parseInt(currentBlock.toString(), 10) > pool.endBlock
      ),
    [currentBlock, pools]
  );

  // TODO: change scroll co-ordinate based on banner size
  // TODO: also add condition to check if not using mobile
  // React.useEffect(() => {
  //   window.scrollTo({
  //     top: 350,
  //     behavior: "smooth",
  //   });
  // }, []);

  return (
    <>
      <Page>
        <Container>
          <img src={Header} alt="IFO header" />
        </Container>
        <PageSubContainer>
          <PoolsContainer>
            {openPools.map(
              (pool) =>
                pool.sousId === 1 && (
                  <PoolCard
                    key={pool.sousId}
                    pool={pool}
                    valueOfCNTinUSD={cntPrice}
                    bnbPrice={bnbPrice}
                    ethPrice={ethPrice}
                  />
                )
            )}
          </PoolsContainer>
          <IfoCard />
        </PageSubContainer>
      </Page>
    </>
  );
};

const PoolsContainer = styled.div`
  border-radius: 15px;
  margin: 20px;
  flex: 1;
`;

const PageSubContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-wrap: wrap;
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

export default IFO;
