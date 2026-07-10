import type { ReactNode } from "react";
import { Card } from "~/components/design-system";
import { styled } from "styled-components";

interface ResourceMessageCardProps {
  title: string;
  message?: string;
  /** Optional action, e.g. a retry or create button. */
  children?: ReactNode;
}

/** Centered card used for the list's empty, no-results, and error states. */
export default function ResourceMessageCard({ title, message, children }: ResourceMessageCardProps) {
  return (
    <Card>
      <Content>
        <div>
          <Title>{title}</Title>
          {message ? <Message>{message}</Message> : null}
        </div>

        {children}
      </Content>
    </Card>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

const Title = styled.p`
  margin: 0;
  font-weight: 600;
`;

const Message = styled.p`
  margin: 0.25rem 0 0;
`;
