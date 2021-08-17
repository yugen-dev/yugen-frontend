import { Currency, ETHER, Token } from "@cryption-network/polydex-sdk";
import React, { useMemo } from "react";
import styled from "styled-components";
import useHttpLocations from "../../hooks/useHttpLocations";
import { WrappedTokenInfo } from "../../state/lists/hooks";
import Logo from "../Logo";
import CoinLogo from "../pancake/CoinLogo";

const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${address}/logo.png`;

const StyledBnbLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  object-fit: contain;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`;

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

export default function CurrencyLogo({
  currency,
  size = "24px",
  style,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI : undefined
  );

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return [];

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [
          ...uriLocations,
          `/images/tokens/${currency?.symbol ?? "token"}.png`,
          getTokenLogoURL(currency.address),
        ];
      }

      return [
        `/images/tokens/${currency?.symbol ?? "token"}.png`,
        getTokenLogoURL(currency.address),
      ];
    }
    return [];
  }, [currency, uriLocations]);

  if (currency === ETHER) {
    return (
      <StyledBnbLogo src="/images/tokens/matic.png" size={size} style={style} />
    );
  }

  if (currency?.name === "ARTH") {
    return (
      <StyledBnbLogo src="/images/tokens/arth.png" size={size} style={style} />
    );
  }

  if (currency?.name === "ARTHX") {
    return (
      <StyledBnbLogo src="/images/tokens/arthx.png" size={size} style={style} />
    );
  }
  return (currency as any)?.symbol ? (
    <CoinLogo
      size={size}
      srcs={srcs}
      alt={`${currency?.symbol ?? "token"} logo`}
      style={style}
    />
  ) : (
    <StyledLogo
      size={size}
      srcs={srcs}
      alt={`${currency?.symbol ?? "token"} logo`}
      style={style}
    />
  );
}
