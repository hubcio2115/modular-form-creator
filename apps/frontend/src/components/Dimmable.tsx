import { styled } from "styled-components";

export const Dimmable = styled.div<{ $dimmed: boolean }>`
  opacity: ${({ $dimmed }) => ($dimmed ? 0.5 : 1)};
  transition: opacity 0.2s ease;
`;
