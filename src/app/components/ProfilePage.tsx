import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ArrowLeft, Upload, Plus, ExternalLink, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Clock, FileText, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useAuth } from '@/app/hooks/useAuth';
import { usersApi, portfolioApi, walletsApi, vestingApi, type PortfolioItem, type WalletRecord, type VestingClaimableResponse } from '@/app/lib/api';

interface Wallet {
  id: string;
  chain: string;
  address: string;
  isPrimary: boolean;
}

interface Investment {
  projectId: string;
  projectName: string;
  projectLogo: string;
  saleId?: string;
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
  const [activeTab, setActiveTab] = useState<'overview' | 'investments' | 'roi' | 'wallets'>('overview');
  const [profileImage, setProfileImage] = useState<string>('');
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newWalletChain, setNewWalletChain] = useState('');
  const [newWalletAddress, setNewWalletAddress] = useState('');

  // Profile state (overwritten by GET /api/v1/users/profile)
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');

  // Profile API state
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Use real connected wallet address from wagmi
  const { address, chain } = useAccount();
  const connectedWallet = address ?? '0x0000000000000000000000000000000000000000';
  const connectedChainName = chain?.name ?? 'Ethereum';

  // API hooks
  const { user, isAuthenticated } = useAuth();
  const [additionalWallets, setAdditionalWallets] = useState<Wallet[]>([]);
  const [isWalletsLoading, setIsWalletsLoading] = useState(true);
  const [walletsError, setWalletsError] = useState<string | null>(null);
  const [isAddingWallet, setIsAddingWallet] = useState(false);

  // Portfolio data (GET /api/v1/portfolio, aggregated per project)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  // Vesting per sale (GET /api/v1/vesting/claimable/sale/:saleId)
  const [vestingBySaleId, setVestingBySaleId] = useState<Record<string, VestingClaimableResponse>>({});
  const [vestingLoading, setVestingLoading] = useState(false);

  const supportedChains = ['Ethereum', 'Solana', 'Aptos', 'Polygon', 'BNB Chain', 'Avalanche', 'Arbitrum', 'Optimism'];

  // Fetch wallets from GET /api/v1/wallets after any login
  useEffect(() => {
    if (!isAuthenticated) {
      setIsWalletsLoading(false);
      return;
    }

    setIsWalletsLoading(true);
    setWalletsError(null);

    walletsApi
      .getWallets()
      .then((records: WalletRecord[]) => {
        const mapped: Wallet[] = records.map((w) => ({
          id: w.id,
          chain: w.chain,
          address: w.address,
          isPrimary: w.is_primary,
        }));
        setAdditionalWallets(mapped);
      })
      .catch((err) => {
        setWalletsError(err?.message ?? 'Failed to load wallets');
        setAdditionalWallets([]);
      })
      .finally(() => setIsWalletsLoading(false));
  }, [isAuthenticated]);

  // Fetch portfolio from GET /api/v1/portfolio after any login (wallet or Google)
  useEffect(() => {
    if (!isAuthenticated) {
      setIsPortfolioLoading(false);
      return;
    }

    setIsPortfolioLoading(true);
    setPortfolioError(null);

    portfolioApi
      .getPortfolio()
      .then((items) => {
        setPortfolioItems(items);

        // Aggregate by project (or projectName if projectId is null)
        const byProject = new Map<string, Investment>();

        for (const item of items) {
          const key = item.projectId ?? item.projectName;
          const existing = byProject.get(key);

          const investmentAmount = item.contributedAmount;
          const tokenAmount = item.tokenAmount;

          if (!existing) {
            // For now, use tokenPrice as both entry and current price (no live price feed yet)
            const entryPrice = item.tokenPrice;
            const currentPrice = item.tokenPrice;

            byProject.set(key, {
              projectId: item.projectId ?? key,
              projectName: item.projectName,
              projectLogo: item.projectLogoUrl,
              saleId: item.saleId,
              investmentAmount,
              tokenAmount,
              tokenSymbol: item.tokenSymbol,
              currentPrice,
              entryPrice,
              totalVested: tokenAmount,
              totalClaimed: 0,
              nextVestingDate: '',
              nextVestingAmount: 0,
            });
          } else {
            const newInvestmentAmount = existing.investmentAmount + investmentAmount;
            const newTokenAmount = existing.tokenAmount + tokenAmount;

            // Weighted average entry/current price by token amount
            const weightedEntry =
              existing.entryPrice * existing.tokenAmount + item.tokenPrice * tokenAmount;
            const newEntryPrice =
              newTokenAmount > 0 ? weightedEntry / newTokenAmount : existing.entryPrice;

            byProject.set(key, {
              ...existing,
              investmentAmount: newInvestmentAmount,
              tokenAmount: newTokenAmount,
              entryPrice: newEntryPrice,
              currentPrice: newEntryPrice,
              totalVested: newTokenAmount,
            });
          }
        }

        setInvestments(Array.from(byProject.values()));
      })
      .catch((err) => {
        setPortfolioError(err?.message ?? 'Failed to load portfolio');
        setPortfolioItems([]);
        setInvestments([]);
      })
      .finally(() => setIsPortfolioLoading(false));
  }, [isAuthenticated]);

  // Fetch vesting per sale (GET /api/v1/vesting/claimable/sale/:saleId) for each unique saleId in portfolio
  useEffect(() => {
    if (!isAuthenticated || portfolioItems.length === 0) {
      setVestingBySaleId({});
      return;
    }
    const saleIds = [...new Set(portfolioItems.map((i) => i.saleId).filter(Boolean))] as string[];
    if (saleIds.length === 0) {
      setVestingBySaleId({});
      return;
    }
    setVestingLoading(true);
    Promise.all(saleIds.map((saleId) => vestingApi.getClaimableBySale(saleId)))
      .then((results) => {
        const next: Record<string, VestingClaimableResponse> = {};
        saleIds.forEach((id, idx) => {
          next[id] = results[idx];
        });
        setVestingBySaleId(next);
      })
      .catch(() => setVestingBySaleId({}))
      .finally(() => setVestingLoading(false));
  }, [isAuthenticated, portfolioItems]);

  // Fetch profile from GET /api/v1/users/profile when wallet is connected and user is authenticated
  useEffect(() => {
    if (!user?.token) {
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    setProfileError(null);
    usersApi
      .getProfile()
      .then((p) => {
        const displayName = p.name ?? p.userName ?? p.user_name ?? user?.UserName ?? user?.Email ?? '';
        const about = p.bio ?? p.details ?? '';
        const emailVal = p.email ?? user?.Email ?? '';
        const image = p.profileImage ?? p.profile_image ?? p.avatarUrl ?? p.avatar_url ?? '';
        setUserName(displayName);
        setEmail(emailVal);
        setProfileImage(image);
        setBio(about);
        setEditDisplayName(displayName);
        setEditBio(about);
        setDateOfBirth(p.dateOfBirth ?? p.date_of_birth ?? '');
        setCountry(p.country ?? '');
        setDocumentType(p.documentType ?? p.document_type ?? '');
      })
      .catch((err) => {
        setProfileError(err?.message ?? 'Failed to load profile');
        setUserName(user?.UserName ?? user?.Email ?? '');
        setEmail(user?.Email ?? '');
      })
      .finally(() => setProfileLoading(false));
  }, [isAuthenticated, user?._id]);

  // Calculate stats
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + (inv.tokenAmount * inv.currentPrice), 0);
  const totalROI =
    totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;
  const averageROI = investments.reduce((sum, inv) => {
    const roi = ((inv.currentPrice - inv.entryPrice) / inv.entryPrice) * 100;
    return sum + roi;
  }, 0) / investments.length;

  /** Treat wallet address or "0x...@wallet.local" as no display name so we show "My Portfolio". */
  const hasDisplayName =
    userName &&
    userName.length < 40 &&
    !userName.startsWith('0x') &&
    !userName.includes('@wallet');

  const shortWallet =
    connectedWallet.length > 14
      ? `${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)}`
      : connectedWallet;

  /** Merge vesting from GET /api/v1/vesting/claimable/sale/:saleId into investment display. */
  const getVestingForInv = (inv: Investment) => {
    const v = inv.saleId ? vestingBySaleId[inv.saleId] : null;
    return {
      totalVested: v?.total_allocation ?? inv.totalVested,
      totalClaimed: v?.total_claimed ?? inv.totalClaimed,
      nextVestingDate: v?.next_unlock_date ?? inv.nextVestingDate ?? '',
      nextVestingAmount: v?.claimable_now ?? inv.nextVestingAmount,
    };
  };

  const handleSaveProfile = async () => {
    if (!user?.token || isSavingProfile) return;
    const nameVal = editDisplayName?.trim().slice(0, 100) ?? '';
    const bioVal = editBio?.trim().slice(0, 500) ?? '';
    setIsSavingProfile(true);
    try {
      const updated = await usersApi.updateProfile({
        name: nameVal || undefined,
        userName: nameVal || undefined,
        user_name: nameVal || undefined,
        bio: bioVal || undefined,
        details: bioVal || undefined,
      });
      const displayName = updated.name ?? updated.userName ?? updated.user_name ?? nameVal;
      const about = updated.bio ?? updated.details ?? bioVal;
      setUserName(displayName);
      setBio(about);
      setEditDisplayName(displayName);
      setEditBio(about);
      setIsEditingProfile(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

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

  const handleAddWallet = async () => {
    if (!newWalletChain || !newWalletAddress || !isAuthenticated || isAddingWallet) return;

    try {
      setIsAddingWallet(true);
      const chainSlug = newWalletChain.toLowerCase();
      const isPrimary = additionalWallets.length === 0;

      const created = await walletsApi.addWallet({
        address: newWalletAddress,
        chain: chainSlug,
        ...(isPrimary && { is_primary: true }),
      });

      setAdditionalWallets((prev) => [
        ...prev,
        {
          id: created.id,
          chain: created.chain,
          address: created.address,
          isPrimary: created.is_primary,
        },
      ]);

      setNewWalletChain('');
      setNewWalletAddress('');
      setShowAddWallet(false);
    } catch (err: any) {
      alert(err?.message ?? 'Failed to add wallet');
    } finally {
      setIsAddingWallet(false);
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
              {profileLoading ? (
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#E3107A' }} />
                  <span>Loading profile...</span>
                </div>
              ) : profileError ? (
                <p className="text-amber-400 text-sm mb-4">{profileError}</p>
              ) : null}

              {isEditingProfile ? (
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1 font-maven-pro">Display name</label>
                    <input
                      type="text"
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      placeholder="Your name or nickname"
                      className="w-full max-w-md bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E3107A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1 font-maven-pro">About / details</label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="A short bio or description (optional)"
                      rows={3}
                      className="w-full max-w-md bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E3107A] resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="px-4 py-2 rounded-lg text-white text-sm font-maven-pro disabled:opacity-60"
                      style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditDisplayName(userName);
                        setEditBio(bio);
                      }}
                      disabled={isSavingProfile}
                      className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm font-maven-pro"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      {hasDisplayName ? `${userName}'s Portfolio` : 'My Portfolio'}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="text-sm text-gray-400 hover:text-[#E3107A] font-maven-pro underline"
                    >
                      Edit profile
                    </button>
                  </div>
                  {bio ? (
                    <p className="text-gray-400 text-sm mb-2 max-w-xl">{bio}</p>
                  ) : null}
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <span className="font-maven-pro text-sm">Connected Wallet:</span>
                    <code className="text-xs bg-gray-800 px-3 py-1 rounded border border-gray-700" title={connectedWallet}>
                      {shortWallet}
                    </code>
                  </div>
                </>
              )}

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
                    {totalInvested > 0 && (totalROI >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />)}
                    {totalInvested > 0 ? `${totalROI >= 0 ? '+' : ''}${totalROI.toFixed(2)}%` : '—'}
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
                    {isPortfolioLoading ? (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading portfolio...
                      </div>
                    ) : portfolioError ? (
                      <div className="text-amber-400 text-sm">{portfolioError}</div>
                    ) : investments.length === 0 ? (
                      <div className="text-gray-400 text-sm">
                        No investments yet. Your portfolio allocation will appear here after you invest.
                      </div>
                    ) : (
                      investments.map((inv) => {
                        const percentage = totalInvested > 0
                          ? (inv.investmentAmount / totalInvested) * 100
                          : 0;
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
                      })
                    )}
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-maven-pro text-white mb-4">Vesting Overview</h3>
                  <div className="space-y-4">
                    {(isPortfolioLoading || vestingLoading) ? (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading vesting data...
                      </div>
                    ) : investments.length === 0 ? (
                      <div className="text-gray-400 text-sm">
                        No vesting schedule yet. Once you have allocations, vesting progress will appear here.
                      </div>
                    ) : (
                      investments.map((inv) => {
                        const v = getVestingForInv(inv);
                        const vestingPercentage = v.totalVested > 0 ? (v.totalClaimed / v.totalVested) * 100 : 0;
                        const remaining = v.totalVested - v.totalClaimed;
                        return (
                          <div key={inv.projectId} className="pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="text-white font-maven-pro">{inv.projectName}</div>
                                <div className="text-xs text-gray-400">
                                  {v.totalClaimed.toLocaleString()} / {v.totalVested.toLocaleString()} {inv.tokenSymbol}
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
                              {v.nextVestingDate
                                ? `Next: ${remaining.toLocaleString()} ${inv.tokenSymbol} on ${new Date(
                                    v.nextVestingDate,
                                  ).toLocaleDateString()}`
                                : 'Next vesting date will appear here when available.'}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
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
                const v = getVestingForInv(inv);
                const vestingPercentage = v.totalVested > 0 ? (v.totalClaimed / v.totalVested) * 100 : 0;

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
                          {v.totalClaimed.toLocaleString()} / {v.totalVested.toLocaleString()} {inv.tokenSymbol} ({vestingPercentage.toFixed(0)}%)
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
                        <span>Next Vesting: {v.nextVestingDate ? new Date(v.nextVestingDate).toLocaleDateString() : '—'}</span>
                        <span>{v.nextVestingAmount.toLocaleString()} {inv.tokenSymbol}</span>
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
                {investments.length === 0 ? (
                  <div className="text-sm text-gray-400">No investments to calculate ROI yet.</div>
                ) : (
                  <div className={`text-3xl font-maven-pro ${averageROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {averageROI >= 0 ? '+' : ''}{averageROI.toFixed(2)}%
                  </div>
                )}
              </div>
            </div>

            {/* ROI Cards */}
            {isPortfolioLoading ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading portfolio...
              </div>
            ) : investments.length === 0 ? (
              <div className="text-gray-400 text-sm">
                No ROI data yet. Once you invest in a sale, ROI details will appear here.
              </div>
            ) : (
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
            )}

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
            <div>
              <h3 className="text-lg font-maven-pro text-white mb-4">Additional Wallets</h3>
              {isWalletsLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading wallets...
                </div>
              ) : walletsError ? (
                <div className="text-amber-400 text-sm">{walletsError}</div>
              ) : additionalWallets.length === 0 ? (
                <div className="text-gray-400 text-sm">
                  You have no additional wallets yet. Use &quot;Add Wallet&quot; to link another address.
                </div>
              ) : (
                <div className="space-y-4">
                  {additionalWallets.map((wallet) => (
                    <div key={wallet.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-full text-xs font-maven-pro bg-gray-700 text-gray-300">
                            {wallet.chain}
                          </div>
                          {wallet.isPrimary && (
                            <span className="text-xs text-green-400 font-maven-pro">Primary</span>
                          )}
                        </div>
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
              )}
            </div>

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
                      disabled={!newWalletChain || !newWalletAddress || isAddingWallet}
                      className="flex-1 px-4 py-3 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                    >
                      {isAddingWallet ? 'Adding...' : 'Add Wallet'}
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
      </div>
    </div>
  );
}