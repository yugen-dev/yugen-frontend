import React from "react";
import { Text, Spinner } from "cryption-uikit";
import { AutoColumn } from "../Column";
import { Wrapper, Section, ConfirmedIcon, ContentHeader } from "./helpers";

type ConfirmationPendingContentProps = {
  onDismiss: () => void;
  pendingText: string;
};

const ConfirmationPendingContent = ({
  onDismiss,
  pendingText,
}: ConfirmationPendingContentProps) => {
  return (
    <Wrapper>
      <Section>
        <ContentHeader onDismiss={onDismiss}>
          Waiting for confirmation
        </ContentHeader>
        <ConfirmedIcon>
          <Spinner />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <AutoColumn gap="12px" justify="center">
            <Text fontSize="14px">
              <strong>{pendingText}</strong>
            </Text>
          </AutoColumn>
          <Text fontSize="14px">Confirm this transaction in your wallet</Text>
        </AutoColumn>
      </Section>
    </Wrapper>
  );
};

export default ConfirmationPendingContent;
