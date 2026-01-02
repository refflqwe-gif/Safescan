import React from 'react';

const WalletScanner = ({
  account,
  onConnect,
  onDisconnect,
  recentScans = [],
  onRequestApproval,
  stats = { scanned: 0, compromised: 0, safe: 0 },
}: {
  account: string;
  onConnect: () => void;
  onDisconnect: () => void;
  recentScans: {
    address: string;
    timestamp: string;
    status: string;
    score: number;
  }[];
  onRequestApproval: (chain: string) => void;
  stats: { scanned: number; compromised: number; safe: number };
}) => {
  const chains = [
    { id: 'ethereum', name: 'Ethereum', color: 'bg-purple-600' },
    { id: 'polygon', name: 'Polygon', color: 'bg-purple-800' },
    { id: 'bsc', name: 'BSC', color: 'bg-yellow-600' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Main Card */}
      <div className="bg-[#0A2436] rounded-2xl border border-[#13394C] p-4 sm:p-6 lg:p-8 shadow-2xl">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Wallet Security Scanner
          </h1>
          <p className="text-[#7BAED1] text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Connect your wallet and scan for risks across multiple blockchain
            networks.
          </p>
        </div>

        {/* Connection Status */}
        {!account ? (
          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-[#13394C] rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <p className="text-[#7BAED1] text-sm sm:text-base mb-4">
                Connect your wallet to scan for compromised tokens, suspicious
                activity, and risks.
              </p>
              <button
                onClick={() => {
                  onConnect();
                }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#78AEE0] hover:bg-[#5a9cd6] text-[#04111A] font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-base sm:text-lg"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-[#13394C] rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <p className="text-[#7BAED1] text-sm sm:text-base mb-4">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
              <button
                onClick={onDisconnect}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#F87171] hover:bg-[#e55f5f] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-base sm:text-lg"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}

        {/* Chains Grid */}
        {account && (
          <div className="mb-6 sm:mb-8">
            <div className="bg-[#0B3248] border-l-4 border-[#78AEE0] p-4 rounded-lg mb-4 text-[#BFDFF7] text-sm sm:text-base flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#78AEE0] flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-4a1 1 0 112 0v4a1 1 0 11-2 0V6zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                We only request approval to{' '}
                <span className="font-semibold">
                  check token balances and permissions
                </span>
                . No funds are moved. This helps you simulate security risks
                safely.
              </p>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 sm:mb-6 text-center">
              Select Network to Scan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {chains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => onRequestApproval(chain.id)}
                  className={`${chain.color} hover:opacity-90 text-white font-medium py-3 sm:py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base`}
                >
                  {chain.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        {account && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#13394C] rounded-xl p-4 text-center shadow-md hover:scale-105 transition-all duration-200">
              <p className="text-[#7BAED1] text-sm sm:text-base">Scanned</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {stats.scanned.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#13394C] rounded-xl p-4 text-center shadow-md hover:scale-105 transition-all duration-200">
              <p className="text-[#7BAED1] text-sm sm:text-base">Compromised</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#F87171]">
                {stats.compromised.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#13394C] rounded-xl p-4 text-center shadow-md hover:scale-105 transition-all duration-200">
              <p className="text-[#7BAED1] text-sm sm:text-base">Safe</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#6EE7B7]">
                {stats.safe.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Recent Scans */}
        {account && recentScans.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
              Recent Wallet Scans
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {recentScans.map((scan, index) => (
                <div
                  key={index}
                  className="bg-[#13394C] rounded-lg p-3 sm:p-4 border border-[#1e4a62] flex flex-col sm:flex-row justify-between items-center gap-2"
                >
                  <div className="text-[#78AEE0] font-medium text-sm sm:text-base break-all">
                    {scan.address}
                  </div>
                  <div className="flex gap-2 items-center text-sm sm:text-base">
                    <span
                      className={`font-semibold ${
                        scan.status === 'Safe'
                          ? 'text-[#6EE7B7]'
                          : 'text-[#F87171]'
                      }`}
                    >
                      {scan.status === 'Safe' ? '✔ Safe' : '⚠ Compromised'}
                    </span>
                    <span className="text-[#7BAED1]">{scan.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Cards */}
        {account && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div className="bg-[#0A2436] rounded-xl border border-[#13394C] p-4 sm:p-6">
              <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">
                Security First
              </h4>
              <p className="text-[#7BAED1] text-xs sm:text-sm">
                Always review wallet activity and revoke suspicious access.
              </p>
            </div>
            <div className="bg-[#0A2436] rounded-xl border border-[#13394C] p-4 sm:p-6">
              <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">
                Multi-Chain
              </h4>
              <p className="text-[#7BAED1] text-xs sm:text-sm">
                Scan wallets on Ethereum, Polygon, and BSC for potential risks.
              </p>
            </div>
            <div className="bg-[#0A2436] rounded-xl border border-[#13394C] p-4 sm:p-6">
              <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">
                Real-Time Metrics
              </h4>
              <p className="text-[#7BAED1] text-xs sm:text-sm">
                View live stats of scanned wallets, compromised addresses, and
                safe accounts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletScanner;
