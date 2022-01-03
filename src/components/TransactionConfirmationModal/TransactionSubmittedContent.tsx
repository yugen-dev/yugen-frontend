import { ChainId } from "@cryption-network/polydex-sdk";
import React from "react";
import { Button, LinkExternal } from "cryption-uikit";
import Tick from "components/Tick";
import { AutoColumn } from "../Column";
import { getMaticExplorerLink } from "../../utils";
import { Wrapper, Section, ConfirmedIcon, ContentHeader } from "./helpers";

type TransactionSubmittedContentProps = {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
};

const TransactionSubmittedContent = ({
  onDismiss,
  chainId,
  hash,
}: TransactionSubmittedContentProps) => {
  return (
    <Wrapper>
      <Section>
        <ContentHeader onDismiss={onDismiss}>
          Transaction Confirmed
        </ContentHeader>
        <ConfirmedIcon>
          <Tick size={100} />
        </ConfirmedIcon>
        <AutoColumn gap="8px" justify="center">
          {chainId && hash && (
            <LinkExternal
              href={getMaticExplorerLink(chainId, hash, "transaction")}
            >
              View on PolygonScan
            </LinkExternal>
          )}
          <Button onClick={onDismiss} mt="20px">
            Close
          </Button>
        </AutoColumn>
      </Section>
    </Wrapper>
  );
};

export default TransactionSubmittedContent;
