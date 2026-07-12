// UtilityBar is now rendered inside SiteHeader. This export is kept as a
// no-op shim so existing imports (e.g. PublicLayout) don't render a
// second, duplicate utility strip above the canonical header.

export function UtilityBar() {
  return null;
}

export default UtilityBar;
