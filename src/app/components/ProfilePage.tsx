import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ArrowLeft, Upload, Plus, ExternalLink, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Clock, FileText, Shield, Loader2, Vote } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useAuth } from '@/app/hooks/useAuth';
import { useKYCRewards } from '@/app/hooks/useKYCRewards';
import { useLiquidityRewards } from '@/app/hooks/useLiquidityRewards';
import { useVoting } from '@/app/hooks/useVoting';

interface Wallet {
  id: string;
  chain: string;
  address: string;
}

interface Investment {
  projectId: string;
  projectName: string;
  projectLogo: string;
  investmentAmount: number;
  tokenAmount: number;
  tokenSymbol: string;
  currentPrice: number;
  entryPrice: number;
  totalVested: number;
  totalClaimed: number;
  nextVestingDate: string;
  nextVestingAmount: number;
}

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'investments' | 'roi' | 'wallets' | 'kyc' | '2fa' | 'voting'>('overview');
  const [profileImage, setProfileImage] = useState<string>('');
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newWalletChain, setNewWalletChain] = useState('');
  const [newWalletAddress, setNewWalletAddress] = useState('');

  // KYC State
  const [kycStatus, setKycStatus] = useState<'not_started' | 'pending' | 'approved' | 'rejected'>('not_started');
  const [userName, setUserName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Use real connected wallet address from wagmi
  const { address, chain } = useAccount();
  const connectedWallet = address ?? '0x0000000000000000000000000000000000000000';
  const connectedChainName = chain?.name ?? 'Ethereum';

  // API hooks
  const { user } = useAuth();
  const { reward: kycReward, isLoading: isKycLoading, claimReward: claimKycReward, isClaiming: isKycClaiming } = useKYCRewards();
  const { reward: liquidityReward, isLoading: isLiquidityLoading, claimReward: claimLiquidityReward, isClaiming: isLiquidityClaiming } = useLiquidityRewards();
  const { options: votingData, status: voteStatus, isLoadingOptions: isVotingLoading, castVote, isCasting } = useVoting();
  const [selectedVotes, setSelectedVotes] = useState<string[]>([]);
  const [additionalWallets, setAdditionalWallets] = useState<Wallet[]>([
    { id: '1', chain: 'Solana', address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' },
    { id: '2', chain: 'Aptos', address: '0x1f2e3d4c5b6a7890abcdef1234567890abcdef1234567890abcdef1234567890' },
  ]);

  const [investments] = useState<Investment[]>([
    {
      projectId: '1',
      projectName: 'DigiMaaya',
      projectLogo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=80',
      investmentAmount: 50000,
      tokenAmount: 125000,
      tokenSymbol: 'DGM',
      currentPrice: 0.52,
      entryPrice: 0.40,
      totalVested: 125000,
      totalClaimed: 37500,
      nextVestingDate: '2026-03-15',
      nextVestingAmount: 12500,
    },
    {
      projectId: '2',
      projectName: 'TechVault AI',
      projectLogo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=80',
      investmentAmount: 25000,
      tokenAmount: 50000,
      tokenSymbol: 'TVAI',
      currentPrice: 0.68,
      entryPrice: 0.50,
      totalVested: 50000,
      totalClaimed: 20000,
      nextVestingDate: '2026-02-20',
      nextVestingAmount: 10000,
    },
    {
      projectId: '3',
      projectName: 'Quantum DeFi',
      projectLogo: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=80',
      investmentAmount: 15000,
      tokenAmount: 75000,
      tokenSymbol: 'QDF',
      currentPrice: 0.18,
      entryPrice: 0.20,
      totalVested: 75000,
      totalClaimed: 15000,
      nextVestingDate: '2026-04-01',
      nextVestingAmount: 15000,
    },
  ]);

  const supportedChains = ['Ethereum', 'Solana', 'Aptos', 'Polygon', 'BNB Chain', 'Avalanche', 'Arbitrum', 'Optimism'];

  // Calculate stats
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + (inv.tokenAmount * inv.currentPrice), 0);
  const totalROI = ((totalCurrentValue - totalInvested) / totalInvested) * 100;
  const averageROI = investments.reduce((sum, inv) => {
    const roi = ((inv.currentPrice - inv.entryPrice) / inv.entryPrice) * 100;
    return sum + roi;
  }, 0) / investments.length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddWallet = () => {
    if (newWalletChain && newWalletAddress) {
      setAdditionalWallets([
        ...additionalWallets,
        {
          id: Date.now().toString(),
          chain: newWalletChain,
          address: newWalletAddress,
        },
      ]);
      setNewWalletChain('');
      setNewWalletAddress('');
      setShowAddWallet(false);
    }
  };

  const handleRemoveWallet = (id: string) => {
    setAdditionalWallets(additionalWallets.filter(w => w.id !== id));
  };

  // 2FA Handlers
  const handleSendOTP = () => {
    if (!email) {
      alert('Please add your email address in the KYC section first');
      setActiveTab('kyc');
      return;
    }
    setVerificationEmail(email);
    setShowOTPInput(true);
    setIsVerifying(true);
    // Simulate sending OTP
    alert(`OTP sent to ${email}. In production, this would send a real OTP via email.`);
    setTimeout(() => setIsVerifying(false), 1000);
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otpCode];
      newOTP[index] = value;
      setOtpCode(newOTP);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerifyOTP = () => {
    const code = otpCode.join('');
    if (code.length === 6) {
      setIsVerifying(true);
      // Simulate OTP verification
      setTimeout(() => {
        setIs2FAEnabled(true);
        setShowOTPInput(false);
        setOtpCode(['', '', '', '', '', '']);
        setIsVerifying(false);
        alert('2FA has been successfully enabled!');
      }, 1500);
    } else {
      alert('Please enter the complete 6-digit code');
    }
  };

  const handleDisable2FA = () => {
    if (confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      setIs2FAEnabled(false);
      setShowOTPInput(false);
      setOtpCode(['', '', '', '', '', '']);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Back Button */}
      <div className="border-b border-border bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#E3107A' }} />
            <span className="text-white">Back to Home</span>
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="border-b border-border bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-800 border-2 overflow-hidden"
                   style={{ borderColor: '#E3107A' }}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-maven-pro"
                       style={{ color: '#E3107A' }}>
                    {connectedWallet.slice(2, 4).toUpperCase()}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full border cursor-pointer hover:opacity-80 transition-opacity"
                     style={{ borderColor: '#E3107A' }}>
                <Upload className="w-4 h-4" style={{ color: '#E3107A' }} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {userName ? `${userName}'s Portfolio` : 'My Portfolio'}
              </h1>
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <span className="font-maven-pro text-sm">Connected Wallet:</span>
                <code className="text-xs bg-gray-800 px-3 py-1 rounded border border-gray-700">
                  {connectedWallet}
                </code>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-gray-400 text-xs mb-1">Total Invested</div>
                  <div className="text-white text-xl font-maven-pro">${totalInvested.toLocaleString()}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-gray-400 text-xs mb-1">Current Value</div>
                  <div className="text-white text-xl font-maven-pro">${totalCurrentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-gray-400 text-xs mb-1">Total P&L</div>
                  <div className={`text-xl font-maven-pro flex items-center gap-1 ${totalROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalROI >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-gray-400 text-xs mb-1">Projects</div>
                  <div className="text-white text-xl font-maven-pro">{investments.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'investments', label: 'My Investments' },
              { id: 'roi', label: 'ROI Tracker' },
              { id: 'wallets', label: 'Wallets' },
              { id: 'kyc', label: 'KYC' },
              { id: 'voting', label: 'Voting' },
              { id: '2fa', label: '2FA' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
                style={activeTab === tab.id ? { borderColor: '#E3107A' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Investment Summary */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Investment Summary</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-maven-pro text-white mb-4">Portfolio Allocation</h3>
                  <div className="space-y-4">
                    {investments.map((inv) => {
                      const percentage = (inv.investmentAmount / totalInvested) * 100;
                      return (
                        <div key={inv.projectId}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">{inv.projectName}</span>
                            <span className="text-white font-maven-pro">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percentage}%`,
                                background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-maven-pro text-white mb-4">Vesting Overview</h3>
                  <div className="space-y-4">
                    {investments.map((inv) => {
                      const vestingPercentage = (inv.totalClaimed / inv.totalVested) * 100;
                      const remaining = inv.totalVested - inv.totalClaimed;
                      return (
                        <div key={inv.projectId} className="pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="text-white font-maven-pro">{inv.projectName}</div>
                              <div className="text-xs text-gray-400">
                                {inv.totalClaimed.toLocaleString()} / {inv.totalVested.toLocaleString()} {inv.tokenSymbol}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-maven-pro">{vestingPercentage.toFixed(0)}%</div>
                              <div className="text-xs text-gray-400">Claimed</div>
                            </div>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${vestingPercentage}%`,
                                background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)',
                              }}
                            />
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            Next: {remaining.toLocaleString()} {inv.tokenSymbol} on {new Date(inv.nextVestingDate).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Rewards Summary */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Rewards</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* KYC Reward Card */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-maven-pro text-white mb-4">KYC Reward</h3>
                  {isKycLoading ? (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                    </div>
                  ) : kycReward ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">KYC Status</span>
                        <span className={`text-sm font-maven-pro ${kycReward.kycStatus === 'COMPLETED' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {kycReward.kycStatus === 'COMPLETED' ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Reward</span>
                        <span className="text-white font-maven-pro">{kycReward.rewardAmount} EMYA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Status</span>
                        <span className={`text-sm font-maven-pro ${
                          kycReward.rewardStatus === 'CLAIMED' ? 'text-green-400' :
                          kycReward.rewardStatus === 'UNLOCKED' ? 'text-blue-400' :
                          kycReward.rewardStatus === 'EXPIRED' ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          {kycReward.rewardStatus}
                        </span>
                      </div>
                      {kycReward.canClaim && (
                        <button
                          onClick={() => claimKycReward()}
                          disabled={isKycClaiming}
                          className="w-full mt-2 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                          style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                        >
                          {isKycClaiming ? 'Claiming...' : 'Claim 66 EMYA'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Complete KYC to earn 66 EMYA</p>
                  )}
                </div>

                {/* Liquidity Reward Card */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-maven-pro text-white mb-4">Liquidity Reward</h3>
                  {isLiquidityLoading ? (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                    </div>
                  ) : liquidityReward ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Eligible Purchases</span>
                        <span className="text-white font-maven-pro">${liquidityReward.eligiblePurchaseTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Reward (USD)</span>
                        <span className="text-white font-maven-pro">${liquidityReward.rewardAmountUSD.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Reward (EMYA)</span>
                        <span className="text-white font-maven-pro">{liquidityReward.rewardAmountEMYA.toLocaleString()} EMYA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Status</span>
                        <span className={`text-sm font-maven-pro ${
                          liquidityReward.status === 'COMPLETED' ? 'text-green-400' :
                          liquidityReward.status === 'APPROVED' ? 'text-green-400' :
                          liquidityReward.status === 'PENDING' ? 'text-yellow-400' :
                          liquidityReward.status === 'REJECTED' ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          {liquidityReward.status}
                        </span>
                      </div>
                      {liquidityReward.canClaim && address && (
                        <button
                          onClick={() => claimLiquidityReward(address)}
                          disabled={isLiquidityClaiming}
                          className="w-full mt-2 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                          style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                        >
                          {isLiquidityClaiming ? 'Submitting...' : 'Claim Reward'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No liquidity rewards available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Recent Investments</h2>
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="text-left py-4 px-6 text-gray-400 font-maven-pro text-sm">Project</th>
                        <th className="text-right py-4 px-6 text-gray-400 font-maven-pro text-sm">Invested</th>
                        <th className="text-right py-4 px-6 text-gray-400 font-maven-pro text-sm">Tokens</th>
                        <th className="text-right py-4 px-6 text-gray-400 font-maven-pro text-sm">Value</th>
                        <th className="text-right py-4 px-6 text-gray-400 font-maven-pro text-sm">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((inv) => {
                        const currentValue = inv.tokenAmount * inv.currentPrice;
                        const pnl = currentValue - inv.investmentAmount;
                        const pnlPercentage = (pnl / inv.investmentAmount) * 100;
                        return (
                          <tr key={inv.projectId} className="border-t border-gray-700">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <ImageWithFallback
                                  src={inv.projectLogo}
                                  alt={inv.projectName}
                                  className="w-10 h-10 rounded-full"
                                />
                                <div>
                                  <div className="text-white font-maven-pro">{inv.projectName}</div>
                                  <div className="text-xs text-gray-400">{inv.tokenSymbol}</div>
                                </div>
                              </div>
                            </td>
                            <td className="text-right py-4 px-6 text-white font-maven-pro">
                              ${inv.investmentAmount.toLocaleString()}
                            </td>
                            <td className="text-right py-4 px-6 text-gray-300 font-maven-pro">
                              {inv.tokenAmount.toLocaleString()}
                            </td>
                            <td className="text-right py-4 px-6 text-white font-maven-pro">
                              ${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                            <td className="text-right py-4 px-6">
                              <div className={`font-maven-pro ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {pnl >= 0 ? '+' : ''}${pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </div>
                              <div className={`text-xs ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {pnl >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">My Investments</h2>
            <div className="grid gap-6">
              {investments.map((inv) => {
                const currentValue = inv.tokenAmount * inv.currentPrice;
                const pnl = currentValue - inv.investmentAmount;
                const pnlPercentage = (pnl / inv.investmentAmount) * 100;
                const vestingPercentage = (inv.totalClaimed / inv.totalVested) * 100;

                return (
                  <div key={inv.projectId} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Project Info */}
                      <div className="flex items-start gap-4 md:w-1/3">
                        <ImageWithFallback
                          src={inv.projectLogo}
                          alt={inv.projectName}
                          className="w-16 h-16 rounded-lg"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{inv.projectName}</h3>
                          <div className="text-sm text-gray-400">{inv.tokenSymbol}</div>
                          <div className="mt-2 text-xs text-gray-400">
                            Entry Price: ${inv.entryPrice.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-400">
                            Current Price: ${inv.currentPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Investment Stats */}
                      <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Invested</div>
                          <div className="text-lg font-maven-pro text-white">
                            ${inv.investmentAmount.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Tokens</div>
                          <div className="text-lg font-maven-pro text-white">
                            {inv.tokenAmount.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Current Value</div>
                          <div className="text-lg font-maven-pro text-white">
                            ${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">P&L</div>
                          <div className={`text-lg font-maven-pro ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {pnl >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vesting Progress */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Vesting Progress</span>
                        <span className="text-sm font-maven-pro text-white">
                          {inv.totalClaimed.toLocaleString()} / {inv.totalVested.toLocaleString()} {inv.tokenSymbol} ({vestingPercentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${vestingPercentage}%`,
                            background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)',
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Next Vesting: {new Date(inv.nextVestingDate).toLocaleDateString()}</span>
                        <span>{inv.nextVestingAmount.toLocaleString()} {inv.tokenSymbol}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'roi' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">ROI Tracker</h2>
              <div className="text-right">
                <div className="text-sm text-gray-400">Average ROI</div>
                <div className={`text-3xl font-maven-pro ${averageROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {averageROI >= 0 ? '+' : ''}{averageROI.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* ROI Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {investments.map((inv) => {
                const currentValue = inv.tokenAmount * inv.currentPrice;
                const pnl = currentValue - inv.investmentAmount;
                const roi = ((inv.currentPrice - inv.entryPrice) / inv.entryPrice) * 100;
                const priceChange = inv.currentPrice - inv.entryPrice;

                return (
                  <div key={inv.projectId} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-start gap-4 mb-6">
                      <ImageWithFallback
                        src={inv.projectLogo}
                        alt={inv.projectName}
                        className="w-12 h-12 rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{inv.projectName}</h3>
                        <div className="text-sm text-gray-400">{inv.tokenSymbol}</div>
                      </div>
                      <div className={`text-2xl font-maven-pro flex items-center gap-1 ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {roi >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Entry Price</div>
                        <div className="text-lg font-maven-pro text-white">${inv.entryPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Current Price</div>
                        <div className="text-lg font-maven-pro text-white">${inv.currentPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Price Change</div>
                        <div className={`text-lg font-maven-pro ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Total P&L</div>
                        <div className={`text-lg font-maven-pro ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pnl >= 0 ? '+' : ''}${pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Investment Amount</span>
                        <span className="text-white font-maven-pro">${inv.investmentAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-400">Current Value</span>
                        <span className="text-white font-maven-pro">${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-400">Token Holdings</span>
                        <span className="text-white font-maven-pro">{inv.tokenAmount.toLocaleString()} {inv.tokenSymbol}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Summary */}
            <div className="bg-gray-800 p-6 rounded-lg border-2" style={{ borderColor: '#E3107A' }}>
              <h3 className="text-xl font-bold text-white mb-4">Total Portfolio Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Invested</div>
                  <div className="text-2xl font-maven-pro text-white">${totalInvested.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Current Value</div>
                  <div className="text-2xl font-maven-pro text-white">${totalCurrentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total P&L</div>
                  <div className={`text-2xl font-maven-pro ${totalROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalROI >= 0 ? '+' : ''}${(totalCurrentValue - totalInvested).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">ROI</div>
                  <div className={`text-2xl font-maven-pro flex items-center gap-2 ${totalROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalROI >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                    {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wallets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Wallets</h2>
              <button
                onClick={() => setShowAddWallet(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
              >
                <Plus className="w-4 h-4" />
                Add Wallet
              </button>
            </div>

            {/* Connected Wallet */}
            <div className="bg-gray-800 p-6 rounded-lg border-2" style={{ borderColor: '#E3107A' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm font-maven-pro mb-1" style={{ color: '#E3107A' }}>
                    Primary Wallet (Connected)
                  </div>
                  <div className="text-xs text-gray-400">This is your contribution wallet</div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-maven-pro border"
                     style={{ color: '#E3107A', borderColor: '#E3107A' }}>
                  {connectedChainName}
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg border border-gray-700">
                <code className="text-sm text-white font-mono">{connectedWallet}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(connectedWallet)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Additional Wallets */}
            {additionalWallets.length > 0 && (
              <div>
                <h3 className="text-lg font-maven-pro text-white mb-4">Additional Wallets</h3>
                <div className="space-y-4">
                  {additionalWallets.map((wallet) => (
                    <div key={wallet.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <div className="px-3 py-1 rounded-full text-xs font-maven-pro bg-gray-700 text-gray-300">
                          {wallet.chain}
                        </div>
                        <button
                          onClick={() => handleRemoveWallet(wallet.id)}
                          className="text-red-400 hover:text-red-300 text-xs transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <code className="text-sm text-white font-mono truncate mr-4">{wallet.address}</code>
                        <button
                          onClick={() => navigator.clipboard.writeText(wallet.address)}
                          className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Wallet Form */}
            {showAddWallet && (
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-maven-pro text-white mb-4">Add New Wallet</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Blockchain</label>
                    <select
                      value={newWalletChain}
                      onChange={(e) => setNewWalletChain(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    >
                      <option value="">Select Chain</option>
                      {supportedChains.map((chain) => (
                        <option key={chain} value={chain}>
                          {chain}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Wallet Address</label>
                    <input
                      type="text"
                      value={newWalletAddress}
                      onChange={(e) => setNewWalletAddress(e.target.value)}
                      placeholder="Enter wallet address"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddWallet}
                      disabled={!newWalletChain || !newWalletAddress}
                      className="flex-1 px-4 py-3 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                    >
                      Add Wallet
                    </button>
                    <button
                      onClick={() => {
                        setShowAddWallet(false);
                        setNewWalletChain('');
                        setNewWalletAddress('');
                      }}
                      className="px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Supported Chains Info */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-maven-pro text-white mb-4">Supported Blockchains</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {supportedChains.map((chain) => (
                  <div
                    key={chain}
                    className="px-3 py-2 bg-gray-900 rounded-lg text-center text-sm text-gray-300 border border-gray-700"
                  >
                    {chain}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kyc' && (
          <div className="space-y-6">
            {/* KYC Status Banner */}
            <div className={`p-6 rounded-lg border-2 ${
              kycStatus === 'approved' ? 'bg-green-900/20 border-green-500' :
              kycStatus === 'rejected' ? 'bg-red-900/20 border-red-500' :
              kycStatus === 'pending' ? 'bg-yellow-900/20 border-yellow-500' :
              'bg-gray-800 border-gray-700'
            }`}>
              <div className="flex items-center gap-4">
                {kycStatus === 'approved' && <CheckCircle className="w-12 h-12 text-green-400" />}
                {kycStatus === 'rejected' && <AlertCircle className="w-12 h-12 text-red-400" />}
                {kycStatus === 'pending' && <Clock className="w-12 h-12 text-yellow-400" />}
                {kycStatus === 'not_started' && <Shield className="w-12 h-12 text-gray-400" />}
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {kycStatus === 'approved' && 'KYC Approved'}
                    {kycStatus === 'rejected' && 'KYC Rejected'}
                    {kycStatus === 'pending' && 'KYC Under Review'}
                    {kycStatus === 'not_started' && 'Complete Your KYC'}
                  </h2>
                  <p className="text-gray-300">
                    {kycStatus === 'approved' && 'Your identity has been verified. You can now participate in all sales.'}
                    {kycStatus === 'rejected' && 'Your KYC application was rejected. Please contact support or resubmit with correct information.'}
                    {kycStatus === 'pending' && 'Your KYC documents are being reviewed. This typically takes 24-48 hours.'}
                    {kycStatus === 'not_started' && 'Complete your KYC verification to participate in token sales and unlock full platform features.'}
                  </p>
                </div>
              </div>
            </div>

            {/* KYC Reward Claim Section */}
            {kycReward && (
              <div className={`p-6 rounded-lg border-2 ${
                kycReward.rewardStatus === 'CLAIMED' ? 'bg-green-900/20 border-green-500' :
                kycReward.canClaim ? 'border-pink-500 bg-pink-900/10' :
                'bg-gray-800 border-gray-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-maven-pro text-white mb-1">KYC Verification Reward</h3>
                    <p className="text-sm text-gray-400">
                      {kycReward.rewardStatus === 'CLAIMED'
                        ? `Claimed ${kycReward.rewardAmount} EMYA`
                        : kycReward.rewardStatus === 'UNLOCKED'
                        ? `${kycReward.rewardAmount} EMYA ready to claim`
                        : kycReward.rewardStatus === 'EXPIRED'
                        ? 'Reward expired — claim window was 7 days'
                        : `Complete KYC to unlock ${kycReward.rewardAmount} EMYA`}
                    </p>
                    {kycReward.expiresAt && kycReward.rewardStatus === 'UNLOCKED' && (
                      <p className="text-xs text-yellow-400 mt-1">
                        Expires: {new Date(kycReward.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                    {kycReward.txHash && (
                      <p className="text-xs text-gray-500 mt-1">Tx: {kycReward.txHash}</p>
                    )}
                  </div>
                  {kycReward.canClaim && (
                    <button
                      onClick={() => claimKycReward()}
                      disabled={isKycClaiming}
                      className="px-6 py-3 rounded-lg text-white font-maven-pro hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
                      style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                    >
                      {isKycClaiming ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Claiming...
                        </span>
                      ) : (
                        `Claim ${kycReward.rewardAmount} EMYA`
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* User Profile Information */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Personal Information</h3>
                {!isEditingProfile && kycStatus !== 'pending' && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity text-sm"
                    style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                  >
                    {userName ? 'Edit Profile' : 'Add Information'}
                  </button>
                )}
              </div>

              {!isEditingProfile ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Full Name</label>
                      <div className="mt-1 text-white font-maven-pro">{userName || 'Not provided'}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email Address</label>
                      <div className="mt-1 text-white font-maven-pro">{email || 'Not provided'}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Date of Birth</label>
                      <div className="mt-1 text-white font-maven-pro">
                        {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Country of Residence</label>
                      <div className="mt-1 text-white font-maven-pro">{country || 'Not provided'}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Document Type</label>
                      <div className="mt-1 text-white font-maven-pro">
                        {documentType === 'passport' && 'Passport'}
                        {documentType === 'id_card' && 'National ID Card'}
                        {documentType === 'driver_license' && 'Driver License'}
                        {!documentType && 'Not selected'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  setIsEditingProfile(false);
                }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your full legal name"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Country of Residence *</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Enter your country"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Document Type *</label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select Document Type</option>
                      <option value="passport">Passport</option>
                      <option value="id_card">National ID Card</option>
                      <option value="driver_license">Driver License</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                      style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                    >
                      Save Information
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Connected Wallets Summary */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Connected Wallets</h3>
              <div className="space-y-3">
                {/* Primary Wallet */}
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div>
                    <div className="text-sm font-maven-pro mb-1" style={{ color: '#E3107A' }}>
                      Primary Wallet
                    </div>
                    <code className="text-xs text-gray-400 font-mono">{connectedWallet}</code>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-maven-pro bg-gray-700 text-gray-300">
                    {connectedChainName}
                  </div>
                </div>

                {/* Additional Wallets */}
                {additionalWallets.map((wallet) => (
                  <div key={wallet.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div>
                      <div className="text-sm text-gray-300 mb-1">
                        {wallet.chain} Wallet
                      </div>
                      <code className="text-xs text-gray-400 font-mono">{wallet.address}</code>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-maven-pro bg-gray-700 text-gray-300">
                      {wallet.chain}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KYC Integration Section */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-start gap-4 mb-6">
                <FileText className="w-6 h-6 flex-shrink-0" style={{ color: '#E3107A' }} />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">KYC Verification Process</h3>
                  <p className="text-gray-300 text-sm">
                    DigiMaaya SpringBoard uses a trusted 3rd party KYC partner to verify your identity securely and privately.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
                       style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}>
                    <span className="text-white font-maven-pro text-sm">1</span>
                  </div>
                  <div>
                    <div className="text-white font-maven-pro mb-1">Complete Profile Information</div>
                    <div className="text-sm text-gray-400">Provide your personal details and choose your identification document</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}>
                    <span className="text-white font-maven-pro text-sm">2</span>
                  </div>
                  <div>
                    <div className="text-white font-maven-pro mb-1">Start KYC Verification</div>
                    <div className="text-sm text-gray-400">Click the button below to begin verification with our trusted KYC partner</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}>
                    <span className="text-white font-maven-pro text-sm">3</span>
                  </div>
                  <div>
                    <div className="text-white font-maven-pro mb-1">Upload Documents</div>
                    <div className="text-sm text-gray-400">Securely upload your identification documents through the partner's platform</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}>
                    <span className="text-white font-maven-pro text-sm">4</span>
                  </div>
                  <div>
                    <div className="text-white font-maven-pro mb-1">Wait for Approval</div>
                    <div className="text-sm text-gray-400">Your documents will be reviewed within 24-48 hours</div>
                  </div>
                </div>
              </div>

              {kycStatus === 'not_started' && userName && email && dateOfBirth && country && documentType && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <button
                    onClick={() => {
                      // This would integrate with 3rd party KYC partner
                      setKycStatus('pending');
                      alert('In production, this would redirect to the 3rd party KYC partner (e.g., Onfido, Jumio, Sumsub, etc.)');
                    }}
                    className="w-full py-4 rounded-lg text-white font-maven-pro text-lg hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                  >
                    Start KYC Verification
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    By clicking this button, you will be redirected to our secure KYC partner's platform
                  </p>
                </div>
              )}

              {kycStatus === 'not_started' && (!userName || !email || !dateOfBirth || !country || !documentType) && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center gap-3 p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <p className="text-sm text-yellow-200">
                      Please complete your profile information above before starting KYC verification
                    </p>
                  </div>
                </div>
              )}

              {kycStatus === 'pending' && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center gap-3 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-200 font-maven-pro">Verification in Progress</p>
                      <p className="text-xs text-blue-300 mt-1">
                        Your documents are being reviewed. We'll notify you once the verification is complete.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {kycStatus === 'rejected' && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center gap-3 p-4 bg-red-900/20 rounded-lg border border-red-500/30 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-red-200 font-maven-pro">Verification Failed</p>
                      <p className="text-xs text-red-300 mt-1">
                        Please review your information and documents, then try again or contact support.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setKycStatus('not_started');
                      setIsEditingProfile(true);
                    }}
                    className="w-full py-3 rounded-lg text-white font-maven-pro hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                  >
                    Resubmit KYC
                  </button>
                </div>
              )}
            </div>

            {/* KYC Benefits */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Benefits of KYC Verification</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#E3107A' }} />
                  <div>
                    <div className="text-white font-maven-pro text-sm mb-1">Access to All Sales</div>
                    <div className="text-xs text-gray-400">Participate in exclusive token sales and IDOs</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#E3107A' }} />
                  <div>
                    <div className="text-white font-maven-pro text-sm mb-1">Higher Investment Limits</div>
                    <div className="text-xs text-gray-400">Unlock increased contribution caps</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#E3107A' }} />
                  <div>
                    <div className="text-white font-maven-pro text-sm mb-1">Compliance & Security</div>
                    <div className="text-xs text-gray-400">Meet regulatory requirements safely</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#E3107A' }} />
                  <div>
                    <div className="text-white font-maven-pro text-sm mb-1">Priority Access</div>
                    <div className="text-xs text-gray-400">Get early access to upcoming projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'voting' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Exchange Voting</h2>
              {voteStatus && (
                <div className="text-right">
                  <div className="text-sm text-gray-400">Votes Used</div>
                  <div className="text-xl font-maven-pro text-white">
                    {voteStatus.votesUsed} / {voteStatus.requiredVotes}
                  </div>
                </div>
              )}
            </div>

            {voteStatus?.hasCompletedVoting && (
              <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-green-200 font-maven-pro text-sm">Voting Complete</p>
                  <p className="text-green-300 text-xs mt-1">
                    Thank you for voting! You selected {voteStatus.votedOptions.map(v => v.exchangeName).join(' and ')}.
                  </p>
                </div>
              </div>
            )}

            {isVotingLoading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading voting options...
              </div>
            ) : votingData ? (
              <>
                <p className="text-gray-400 text-sm">
                  Vote for your <strong className="text-white">2 preferred exchanges</strong> for token listing.
                  {votingData.totalVotes > 0 && ` Total votes: ${votingData.totalVotes.toLocaleString()}`}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {votingData.options.map((option) => {
                    const isSelected = selectedVotes.includes(option.id) || option.isSelected;
                    const canSelect = !voteStatus?.hasCompletedVoting && selectedVotes.length < 2 && !selectedVotes.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          if (voteStatus?.hasCompletedVoting) return;
                          if (selectedVotes.includes(option.id)) {
                            setSelectedVotes(selectedVotes.filter(v => v !== option.id));
                          } else if (selectedVotes.length < 2) {
                            setSelectedVotes([...selectedVotes, option.id]);
                          }
                        }}
                        disabled={voteStatus?.hasCompletedVoting || (!canSelect && !selectedVotes.includes(option.id))}
                        className={`p-5 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-pink-500 bg-pink-900/20'
                            : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          {option.logoUrl ? (
                            <img src={option.logoUrl} alt={option.exchangeName} className="w-8 h-8 rounded-full" />
                          ) : (
                            <Vote className="w-8 h-8 text-gray-400" />
                          )}
                          <div className="flex-1">
                            <div className="text-white font-maven-pro">{option.exchangeName}</div>
                            {option.isConfirmed && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-700">
                                Confirmed
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5" style={{ color: '#E3107A' }} />
                          )}
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-sm text-gray-400">{option.voteCount.toLocaleString()} votes</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-maven-pro text-white">{option.percentage}%</div>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${parseFloat(option.percentage)}%`,
                              background: isSelected
                                ? 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)'
                                : '#6b7280',
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!voteStatus?.hasCompletedVoting && (
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        if (selectedVotes.length === 2) {
                          castVote(selectedVotes as [string, string]);
                        }
                      }}
                      disabled={selectedVotes.length !== 2 || isCasting}
                      className="w-full py-4 rounded-lg text-white font-maven-pro text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                    >
                      {isCasting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Submitting Votes...
                        </span>
                      ) : selectedVotes.length === 2 ? (
                        'Submit 2 Votes'
                      ) : (
                        `Select ${2 - selectedVotes.length} more exchange${selectedVotes.length === 1 ? '' : 's'}`
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-400 text-sm">No voting options available.</p>
            )}
          </div>
        )}

        {activeTab === '2fa' && (
          <div className="space-y-6">
            {/* 2FA Status Banner */}
            <div className={`p-6 rounded-lg border-2 ${
              is2FAEnabled ? 'bg-green-900/20 border-green-500' : 'bg-gray-800 border-gray-700'
            }`}>
              <div className="flex items-center gap-4">
                {is2FAEnabled ? (
                  <CheckCircle className="w-12 h-12 text-green-400" />
                ) : (
                  <Shield className="w-12 h-12 text-gray-400" />
                )}
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {is2FAEnabled ? '2FA Enabled' : 'Enable Two-Factor Authentication'}
                  </h2>
                  <p className="text-gray-300">
                    {is2FAEnabled 
                      ? 'Your account is protected with two-factor authentication via email.'
                      : 'Add an extra layer of security to your account with email-based 2FA.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Email Verification Section */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-start gap-4 mb-6">
                <FileText className="w-6 h-6 flex-shrink-0" style={{ color: '#E3107A' }} />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Email-Based 2FA</h3>
                  <p className="text-gray-300 text-sm">
                    When enabled, you'll receive a one-time code via email whenever you log in or perform sensitive actions.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Registered Email</label>
                  <div className="text-white font-maven-pro bg-gray-900 px-4 py-3 rounded-lg border border-gray-700">
                    {email || 'Please add your email in KYC section first'}
                  </div>
                </div>

                {!is2FAEnabled && !showOTPInput && (
                  <div className="pt-4">
                    <button
                      onClick={handleSendOTP}
                      disabled={!email || isVerifying}
                      className="w-full py-4 rounded-lg text-white font-maven-pro text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                    >
                      {isVerifying ? 'Sending...' : 'Enable 2FA'}
                    </button>
                    {!email && (
                      <p className="text-xs text-yellow-400 text-center mt-3">
                        Please complete your KYC profile with email address first
                      </p>
                    )}
                  </div>
                )}

                {showOTPInput && !is2FAEnabled && (
                  <div className="pt-4 space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-3 block">
                        Enter the 6-digit code sent to {verificationEmail}
                      </label>
                      <div className="flex gap-2 justify-center">
                        {otpCode.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            className="w-12 h-14 text-center text-2xl font-maven-pro bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleVerifyOTP}
                        disabled={isVerifying || otpCode.join('').length !== 6}
                        className="flex-1 py-3 rounded-lg text-white font-maven-pro hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                      >
                        {isVerifying ? 'Verifying...' : 'Verify & Enable'}
                      </button>
                      <button
                        onClick={() => {
                          setShowOTPInput(false);
                          setOtpCode(['', '', '', '', '', '']);
                        }}
                        className="px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    <button
                      onClick={handleSendOTP}
                      disabled={isVerifying}
                      className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Resend Code
                    </button>
                  </div>
                )}

                {is2FAEnabled && (
                  <div className="pt-4">
                    <div className="flex items-center gap-3 p-4 bg-green-900/20 rounded-lg border border-green-500/30 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-green-200 font-maven-pro">2FA is Active</p>
                        <p className="text-xs text-green-300 mt-1">
                          You'll receive verification codes at {email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDisable2FA}
                      className="w-full py-3 rounded-lg bg-red-600 text-white font-maven-pro hover:bg-red-700 transition-colors"
                    >
                      Disable 2FA
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2FA Benefits */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Why Enable 2FA?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#E3107A' }} />
                  <div>
                    <div className="text-white font-maven-pro text-sm mb-1">Extra Security Layer</div>
                    <div className="text-xs text-gray-400">Protect your account even if password is compromised</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#E3107A' }} />
                  <div>
                    <div className="text-white font-maven-pro text-sm mb-1">Instant Alerts</div>
                    <div className="text-xs text-gray-400">Get notified of any login attempts immediately</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#E3107A' }} />
                  <div>
                    <div className="text-white font-maven-pro text-sm mb-1">Prevent Unauthorized Access</div>
                    <div className="text-xs text-gray-400">Keep your investments and personal data safe</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#E3107A' }} />
                  <div>
                    <div className="text-white font-maven-pro text-sm mb-1">Industry Standard</div>
                    <div className="text-xs text-gray-400">Meet security best practices for crypto platforms</div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
                       style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}>
                    <span className="text-white font-maven-pro text-sm">1</span>
                  </div>
                  <div>
                    <div className="text-white font-maven-pro mb-1">Log in with your credentials</div>
                    <div className="text-sm text-gray-400">Enter your wallet or email/password as usual</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}>
                    <span className="text-white font-maven-pro text-sm">2</span>
                  </div>
                  <div>
                    <div className="text-white font-maven-pro mb-1">Receive verification code</div>
                    <div className="text-sm text-gray-400">A 6-digit code will be sent to your email</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}>
                    <span className="text-white font-maven-pro text-sm">3</span>
                  </div>
                  <div>
                    <div className="text-white font-maven-pro mb-1">Enter the code</div>
                    <div className="text-sm text-gray-400">Input the code to complete login</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}>
                    <span className="text-white font-maven-pro text-sm">4</span>
                  </div>
                  <div>
                    <div className="text-white font-maven-pro mb-1">Access granted</div>
                    <div className="text-sm text-gray-400">Successfully logged in with verified identity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}