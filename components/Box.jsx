import styled from "styled-components";

export default function Box({ top, children, styles }) {
  return (
    <StyledBox style={styles}>
      <BoxTitle>{top}</BoxTitle>
      <BoxContent>{children}</BoxContent>
    </StyledBox>
  );
}

const StyledBox = styled.div`
  border: 1px solid #e5e8eb;
  border-radius: 0.5rem;
  overflow: hidden;
  height: 100%;
  width: 100%;
`;

const BoxTitle = styled.div`
  overflow: hidden;
  border-bottom: 1px solid #e5e8eb;
`;

const BoxContent = styled.div`
  overflow: hidden;
`;
