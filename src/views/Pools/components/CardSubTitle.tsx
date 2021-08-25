import styled from "styled-components";

interface StyledTitleProps {
  isFinished?: boolean;
}

const CardTitle = styled.div<StyledTitleProps>`
  color: #2082e9;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.1;
`;

export default CardTitle;
