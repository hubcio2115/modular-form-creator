import styled, { css } from "styled-components";
import { NavLink, useLocation } from "react-router";
import { isBasicInfoComplete, type Resource } from "~/lib/resource/resource";

const links = [
  { to: "", label: "Overview", end: true },
  { to: "details", label: "Details", end: false },
  { to: "basic-info", label: "Basic Info", end: false },
  { to: "project-details", label: "Project Details", end: false },
];

export function ResourceNav({ resource }: { resource: Resource }) {
  const location = useLocation();

  // Project Details stays disabled for drafts until Basic Info is complete (per spec).
  const projectDetailsLocked = resource.status === "draft" && !isBasicInfoComplete(resource.basicInfo);

  return (
    <Nav aria-label="Resource sections">
      {links.map((link) => {
        if (link.to === "project-details" && projectDetailsLocked) {
          return (
            <NavItemDisabled key={link.to} aria-disabled title="Complete Basic Info first">
              {link.label}
            </NavItemDisabled>
          );
        }

        return (
          <NavItem
            key={link.to}
            to={`/resources/${resource.resourceId}/${link.to}`}
            end={link.end}
            replace
            state={location.state}
          >
            {link.label}
          </NavItem>
        );
      })}
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

const navItemBase = css`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.875rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const NavItem = styled(NavLink)`
  ${navItemBase}

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

const NavItemDisabled = styled.span`
  ${navItemBase}
  opacity: 0.5;
  cursor: not-allowed;
`;
