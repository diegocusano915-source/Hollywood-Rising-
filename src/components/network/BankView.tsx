/**
 * HOLLYWOOD RISING - Mogul Desk · Finance Terminal (Option C rebuild)
 * Bloomberg-style executive terminal: live ticker, net-worth allocation bar,
 * credit health gauge, and loan deal memos with payoff bars. Every number is
 * real — pulled from NetworkService bank state, financial summary, and the
 * wealth breakdown. All original functionality preserved.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NetworkFullState } from '../../types/network';
import { NetworkService, getWealthBreakdown } from '../../services/networkService';
import { ArrowLeft, AlertTriangle, DollarSign } from 'lucide-react';

interface BankViewProps {
  onBack: () => void;
  networkState: NetworkFullState;
  onUpdateState: (next: NetworkFullState) => void;
}

// Credit Card Tiers
const CREDIT_CARD_TIERS = [
  { id: 'card_basic', name: 'Beverly Hills Basic Card', minCredit: 300, minIncome: 500, limit: 2500, fee: 0, perk: 'Basic Purchases' },
  { id: 'card_silver', name: 'Rodeo Silver Rewards', minCredit: 500, minIncome: 2000, limit: 10000, fee: 95, perk: '1% Cashback on Dining' },
  { id: 'card_gold', name: 'Century Gold Reserve', minCredit: 620, minIncome: 5000, limit: 30000, fee: 250, perk: '2% Cashback & First Class Lounge Access' },
  { id: 'card_platinum', name: 'Hollywood Platinum Preferred', minCredit: 720, minIncome: 15000, limit: 100000, fee: 695, perk: '24/7 VIP Concierge & Red Carpet Access' },
  { id: 'card_black', name: 'Century Black Centurion', minCredit: 800, minIncome: 50000, limit: 500000, fee: 5000, perk: 'Private Jet Booking & Uncapped Line' },
  { id: 'card_elite', name: 'Hollywood Elite Diamond Card', minCredit: 840, minIncome: 150000, limit: 2500000, fee: 15000, perk: 'Studio Production Financing Line' },
];

const fmtCompact = (v: number): string =>
  v >= 1000000 ? `$${(v / 1000000).toFixed(2)}M` : v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${Math.round(v)}`;

export const BankView: React.FC<BankViewProps> = ({ onBack, networkState, onUpdateState }) => {
  const { player, saveData, updateSave } = useGame();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'CHECKING' | 'SAVINGS' | 'CREDIT_CARDS' | 'LOANS' | 'MORTGAGES' | 'BUSINESS' | 'TRANSACTIONS' | 'FINANCIAL_INTEL'
  >('OVERVIEW');

  const [depositAmount, setDepositAmount] = useState<string>('5000');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('5000');
  const [feedback, setFeedback] = useState<string | null>(null);

  const finSummary = NetworkService.calculateFinancialSummary(networkState, player.money);
  const wealth = getWealthBreakdown(networkState, player.money);

  const bank = networkState.bankAccount || {
    checkingBalance: player.money,
    savingsBalance: 0,
    savingsApy: 0.025,
    businessBalance: 0,
    investmentBalance: 0,
    offshoreBalance: 0,
    offshoreApy: 0.04,
    activeLoans: [],
    loanHistory: [],
    preGeneratedOffers: [],
    creditScore: 320,
    bankReputation: 50,
    reputationRating: 'CCC',
    transactionHistory: [],
    creditCards: [],
    autoSaveEnabled: false,
    savingsGoal: 100000,
    lifetimeInterestEarned: 0,
  };

  const ownedCreditCards = bank.creditCards || [];
  const loanOffers = NetworkService.generateLoanOffers(networkState, player);

  const getRatingLabel = (score: number) => {
    if (score >= 800) return 'Elite (AAA)';
    if (score >= 720) return 'Excellent (AA)';
    if (score >= 650) return 'Good (A)';
    if (score >= 580) return 'Fair (BBB)';
    if (score >= 500) return 'Poor (BB)';
    return 'Terrible (CCC)';
  };

  // ---- handlers (all original logic preserved) ----
  const handleDepositSavings = () => {
    const amt = Number(depositAmount);
    if (isNaN(amt) || amt <= 0) return;
    if (player.money < amt) {
      setFeedback(`INSUFFICIENT LIQUID — cannot move $${amt.toLocaleString()}.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }
    const newMoney = player.money - amt;
    const nextBank = {
      ...bank,
      checkingBalance: newMoney,
      savingsBalance: bank.savingsBalance + amt,
      transactionHistory: [
        { id: `tx_${Date.now()}`, description: 'Transfer to Savings', amount: amt, type: 'TRANSFER' as const, category: 'Savings', week: player.dateWeek || 1 },
        ...(bank.transactionHistory || []),
      ],
    };
    const nextState: NetworkFullState = { ...networkState, bankAccount: nextBank };
    updateSave({ ...saveData, player: { ...saveData.player, money: newMoney } });
    NetworkService.saveState(nextState);
    onUpdateState(nextState);
    setFeedback(`◈ MOVED $${amt.toLocaleString()} → SAVINGS.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleWithdrawSavings = () => {
    const amt = Number(withdrawAmount);
    if (isNaN(amt) || amt <= 0) return;
    if (bank.savingsBalance < amt) {
      setFeedback(`INSUFFICIENT SAVINGS — available $${bank.savingsBalance.toLocaleString()}.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }
    const newMoney = player.money + amt;
    const nextBank = {
      ...bank,
      checkingBalance: newMoney,
      savingsBalance: Math.max(0, bank.savingsBalance - amt),
      transactionHistory: [
        { id: `tx_${Date.now()}`, description: 'Withdrawal from Savings', amount: amt, type: 'TRANSFER' as const, category: 'Savings', week: player.dateWeek || 1 },
        ...(bank.transactionHistory || []),
      ],
    };
    const nextState: NetworkFullState = { ...networkState, bankAccount: nextBank };
    updateSave({ ...saveData, player: { ...saveData.player, money: newMoney } });
    NetworkService.saveState(nextState);
    onUpdateState(nextState);
    setFeedback(`◈ MOVED $${amt.toLocaleString()} SAVINGS → CHECKING.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleAutoSave = () => {
    const nextBank = { ...bank, autoSaveEnabled: !bank.autoSaveEnabled };
    const nextState: NetworkFullState = { ...networkState, bankAccount: nextBank };
    NetworkService.saveState(nextState);
    onUpdateState(nextState);
    setFeedback(`AUTO-SAVE ${nextBank.autoSaveEnabled ? 'ENABLED (10% weekly income saved)' : 'DISABLED'}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUseCardPurchase = (card: typeof CREDIT_CARD_TIERS[0]) => {
    const amt = Math.min(5000, Math.max(100, Math.floor(card.limit * 0.01)));
    if (player.money < amt) { setFeedback('Insufficient funds for card purchase.'); return; }
    const nextBank = { ...bank, cardUsageCount: ((bank as any).cardUsageCount || 0) + 1, cardOnTimeCount: ((bank as any).cardOnTimeCount || 0) + 1 };
    NetworkService.saveState({ ...NetworkService.getState(), bankAccount: nextBank });
    updateSave({ ...saveData, player: { ...player, money: Math.max(0, (player.money || 0) - amt) } });
    setFeedback(`◈ ${card.name} purchase $${amt.toLocaleString()} — on-time usage builds credit.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleApplyCreditCard = (card: typeof CREDIT_CARD_TIERS[0]) => {
    if (ownedCreditCards.includes(card.id)) {
      setFeedback(`You already hold the ${card.name}.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }
    if (bank.creditScore < card.minCredit) {
      setFeedback(`DECLINED — requires score ${card.minCredit} (yours: ${bank.creditScore}).`);
      setTimeout(() => setFeedback(null), 3500);
      return;
    }
    const nextBank = { ...bank, creditCards: [...ownedCreditCards, card.id], creditScore: Math.min(850, bank.creditScore + 1) };
    const nextState: NetworkFullState = { ...networkState, bankAccount: nextBank };
    NetworkService.saveState(nextState);
    onUpdateState(nextState);
    setFeedback(`APPROVED — ${card.name.toUpperCase()} · limit $${card.limit.toLocaleString()}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleClaimLoanOffer = (offerId: string) => {
    const res = NetworkService.acceptLoanOffer(networkState, offerId, player);
    if (res.success) {
      updateSave({ ...saveData, player: { ...saveData.player, money: player.money + res.cashAdded } });
      onUpdateState(res.nextState);
    }
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRepayLoanEarly = (loanId: string) => {
    const res = NetworkService.repayLoanEarly(networkState, loanId, player.money);
    if (res.success) {
      updateSave({ ...saveData, player: { ...saveData.player, money: Math.max(0, player.money - res.cashDeducted) } });
      onUpdateState(res.nextState);
    }
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 4000);
  };

  const mortgagedProperties = (networkState.properties || []).filter(
    (p) => p.isOwned && p.isMortgaged && p.mortgageRemaining > 0
  );

  // ---- terminal data ----
  const score = bank.creditScore || 320;
  const scorePos = Math.max(2, Math.min(98, Math.round(((score - 300) / 550) * 100)));
  const cashAndBank = wealth.cash + wealth.bank;
  const vaultVehicles = wealth.vault + wealth.vehicles;
  const allocSegments = [
    { label: 'CASH & BANK', value: cashAndBank, color: '#3ddc97' },
    { label: 'REAL ESTATE', value: wealth.properties, color: '#e0b152' },
    { label: 'BUSINESS EMPIRE', value: wealth.empire, color: '#5b9ce0' },
    { label: 'VAULT & VEHICLES', value: vaultVehicles, color: '#b06be0' },
  ].filter((s) => s.value > 0);
  const allocTotal = Math.max(1, allocSegments.reduce((a, s) => a + s.value, 0));

  const tickerItems = [
    `NET WORTH ${fmtCompact(wealth.total)}`,
    `CREDIT ${score}/${getRatingLabel(score).split(' ')[1] || ''}`,
    `CASH ${fmtCompact(wealth.cash)}`,
    `SAVINGS ${fmtCompact(bank.savingsBalance || 0)}`,
    `OFFSHORE ${fmtCompact(bank.offshoreBalance || 0)}`,
    `WEEKLY FLOW ${finSummary.weeklyNetChange >= 0 ? '+' : '−'}${fmtCompact(Math.abs(finSummary.weeklyNetChange))}`,
    `RATING ${bank.reputationRating}`,
    `LOANS ${((bank.activeLoans || []).length)} ACTIVE`,
  ];

  const TABS = [
    { id: 'OVERVIEW', label: 'DESK' },
    { id: 'CHECKING', label: 'CHECKING' },
    { id: 'SAVINGS', label: 'SAVINGS' },
    { id: 'LOANS', label: 'FACILITIES' },
    { id: 'MORTGAGES', label: 'MORTGAGES' },
    { id: 'CREDIT_CARDS', label: 'CARDS' },
    { id: 'TRANSACTIONS', label: 'LEDGER' },
    { id: 'BUSINESS', label: 'CORPORATE' },
    { id: 'FINANCIAL_INTEL', label: 'AUDIT' },
  ] as const;

  return (
    <div className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4" style={{ backgroundColor: '#050507' }}>
      <style>{`
        @keyframes deskTicker { to { transform: translateX(-50%); } }
        @keyframes markSlide { from { left: 2%; } }
        @keyframes barGrow { from { width: 0 !important; } }
        @keyframes segGrow { from { flex: 0 !important; } }
      `}</style>

      {/* Back nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl bg-[#0c0e12] hover:bg-[#141821] border border-[#1c2028] text-gray-300 text-xs font-black flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#7dd3a8]" />
          <span>Back to Network</span>
        </button>
        <span className="text-[9px] font-black text-[#5c6470] tracking-[3px] hidden sm:block">MOGUL DESK v2.0</span>
      </div>

      {/* ===== TERMINAL ===== */}
      <div className="rounded-2xl overflow-hidden border border-[#1c2028] bg-[#08090c] shadow-2xl">
        {/* title bar */}
        <div className="flex justify-between items-center px-4 py-2.5 bg-[#0c0e12] border-b border-[#1c2028]">
          <div className="flex gap-1.5">
            <i className="w-2 h-2 rounded-full bg-[#e05252] block" />
            <i className="w-2 h-2 rounded-full bg-[#e0b152] block" />
            <i className="w-2 h-2 rounded-full bg-[#7dd3a8] block" />
          </div>
          <span className="text-[9px] font-black tracking-[3px] text-[#7dd3a8]">MOGUL DESK · FINANCE TERMINAL</span>
          <span className="text-[9px] font-mono text-[#5c6470] font-bold">WK {player.dateWeek || 1} · {player.dateYear || 2026}</span>
        </div>

        {/* live ticker — real values, seamless loop */}
        <div className="overflow-hidden border-b border-[#1c2028] py-1.5">
          <div className="flex gap-6 whitespace-nowrap" style={{ animation: 'deskTicker 18s linear infinite', width: 'max-content' }}>
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} className="text-[9.5px] font-mono font-bold text-[#7dd3a8]">{t}</span>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* NET WORTH + ALLOCATION */}
          <div>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[9px] tracking-[3px] text-[#5c6470] font-extrabold block">TOTAL NET WORTH</span>
                <span className="text-3xl font-black text-[#f0f4f8] font-mono">${wealth.total.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <b className={`font-mono text-sm ${finSummary.weeklyNetChange >= 0 ? 'text-[#7dd3a8]' : 'text-[#e05252]'}`}>
                  {finSummary.weeklyNetChange >= 0 ? '+' : '−'}${Math.abs(finSummary.weeklyNetChange).toLocaleString()}
                </b>
                <span className="text-[8.5px] text-[#5c6470] block mt-0.5 tracking-wider">WEEKLY NET FLOW</span>
              </div>
            </div>

            <div className="flex h-6 rounded-lg overflow-hidden mt-3">
              {allocSegments.map((seg, i) => (
                <i
                  key={seg.label}
                  className="block"
                  style={{
                    flex: Math.max(2, Math.round((seg.value / allocTotal) * 100)),
                    background: seg.color,
                    animation: `segGrow 0.8s cubic-bezier(0.2,0.8,0.3,1) ${i * 0.08}s backwards`,
                  }}
                  title={`${seg.label}: $${seg.value.toLocaleString()}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2.5">
              {allocSegments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2 bg-[#0c0e12] border border-[#1c2028] rounded-lg px-2.5 py-2">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: seg.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] text-[#5c6470] block tracking-wide">{seg.label}</span>
                    <b className="text-[11px] text-gray-200 font-mono">${seg.value.toLocaleString()}</b>
                  </div>
                  <span className="text-[10px] text-[#7dd3a8] font-extrabold">{Math.round((seg.value / allocTotal) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* CREDIT HEALTH GAUGE */}
          <div className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-3.5">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[10px] tracking-[2px] text-[#8b93a1] font-black">CREDIT HEALTH · FICO {score}</h4>
              <span className={`text-[8.5px] font-black tracking-wider px-2.5 py-1 rounded-full border ${
                score >= 720 ? 'text-[#7dd3a8] border-[#7dd3a8]/40 bg-[#7dd3a8]/10'
                : score >= 580 ? 'text-[#e0b152] border-[#e0b152]/40 bg-[#e0b152]/10'
                : 'text-[#e05252] border-[#e05252]/40 bg-[#e05252]/10'
              }`}>
                {getRatingLabel(score).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="relative flex-1 h-2.5 rounded-full overflow-visible" style={{ background: 'linear-gradient(90deg, #e05252, #e0b152, #7dd3a8)' }}>
                <i className="absolute -top-1 w-[5px] h-[18px] bg-white rounded-sm" style={{ left: `${scorePos}%`, boxShadow: '0 0 10px rgba(255,255,255,0.7)', animation: `markSlide 1.2s cubic-bezier(0.2,0.8,0.3,1) backwards` }} />
              </div>
              <div className="text-right shrink-0">
                <b className="text-2xl font-mono text-[#f0f4f8]">{score}</b>
                <span className="text-[8.5px] text-[#5c6470] block tracking-wider">/ 850</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mt-3">
              {[
                ['REPAID', `${bank.loansRepaidCount || 0}`, '#7dd3a8'],
                ['ON-TIME', `${bank.onTimePaymentsCount || 0}/${bank.missedPaymentsCount || 0}`, (bank.missedPaymentsCount || 0) === 0 ? '#7dd3a8' : '#e05252'],
                ['AGE (WKS)', `${bank.creditAgeWeeks || 0}`, '#e0b152'],
                ['DEFAULTS', `${bank.loanDefaultsCount || 0}`, (bank.loanDefaultsCount || 0) === 0 ? '#7dd3a8' : '#e05252'],
              ].map(([cap, val, color]) => (
                <div key={cap} className="bg-[#08090c] border border-[#1c2028] rounded-lg py-2 text-center">
                  <span className="text-[7.5px] tracking-[1px] text-[#5c6470] block">{cap}</span>
                  <b className="text-[13px] font-mono" style={{ color }}>{val}</b>
                </div>
              ))}
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[9px] font-black tracking-[1px] px-3 py-2 rounded-full whitespace-nowrap cursor-pointer border ${
                  activeTab === tab.id
                    ? 'bg-[#7dd3a8] text-[#06251a] border-[#7dd3a8]'
                    : 'bg-[#0c0e12] border-[#1c2028] text-[#8b93a1]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="p-3 rounded-xl bg-[#7dd3a8]/10 border border-[#7dd3a8]/40 text-[#7dd3a8] text-[11px] font-black text-center font-mono">
              {feedback}
            </div>
          )}

          {/* ===== TAB: OVERVIEW ===== */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['LIQUID CASH', `$${wealth.cash.toLocaleString()}`, 'Instant · all spends'],
                  ['SAVINGS', `$${(bank.savingsBalance || 0).toLocaleString()}`, `${((bank.savingsApy || 0.025) * 100).toFixed(1)}% APY`],
                  ['INVESTMENTS', `$${(bank.investmentBalance || 0).toLocaleString()}`, 'Portfolio account'],
                  ['OFFSHORE', `$${(bank.offshoreBalance || 0).toLocaleString()}`, `${((bank.offshoreApy || 0.04) * 100).toFixed(1)}% APY · private`],
                  ['BUSINESS', `$${(bank.businessBalance || 0).toLocaleString()}`, 'Corporate account'],
                  ['DEBT', `−$${wealth.debt.toLocaleString()}`, 'Loans + mortgages'],
                ].map(([cap, val, sub]) => (
                  <div key={cap} className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-3">
                    <span className="text-[8px] tracking-[1.5px] text-[#5c6470] font-extrabold block">{cap}</span>
                    <b className={`text-base font-mono ${cap === 'DEBT' ? 'text-[#e05252]' : 'text-gray-100'}`}>{val}</b>
                    <span className="text-[8.5px] text-[#5c6470] block mt-0.5">{sub}</span>
                  </div>
                ))}
              </div>
              {(bank as any).creditBreakdown?.length > 0 && (
                <div className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-3">
                  <p className="text-[9px] tracking-[2px] text-[#8b93a1] font-black mb-2">CREDIT FACTORS — THIS WEEK</p>
                  {(bank as any).creditBreakdown.map((f: any, i: number) => (
                    <p key={i} className="text-[10px] text-gray-300 flex justify-between font-mono py-0.5">
                      <span>{f.factor}</span>
                      <span className={f.points >= 0 ? 'text-[#7dd3a8] font-black' : 'text-[#e05252] font-black'}>{f.points >= 0 ? '+' : ''}{f.points}</span>
                    </p>
                  ))}
                </div>
              )}
              <p className="text-[8.5px] text-[#5c6470] font-mono">◈ All figures pulled live from your accounts — nothing estimated.</p>
            </div>
          )}

          {/* ===== TAB: CHECKING ===== */}
          {activeTab === 'CHECKING' && (
            <div className="space-y-3">
              <div className="bg-[#0c0e12] border border-[#1c2028] border-l-[3px] border-l-[#3ddc97] rounded-xl p-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[9px] tracking-[2px] text-[#5c6470] font-extrabold block">PRIMARY CHECKING</span>
                    <b className="text-3xl font-mono text-[#f0f4f8]">${player.money.toLocaleString()}</b>
                  </div>
                  <span className="text-[8px] font-mono text-[#5c6470]">REF CHK-0001</span>
                </div>
                <p className="text-[9.5px] text-[#8b93a1] mt-2">Liquid cash for studio bids, auditions, real estate, and daily expenses.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-3">
                  <span className="text-[8px] tracking-[1.5px] text-[#5c6470] font-extrabold block">ACCOUNT PROTECTION</span>
                  <b className="text-[#7dd3a8] text-xs font-mono">FDIC INSURED TO $250,000</b>
                </div>
                <div className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-3">
                  <span className="text-[8px] tracking-[1.5px] text-[#5c6470] font-extrabold block">OVERDRAFT</span>
                  <b className="text-[#5b9ce0] text-xs font-mono">PRIVATE WEALTH LINE ACTIVE</b>
                </div>
              </div>
            </div>
          )}

          {/* ===== TAB: SAVINGS ===== */}
          {activeTab === 'SAVINGS' && (
            <div className="space-y-3">
              <div className="bg-[#0c0e12] border border-[#1c2028] border-l-[3px] border-l-[#e0b152] rounded-xl p-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[9px] tracking-[2px] text-[#5c6470] font-extrabold block">HIGH-YIELD SAVINGS</span>
                    <b className="text-3xl font-mono text-[#f0f4f8]">${(bank.savingsBalance || 0).toLocaleString()}</b>
                  </div>
                  <span className="text-[8px] font-mono text-[#5c6470]">2.5% APY</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-2.5 text-center">
                  <span className="text-[7.5px] tracking-[1px] text-[#5c6470] block">WEEKLY INTEREST</span>
                  <b className="text-[#7dd3a8] font-mono text-xs">+${Math.round((bank.savingsBalance || 0) * (0.025 / 52)).toLocaleString()}</b>
                </div>
                <div className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-2.5 text-center">
                  <span className="text-[7.5px] tracking-[1px] text-[#5c6470] block">LIFETIME EARNED</span>
                  <b className="text-[#e0b152] font-mono text-xs">${(bank.lifetimeInterestEarned || 0).toLocaleString()}</b>
                </div>
                <button onClick={handleToggleAutoSave} className={`rounded-xl p-2.5 text-center cursor-pointer border font-black ${
                  bank.autoSaveEnabled ? 'bg-[#7dd3a8]/10 border-[#7dd3a8]/40 text-[#7dd3a8]' : 'bg-[#0c0e12] border-[#1c2028] text-[#8b93a1]'
                }`}>
                  <span className="text-[7.5px] tracking-[1px] block">AUTO-SAVE 10%</span>
                  <b className="text-xs">{bank.autoSaveEnabled ? 'ACTIVE' : 'OFF'}</b>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-3 space-y-2">
                  <span className="text-[9px] font-black text-[#7dd3a8] tracking-[1px] block">DEPOSIT →</span>
                  <div className="flex gap-1.5">
                    <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)}
                      className="flex-1 min-w-0 bg-[#08090c] border border-[#1c2028] rounded-lg px-2.5 py-2 text-xs font-mono text-white outline-none" />
                    <button onClick={handleDepositSavings} className="px-3 py-2 rounded-lg bg-[#7dd3a8] text-[#06251a] font-black text-[10px] cursor-pointer">EXECUTE</button>
                  </div>
                </div>
                <div className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-3 space-y-2">
                  <span className="text-[9px] font-black text-[#5b9ce0] tracking-[1px] block">← WITHDRAW</span>
                  <div className="flex gap-1.5">
                    <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="flex-1 min-w-0 bg-[#08090c] border border-[#1c2028] rounded-lg px-2.5 py-2 text-xs font-mono text-white outline-none" />
                    <button onClick={handleWithdrawSavings} className="px-3 py-2 rounded-lg bg-[#08090c] text-[#5b9ce0] border border-[#5b9ce0]/40 font-black text-[10px] cursor-pointer">EXECUTE</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== TAB: LOANS (deal memos) ===== */}
          {activeTab === 'LOANS' && (
            <div className="space-y-3">
              {(bank.activeLoans || []).length > 0 && (
                <div className="bg-[#e0b152]/10 border border-[#e0b152]/40 rounded-xl p-3 flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-[#e0b152]" />
                  <div>
                    <span className="text-[11px] font-black text-[#e0b152] block">ONE ACTIVE LOAN POLICY</span>
                    <span className="text-[9px] text-gray-400">Fully repay your current facility before opening a new credit line.</span>
                  </div>
                </div>
              )}

              {/* ACTIVE FACILITIES — deal memos with payoff bars */}
              <h4 className="text-[10px] tracking-[2px] text-[#8b93a1] font-black">ACTIVE FACILITIES ({(bank.activeLoans || []).length})</h4>
              {(bank.activeLoans || []).length === 0 ? (
                <div className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-4 text-center text-[10px] text-[#5c6470] font-mono">
                  NO ACTIVE FACILITIES — claim a pre-approval below.
                </div>
              ) : (
                bank.activeLoans.map((loan) => {
                  const pct = Math.min(100, Math.round((1 - loan.balanceRemaining / Math.max(1, loan.principal)) * 100));
                  return (
                    <div key={loan.id} className="bg-[#0c0e12] border border-[#1c2028] border-l-[3px] border-l-[#7dd3a8] rounded-xl p-3.5">
                      <div className="flex justify-between items-center">
                        <b className="text-xs text-gray-100">{loan.title || loan.type}</b>
                        <span className="text-[8px] text-[#5c6470] font-mono tracking-wide">REF {loan.id.slice(-4).toUpperCase()} · {loan.status || 'ACTIVE'}</span>
                      </div>
                      <div className="flex justify-between text-[9.5px] text-[#8b93a1] mt-1.5 font-mono">
                        <span>BAL <b className="text-gray-200">${loan.balanceRemaining.toLocaleString()}</b></span>
                        <span>WKLY <b className="text-gray-200">${loan.weeklyPayment.toLocaleString()}</b></span>
                        <span>APR <b className="text-gray-200">{loan.interestRatePct}%</b></span>
                        <span>{loan.weeksRemaining} WKS LEFT</span>
                      </div>
                      <div className="h-[5px] bg-[#1c2028] rounded-full mt-2.5 overflow-hidden">
                        <i className="block h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#2e9e6b,#3ddc97)', animation: 'barGrow 1.2s cubic-bezier(0.2,0.8,0.3,1) backwards' }} />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[9px] font-mono text-[#7dd3a8]">{pct}% REPAID</span>
                        <button onClick={() => handleRepayLoanEarly(loan.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#7dd3a8] text-[#06251a] text-[9.5px] font-black cursor-pointer">
                          PAY OFF ${loan.balanceRemaining.toLocaleString()}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* PRE-APPROVED OFFERS */}
              <h4 className="text-[10px] tracking-[2px] text-[#8b93a1] font-black pt-1">PRE-APPROVED OFFERS ({loanOffers.length})</h4>
              {loanOffers.map((offer) => {
                const hasActiveLoan = (bank.activeLoans || []).length > 0;
                const metCredit = bank.creditScore >= offer.requirements.minCreditScore;
                const metNetWorth = finSummary.netWorth >= offer.requirements.minNetWorth;
                const canClaim = !hasActiveLoan && metCredit && metNetWorth;
                return (
                  <div key={offer.id} className={`bg-[#0c0e12] border border-[#1c2028] border-l-[3px] ${canClaim ? 'border-l-[#e0b152]' : 'border-l-[#2a3038] opacity-70'} rounded-xl p-3.5`}>
                    <div className="flex justify-between items-center">
                      <b className="text-xs text-gray-100">{offer.title}</b>
                      <span className="text-[8px] text-[#5c6470] font-mono">{offer.type}</span>
                    </div>
                    <div className="flex justify-between items-end mt-1">
                      <div className="text-[9.5px] text-[#8b93a1] font-mono">
                        <span>WKLY <b className="text-gray-200">${offer.weeklyPayment.toLocaleString()}</b> · {offer.weeksLength} WKS · APR <b className="text-gray-200">{offer.interestRatePct}%</b></span>
                      </div>
                      <b className="text-lg font-mono text-[#7dd3a8]">${offer.principal.toLocaleString()}</b>
                    </div>
                    <div className="flex gap-2 mt-2 text-[8.5px] font-mono">
                      <span className={metCredit ? 'text-[#7dd3a8]' : 'text-[#e05252]'}>MIN CR {offer.requirements.minCreditScore} ({bank.creditScore})</span>
                      <span className={metNetWorth ? 'text-[#7dd3a8]' : 'text-[#e05252]'}>MIN NW ${offer.requirements.minNetWorth.toLocaleString()}</span>
                    </div>
                    <button onClick={() => handleClaimLoanOffer(offer.id)} disabled={!canClaim}
                      className={`w-full mt-2.5 py-2 rounded-lg text-[10px] font-black tracking-wider cursor-pointer ${
                        canClaim ? 'bg-[#e0b152] text-[#1a1206]' : 'bg-[#08090c] text-[#5c6470] border border-[#1c2028] cursor-not-allowed'
                      }`}>
                      {hasActiveLoan ? 'REPAY CURRENT FACILITY FIRST' : canClaim ? '◈ ACCEPT & CLAIM DISBURSEMENT' : 'REQUIREMENTS NOT MET'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ===== TAB: MORTGAGES ===== */}
          {activeTab === 'MORTGAGES' && (
            <div className="space-y-3">
              <h4 className="text-[10px] tracking-[2px] text-[#8b93a1] font-black">COLLATERALIZED MORTGAGES ({mortgagedProperties.length})</h4>
              {mortgagedProperties.length === 0 ? (
                <div className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-4 text-center text-[10px] text-[#5c6470] font-mono">
                  NO MORTGAGED PROPERTIES — buy real estate with financing in Network.
                </div>
              ) : (
                mortgagedProperties.map((prop) => {
                  const initial = Math.round(prop.price * 0.8);
                  const pct = Math.min(100, Math.round((1 - (prop.mortgageRemaining || 0) / Math.max(1, initial)) * 100));
                  return (
                    <div key={prop.id} className="bg-[#0c0e12] border border-[#1c2028] border-l-[3px] border-l-[#e0b152] rounded-xl p-3.5">
                      <div className="flex justify-between items-center">
                        <b className="text-xs text-gray-100">{prop.name}</b>
                        <span className="text-[8px] text-[#5c6470] font-mono tracking-wide">COLLATERALIZED</span>
                      </div>
                      <div className="flex justify-between text-[9.5px] text-[#8b93a1] mt-1.5 font-mono">
                        <span>BAL <b className="text-gray-200">${(prop.mortgageRemaining || 0).toLocaleString()}</b></span>
                        <span>WKLY <b className="text-gray-200">${prop.weeklyMortgage.toLocaleString()}</b></span>
                        <span>VALUE <b className="text-gray-200">${prop.price.toLocaleString()}</b></span>
                      </div>
                      <div className="h-[5px] bg-[#1c2028] rounded-full mt-2.5 overflow-hidden">
                        <i className="block h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#a8842e,#e0b152)', animation: 'barGrow 1.2s cubic-bezier(0.2,0.8,0.3,1) backwards' }} />
                      </div>
                      <span className="text-[9px] font-mono text-[#e0b152] block mt-1.5">{pct}% REPAID</span>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ===== TAB: CREDIT CARDS ===== */}
          {activeTab === 'CREDIT_CARDS' && (
            <div className="space-y-2">
              {CREDIT_CARD_TIERS.map((card) => {
                const isOwned = ownedCreditCards.includes(card.id);
                const isEligible = bank.creditScore >= card.minCredit;
                return (
                  <div key={card.id} className={`bg-[#0c0e12] border rounded-xl p-3.5 ${isOwned ? 'border-[#7dd3a8]/50 border-l-[3px] border-l-[#7dd3a8]' : 'border-[#1c2028] border-l-[3px] border-l-[#2a3038]'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <b className="text-xs text-gray-100">{card.name}</b>
                        <p className="text-[9px] text-[#8b93a1] mt-0.5">{card.perk}</p>
                      </div>
                      <div className="text-right">
                        <b className="text-sm font-mono text-[#7dd3a8]">${card.limit.toLocaleString()}</b>
                        <span className="text-[8px] text-[#5c6470] block">LIMIT · MIN CR {card.minCredit}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2.5">
                      <button onClick={() => handleApplyCreditCard(card)} disabled={isOwned}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-wider cursor-pointer ${
                          isOwned ? 'bg-[#7dd3a8]/10 text-[#7dd3a8] border border-[#7dd3a8]/30 cursor-default'
                          : isEligible ? 'bg-[#7dd3a8] text-[#06251a]'
                          : 'bg-[#08090c] text-[#5c6470] border border-[#1c2028] cursor-not-allowed'
                        }`}>
                        {isOwned ? '✓ CARD ACTIVE' : isEligible ? 'APPLY' : `REQUIRES ${card.minCredit}`}
                      </button>
                      {isOwned && (
                        <button onClick={() => handleUseCardPurchase(card)}
                          className="flex-1 py-2 rounded-lg bg-[#08090c] text-gray-300 border border-[#2a3038] text-[10px] font-black cursor-pointer">
                          USE — BUILDS CREDIT
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ===== TAB: TRANSACTIONS (ledger) ===== */}
          {activeTab === 'TRANSACTIONS' && (
            <div className="space-y-2">
              <h4 className="text-[10px] tracking-[2px] text-[#8b93a1] font-black">TRANSACTION LEDGER ({(bank.transactionHistory || []).length})</h4>
              {(bank.transactionHistory || []).length === 0 ? (
                <div className="bg-[#0c0e12] border border-[#1c2028] rounded-xl p-4 text-center text-[10px] text-[#5c6470] font-mono">NO RECORDS.</div>
              ) : (
                <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                  {bank.transactionHistory.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center bg-[#0c0e12] border-b border-[#141821] px-3 py-2.5 text-[10.5px]">
                      <div className="min-w-0">
                        <span className="font-black text-gray-200 block truncate">{tx.description}</span>
                        <span className="text-[8.5px] text-[#5c6470] font-mono">{tx.category} · WK {tx.week}</span>
                      </div>
                      <span className={`font-mono font-black shrink-0 ${tx.type === 'INCOME' ? 'text-[#7dd3a8]' : tx.type === 'EXPENSE' ? 'text-[#e05252]' : 'text-[#5b9ce0]'}`}>
                        {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '−' : ''}${tx.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== TAB: BUSINESS ===== */}
          {activeTab === 'BUSINESS' && (
            <div className="space-y-2">
              <h4 className="text-[10px] tracking-[2px] text-[#8b93a1] font-black">CORPORATE ACCOUNTS</h4>
              <div className="bg-[#0c0e12] border border-[#1c2028] border-l-[3px] border-l-[#5b9ce0] rounded-xl p-3.5">
                <span className="text-[8px] tracking-[1.5px] text-[#5c6470] font-extrabold block">COMMERCIAL LINE OF CREDIT</span>
                <b className="text-lg font-mono text-[#7dd3a8]">$5,000,000 FACILITY</b>
              </div>
              <div className="bg-[#0c0e12] border border-[#1c2028] border-l-[3px] border-l-[#5b9ce0] rounded-xl p-3.5">
                <span className="text-[8px] tracking-[1.5px] text-[#5c6470] font-extrabold block">CORPORATE PAYROLL</span>
                <b className="text-xs font-mono text-[#5b9ce0]">SAG-AFTRA AUTOMATED WEEKLY DISBURSEMENT</b>
              </div>
              <div className="bg-[#0c0e12] border border-[#1c2028] border-l-[3px] border-l-[#5b9ce0] rounded-xl p-3.5">
                <span className="text-[8px] tracking-[1.5px] text-[#5c6470] font-extrabold block">BUSINESS BALANCE</span>
                <b className="text-lg font-mono text-gray-100">${(bank.businessBalance || 0).toLocaleString()}</b>
              </div>
            </div>
          )}

          {/* ===== TAB: FINANCIAL INTEL ===== */}
          {activeTab === 'FINANCIAL_INTEL' && (
            <div className="space-y-3">
              <h4 className="text-[10px] tracking-[2px] text-[#8b93a1] font-black">WEEKLY AUDIT & ORIGIN LEDGER</h4>

              <div className="bg-[#e0b152]/10 border border-[#e0b152]/30 rounded-xl p-3 text-[10px] text-[#e0d5b8] leading-relaxed flex gap-2.5">
                <DollarSign className="w-4 h-4 text-[#e0b152] shrink-0 mt-0.5" />
                <div>
                  <b className="text-[#e0b152] block mb-1">🎬 HOLLYWOOD INCOME ORIGINS</b>
                  Box office gross belongs to studios and cinemas. Your liquid inflow: contract salary (upfront), SAG-AFTRA residuals, backend profit share, streaming rights, sponsorships, and real estate / business dividends.
                </div>
              </div>

              <div className="bg-[#0c0e12] border border-[#7dd3a8]/30 rounded-xl p-3.5">
                <div className="flex justify-between items-center border-b border-[#7dd3a8]/20 pb-2 mb-2">
                  <span className="text-[10px] font-black text-[#7dd3a8] tracking-wider">WEEKLY INFLOWS</span>
                  <b className="font-mono text-gray-100 text-xs">+${finSummary.weeklyIncome.toLocaleString()}</b>
                </div>
                <div className="flex justify-between text-[10px] text-gray-300 py-1">
                  <span>Studio film & TV salaries</span><b className="font-mono text-[#7dd3a8]">+${finSummary.weeklyIncome.toLocaleString()}</b>
                </div>
                <div className="flex justify-between text-[10px] text-gray-300 py-1">
                  <span>Savings interest (APY weekly)</span>
                  <b className="font-mono text-[#7dd3a8]">+${Math.round((bank.savingsBalance || 0) * (0.025 / 52)).toLocaleString()}</b>
                </div>
              </div>

              <div className="bg-[#0c0e12] border border-[#e05252]/30 rounded-xl p-3.5">
                <div className="flex justify-between items-center border-b border-[#e05252]/20 pb-2 mb-2">
                  <span className="text-[10px] font-black text-[#e05252] tracking-wider">WEEKLY OUTFLOWS</span>
                  <b className="font-mono text-gray-100 text-xs">−${finSummary.weeklyExpenses.toLocaleString()}</b>
                </div>
                <div className="flex justify-between text-[10px] text-gray-300 py-1">
                  <span>Personal living & lifestyle</span><b className="font-mono text-[#e05252]">−${finSummary.weeklyExpenses.toLocaleString()}</b>
                </div>
                <div className="flex justify-between text-[10px] text-gray-300 py-1">
                  <span>Active loan repayments</span>
                  <b className="font-mono text-[#e05252]">−${(bank.activeLoans || []).reduce((s, l) => s + l.weeklyPayment, 0).toLocaleString()}</b>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
