/**
 * App group layout — wraps all authenticated routes.
 * Phase 0: passthrough — auth gate added in Phase 1.
 * See srs.md §10, design_system.md §2
 */

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <>{children}</>;
}
