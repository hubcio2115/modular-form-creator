import styled from "styled-components";
import { Card } from "@components/design-system";
import { Skeleton } from "@components/Skeleton";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md}`};
`;

export const DetailsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 640px;
  height: max-content;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Heading = styled.h1`
  flex: 1;
  min-width: 0;
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.inkStrong};
  word-break: break-word;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

export const Fields = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

export const FieldLabel = styled.dt`
  color: ${({ theme }) => theme.colors.inkMuted};
`;

export const FieldValue = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.ink};
  word-break: break-word;
`;

export const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const BadgeSkeleton = styled(Skeleton)`
  border-radius: ${({ theme }) => theme.radii.pill};
`;

export const Placeholder = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`;
