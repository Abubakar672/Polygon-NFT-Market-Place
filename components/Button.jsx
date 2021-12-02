import styled from "styled-components";

export default function Button({
  primary,
  type,
  func,
  asset,
  styles,
  children,
}) {
  return (
    <StyledButton
      onClick={() => (func ? func(asset) : null)}
      type={type ? type : "button"}
      primary={primary}
      style={styles}
    >
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  background: ${(props) => (props.primary ? "#2081e2" : "transparent")};
  color: ${(props) => (props.primary ? "#ffffff" : "#2081e2")};
  padding: 0.8rem 2rem;
  border: 2px solid #2081e2;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;
