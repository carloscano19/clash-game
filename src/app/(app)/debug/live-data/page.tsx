'use client';

import { useState, useEffect } from 'react';
import { mockAdapter } from '@/features/live-data/mock-adapter';
import type { MatchEvent, Match } from '@/types/football';

// Token must match MOCK_FOOTBALL_TOKEN in .env.local
const TOKEN = process.env['NEXT_PUBLIC_MOCK_TOKEN'] ?? 'dev-mock-token-local';

export default function DebugLiveDataPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [matchState, setMatchState] = useState<Match | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('/api/mock-football/matches', {
      headers: { Authorization: `Bearer ${TOKEN}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => { if (data.matches) setMatches(data.matches); })
      .catch(err => setError(`Failed to load matches: ${err.message}`));
  }, []);

  useEffect(() => {
    if (!selectedMatch) return;

    setEvents([]);
    // Subscribe to SSE
    const unsubscribe = mockAdapter.subscribe(selectedMatch, (event) => {
      setEvents(prev => [...prev, event]);
    });

    return () => unsubscribe();
  }, [selectedMatch]);

  const tick = async (seconds: number) => {
    if (!selectedMatch) return;
    const res = await fetch('/api/mock-football/admin/tick', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`
      },
      body: JSON.stringify({ matchId: selectedMatch, seconds })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(`Tick failed: ${res.status} — ${JSON.stringify(body)}`);
      return;
    }
    const data = await res.json();
    setError('');
    // Refresh match state after each tick
    if (selectedMatch) {
      const simRes = await fetch(`/api/mock-football/matches/${selectedMatch}`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      if (simRes.ok) {
        const simData = await simRes.json();
        setMatchState(simData.match);
      }
    }
  };

  return (
    <div className="p-8 font-mono bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-2">⚽ Phase 2: Live Data Debugger</h1>
      <p className="text-gray-400 text-sm mb-6">Token: <code className="bg-gray-800 px-1">{TOKEN}</code></p>
      
      {error && (
        <div className="bg-red-900 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">
          🚨 {error}
        </div>
      )}

      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <select 
          className="border border-gray-600 p-2 bg-gray-800 text-white rounded"
          value={selectedMatch} 
          onChange={e => { setSelectedMatch(e.target.value); setEvents([]); setMatchState(null); }}
        >
          <option value="">Select a match...</option>
          {matches.map(m => (
            <option key={m.id} value={m.id}>
              {m.homeTeam.name} vs {m.awayTeam.name}
            </option>
          ))}
        </select>

        {selectedMatch && (
          <>
            <button 
              onClick={() => tick(60)} 
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white transition-colors"
            >
              +1 Min
            </button>
            <button 
              onClick={() => tick(600)} 
              className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white transition-colors"
            >
              +10 Min
            </button>
            <button 
              onClick={() => tick(2700)} 
              className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded text-white transition-colors"
            >
              +HT (45min)
            </button>
          </>
        )}
      </div>

      {matchState && (
        <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-600 text-sm flex gap-6">
          <span>🕐 Minute: <strong>{Math.floor(matchState.currentMinute)}&apos;</strong></span>
          <span>📊 Status: <strong className="text-yellow-300">{matchState.status}</strong></span>
          <span>⚽ Score: <strong className="text-green-400">
            {matchState.homeTeam.shortCode} {matchState.score.home} – {matchState.score.away} {matchState.awayTeam.shortCode}
          </strong></span>
        </div>
      )}

      <div className="bg-gray-900 p-4 rounded-lg min-h-[300px] max-h-[500px] overflow-auto border border-gray-700">
        <h3 className="text-gray-400 mb-2 text-xs uppercase tracking-widest">Live Event Stream</h3>
        {events.length === 0 && <p className="text-gray-600 italic text-sm">No events yet. Select a match and click +1 Min to advance time.</p>}
        {[...events].reverse().map(ev => (
          <div key={ev.id} className="text-sm mb-1 flex gap-3">
            <span className="text-gray-500 w-10 text-right">[{Math.floor(ev.minute)}&apos;]</span>
            <span className={`font-bold ${
              ev.type === 'goal' || ev.type === 'penalty_scored' ? 'text-yellow-300' :
              ev.type === 'red_card' ? 'text-red-400' :
              ev.type === 'yellow_card' ? 'text-yellow-500' :
              ev.type === 'full_time' || ev.type === 'half_time' ? 'text-purple-400' :
              'text-green-400'
            }`}>{ev.type}</span>
            {ev.team && <span className="text-gray-400">{ev.team}</span>}
            {ev.player && <span className="text-blue-300">{ev.player.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
