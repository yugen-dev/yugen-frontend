import React from "react";
import { Text } from "yugen-uikit";
import { Oval } from "react-loader-spinner";
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
          <Oval height={300} width={200} color="#d47a3e" />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <AutoColumn gap="12px" justify="center">
            <Text
              fontSize="14px"
              textAlign="center"
              style={{ whiteSpace: "pre-line" }}
            >
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
