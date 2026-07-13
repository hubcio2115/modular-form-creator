import { keyframes, styled } from "styled-components";

const spin = keyframes`to { transform: rotate(360deg); }`;

export const Spinner = styled.div`
  position: sticky;
  top: 1rem;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;
