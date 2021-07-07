import React from "react";
import { Tag, VerifiedIcon, CommunityIcon, BinanceIcon } from "cryption-uikit";

const CoreTag = (props) => (
  <Tag
    color="#9307FE"
    outline
    startIcon={<VerifiedIcon color="#9307FE" />}
    {...props}
  >
    Core
  </Tag>
);

const CommunityTag = (props) => (
  <Tag
    color="secondary"
    variant="secondary"
    outline
    startIcon={<CommunityIcon />}
    {...props}
  >
    Community
  </Tag>
);

const BinanceTag = (props) => (
  <Tag variant="binance" outline startIcon={<BinanceIcon />} {...props}>
    Binance
  </Tag>
);

const DualTag = (props) => (
  <Tag variant="textSubtle" outline {...props}>
    Dual
  </Tag>
);

export { CoreTag, CommunityTag, BinanceTag, DualTag };
