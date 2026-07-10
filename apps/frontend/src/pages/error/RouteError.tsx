import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import styled from "styled-components";
import { Button, Card } from "@components/design-system";
import { isBetterFetchError } from "@lib/isBetterFetchError";

interface NormalizedError {
  status: number;
  statusText: string;
  detail: string;
}

export default function RouteError() {
  const error = useRouteError();
  const { status, statusText, detail } = normalizeError(error);

  return (
    <Page>
      <ErrorCard>
        <Status>{status}</Status>
        <Title>{statusText}</Title>
        <Message>{detail}</Message>

        <Link to="/">
          <Button>Go back home</Button>
        </Link>
      </ErrorCard>
    </Page>
  );
}

function normalizeError(error: unknown): NormalizedError {
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      statusText: error.statusText || (error.status === 404 ? "Not Found" : "Error"),
      detail: typeof error.data === "string" && error.data ? error.data : "The page you're looking for doesn't exist.",
    };
  }

  if (isBetterFetchError(error)) {
    const data = error.error;
    const detail =
      typeof data === "string" && data
        ? data
        : typeof data?.message === "string" && data.message
          ? data.message
          : error.message;

    return {
      status: error.status,
      statusText: error.statusText || (error.status === 404 ? "Not Found" : "Error"),
      detail: detail || "The request failed.",
    };
  }

  return { status: 500, statusText: "Error", detail: "An unexpected error occurred." };
}

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md}`};
`;

const ErrorCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 420px;
  text-align: center;
`;

const Status = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 3rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`;

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`;
