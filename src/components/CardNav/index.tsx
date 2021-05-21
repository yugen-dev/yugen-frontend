/* eslint-disable react/require-default-props */
import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from 'cryption-uikit'
import useI18n from 'hooks/useI18n'

const CustomContainer = styled.div`
  margin-bottom: 0px;
`;
function Nav({ activeIndex = 0 }: { activeIndex?: number }) {
  const [index, setIndex] = React.useState(activeIndex);
  const handleClick = (newIndex) => {
    setIndex(newIndex)
  };
  const TranslateString = useI18n()
  return (
    <CustomContainer>
      <ButtonMenu
        activeIndex={index}
        scale="md"
        variant="primary"
        onItemClick={handleClick}>
        <ButtonMenuItem style={{ minWidth: "150px" }} id="swap-nav-link" to="/swap" as={Link}>
          {TranslateString(1142, 'Swap')}
        </ButtonMenuItem>
        <ButtonMenuItem style={{ minWidth: "150px" }} id="pool-nav-link" to="/pool" as={Link}>
          {TranslateString(262, 'Liquidity')}
        </ButtonMenuItem>
        <ButtonMenuItem
          id="pool-nav-link"
          as="a"
          style={{ minWidth: "150px" }}
          href="https://www.binance.org/en/bridge?utm_source=PancakeSwap"
          target="_blank"
          rel="noreferrer noopener"
        >
          Bridge
        </ButtonMenuItem>
      </ButtonMenu>
    </CustomContainer>
  )
}

export default Nav
