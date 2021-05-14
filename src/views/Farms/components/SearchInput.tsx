import React, { useState } from "react";
import { Input } from "cryption-uikit";
import styled from "styled-components";

const StyledInput = styled(Input)`
  border-radius: 16px;
  margin-left: auto;
`;

const InputWrapper = styled.div`
  position: relative;
  margin: 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 234px;
    display: block;
  }
  > div {
    margin: 0px;
  }
`;

const Container = styled.div<{ toggled: boolean }>``;

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<Props> = ({ value, onChange }) => {
  const [toggled, setToggled] = useState(false);

  return (
    <Container toggled={toggled}>
      <InputWrapper>
        <Input
          value={value}
          onInputChange={onChange}
          placeholder="Search farms"
          onBlurChange={() => setToggled(false)}
        />
      </InputWrapper>
    </Container>
  );
};

export default SearchInput;
