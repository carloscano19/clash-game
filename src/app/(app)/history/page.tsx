import { getMyProfile } from '@/features/profile/server/profile';

export default async function HistoryPage() {
  const profileResult = await getMyProfile();

  return (
    <main className="p-4 md:p-8 pt-[80px]">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-display font-semibold tracking-wide text-text-primary">
          HISTORY (Phase 1 Smoke Test)
        </h1>

        <div className="bg-charcoal-800 border border-charcoal-500 rounded-xl p-6">
          {profileResult.ok ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-text-primary">Your Profile</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-text-secondary">ID:</div>
                <div className="text-text-primary font-mono">{profileResult.value.id}</div>
                
                <div className="text-text-secondary">Display Name:</div>
                <div className="text-text-primary">{profileResult.value.display_name}</div>
                
                <div className="text-text-secondary">SSU Balance:</div>
                <div className="text-text-primary font-mono text-chiliz-red font-semibold">
                  {profileResult.value.ssu_balance.toString()} ⟁
                </div>
              </div>
            </div>
          ) : (
            <div className="text-warning">
              Failed to load profile: {profileResult.error.message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
