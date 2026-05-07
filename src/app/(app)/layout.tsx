/**
 * App group layout — wraps all authenticated app routes.
 * Adds the persistent TopBar and content offset.
 * See design_system.md §2.2
 */
import { TopBar } from '@/components/ui/TopBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <TopBar />
      {/* Offset content below the fixed 60px TopBar */}
      <main className="pt-[60px]">
        {children}
      </main>
    </>
  );
}
