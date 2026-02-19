// RBAC Role definitions
export type AppRole =
  | "FREE_MEMBER"
  | "nrc"
  | "jury"
  | "chapter"
  | "sponsor"
  | "admin";

export const ROLE_LABELS: Record<AppRole, string> = {
  FREE_MEMBER: "User",
  nrc: "NRC Member",
  jury: "Jury Member",
  chapter: "Chapter Lead",
  sponsor: "Sponsor",
  admin: "Administrator",
};

export const ROLE_DESCRIPTIONS: Record<AppRole, string> = {
  FREE_MEMBER: "Standard platform user who can nominate and vote",
  nrc: "National Review Committee member who reviews nominations",
  jury: "Jury member who scores Blue Garnet nominees",
  chapter: "Regional chapter leader managing local operations",
  sponsor: "Sponsor with limited dashboard access",
  admin: "Full platform administrator",
};

// Role hierarchy for permission checks
export const ROLE_HIERARCHY: Record<AppRole, number> = {
  FREE_MEMBER: 1,
  sponsor: 2,
  chapter: 3,
  jury: 4,
  nrc: 5,
  admin: 10,
};

export const canAccess = (
  userRoles: AppRole[],
  requiredRole: AppRole,
): boolean => {
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  return userRoles.some((role) => ROLE_HIERARCHY[role] >= requiredLevel);
};

export const hasRole = (userRoles: AppRole[], role: AppRole): boolean => {
  return userRoles.includes(role);
};
