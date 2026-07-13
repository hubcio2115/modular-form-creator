import styled from "styled-components";
import { NavLink } from "react-router";
import type { Resource } from "~/lib/resource/resource";

const links = [
  { to: "", label: "Overview", end: true },
  { to: "details", label: "Details", end: false },
  { to: "basic-info", label: "Basic Info", end: false },
  { to: "project-details", label: "Project Details", end: false },
];

export function ResourceNav({ resourceId }: Pick<Resource, "resourceId">) {
  return (
    <Nav aria-label="Resource sections">
      {links.map((link) => (
        <NavItem key={link.to} to={`/resources/${resourceId}/${link.to}`} end={link.end}>
          {link.label}
        </NavItem>
      ))}
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

const NavItem = styled(NavLink)`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.875rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.inkMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceAlt};
    font-weight: 600;
  }
`;
