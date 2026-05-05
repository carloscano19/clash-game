/**
 * Marketing group layout — wraps public routes (login, landing).
 * No auth required.
 */

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return <>{children}</>;
}
