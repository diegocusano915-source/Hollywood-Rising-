/**
 * HOLLYWOOD RISING - Elite Private Banking Experience (Phase 4 Network & Economy)
 * Checking, Savings Interest & Goals, Credit Score (Starts at 320), Credit Card Tier Applications,
 * Pre-Generated Automated Loans, Mortgages, Investments, Transactions, Business Accounts & Weekly Financial Audits.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NetworkFullState, BankLoan } from '../../types/network';
import { NetworkService } from '../../services/networkService';
import {
  Landmark,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  History,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  PieChart,
  Sparkles,
  Award,
  Building,
  Briefcase,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

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

export const BankView: React.FC<BankViewProps> = ({
  onBack,
  networkState,
  onUpdateState,
}) => {
  const { player, saveData, updateSave, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTab, setActiveTab] = useState<
    | 'CHECKING'
    | 'SAVINGS'
    | 'CREDIT_CARDS'
    | 'LOANS'
    | 'MORTGAGES'
    | 'INVESTMENTS'
    | 'TRANSACTIONS'
    | 'BUSINESS'
    | 'FINANCIAL_INTEL'
  >('CHECKING');

  const [depositAmount, setDepositAmount] = useState<string>('5000');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('5000');
  const [feedback, setFeedback] = useState<string | null>(null);

  const finSummary = NetworkService.calculateFinancialSummary(networkState, player.money);

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
    creditScore: 320, // STARTS EXACTLY AT 320
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

  // Ratings calculation based on credit score
  const getRatingLabel = (score: number) => {
    if (score >= 800) return 'Elite (AAA)';
    if (score >= 720) return 'Excellent (AA)';
    if (score >= 650) return 'Good (A)';
    if (score >= 580) return 'Fair (BBB)';
    if (score >= 500) return 'Poor (BB)';
    return 'Terrible (CCC)';
  };

  const handleDepositSavings = () => {
    const amt = Number(depositAmount);
    if (isNaN(amt) || amt <= 0) return;

    if (player.money < amt) {
      setFeedback(`Insufficient liquid cash to deposit $${amt.toLocaleString()}!`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const newMoney = player.money - amt;
    const nextBank = {
      ...bank,
      checkingBalance: newMoney,
      savingsBalance: bank.savingsBalance + amt,
      transactionHistory: [
        {
          id: `tx_${Date.now()}`,
          description: 'Transfer to Savings',
          amount: amt,
          type: 'TRANSFER' as const,
          category: 'Savings',
          week: player.dateWeek || 1,
        },
        ...(bank.transactionHistory || []),
      ],
    };

    const nextState: NetworkFullState = {
      ...networkState,
      bankAccount: nextBank,
    };

    updateSave({
      ...saveData,
      player: {
        ...saveData.player,
        money: newMoney,
      },
    });

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`Deposited $${amt.toLocaleString()} into High-Yield Savings.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleWithdrawSavings = () => {
    const amt = Number(withdrawAmount);
    if (isNaN(amt) || amt <= 0) return;

    if (bank.savingsBalance < amt) {
      setFeedback(`Insufficient Savings Balance! Available: $${bank.savingsBalance.toLocaleString()}`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const newMoney = player.money + amt;
    const nextBank = {
      ...bank,
      checkingBalance: newMoney,
      savingsBalance: Math.max(0, bank.savingsBalance - amt),
      transactionHistory: [
        {
          id: `tx_${Date.now()}`,
          description: 'Withdrawal from Savings',
          amount: amt,
          type: 'TRANSFER' as const,
          category: 'Savings',
          week: player.dateWeek || 1,
        },
        ...(bank.transactionHistory || []),
      ],
    };

    const nextState: NetworkFullState = {
      ...networkState,
      bankAccount: nextBank,
    };

    updateSave({
      ...saveData,
      player: {
        ...saveData.player,
        money: newMoney,
      },
    });

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`Withdrew $${amt.toLocaleString()} from Savings to Checking.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleAutoSave = () => {
    const nextBank = {
      ...bank,
      autoSaveEnabled: !bank.autoSaveEnabled,
    };

    const nextState: NetworkFullState = {
      ...networkState,
      bankAccount: nextBank,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`Auto-Save ${nextBank.autoSaveEnabled ? 'ENABLED (10% weekly income saved)' : 'DISABLED'}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleApplyCreditCard = (card: typeof CREDIT_CARD_TIERS[0]) => {
    if (ownedCreditCards.includes(card.id)) {
      setFeedback(`You already hold the ${card.name}!`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    if (bank.creditScore < card.minCredit) {
      setFeedback(`APPLICATION DECLINED: Required credit score is ${card.minCredit} (Your score: ${bank.creditScore}).`);
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    const nextBank = {
      ...bank,
      creditCards: [...ownedCreditCards, card.id],
      creditScore: Math.min(850, bank.creditScore + 1), // Realistic +1 credit mix bonus
    };

    const nextState: NetworkFullState = {
      ...networkState,
      bankAccount: nextBank,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`APPROVED FOR ${card.name.toUpperCase()}! Credit limit: $${card.limit.toLocaleString()}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleClaimLoanOffer = (offerId: string) => {
    const res = NetworkService.acceptLoanOffer(networkState, offerId, player);
    if (res.success) {
      const newMoney = player.money + res.cashAdded;
      updateSave({
        ...saveData,
        player: {
          ...saveData.player,
          money: newMoney,
        },
      });
      onUpdateState(res.nextState);
      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleRepayLoanEarly = (loanId: string) => {
    const res = NetworkService.repayLoanEarly(networkState, loanId, player.money);
    if (res.success) {
      const newMoney = Math.max(0, player.money - res.cashDeducted);
      updateSave({
        ...saveData,
        player: {
          ...saveData.player,
          money: newMoney,
        },
      });
      onUpdateState(res.nextState);
      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const mortgagedProperties = (networkState.properties || []).filter(
    (p) => p.isOwned && p.isMortgaged && p.mortgageRemaining > 0
  );

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>Back to Network</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-sky-300 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/30 flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-sky-400" />
            Beverly Hills Private Wealth Bank
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-3 relative overflow-hidden"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/20 border border-sky-400/40">
              <Landmark className="w-7 h-7 text-sky-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest block">
                PRIVATE BANKING & CREDIT ENGINE
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">HOLLYWOOD PRIVATE BANK</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">FICO Credit Score</span>
            <span className="text-xl font-black text-amber-400">{bank.creditScore}</span>
            <span className="text-[9px] text-sky-300 font-bold block">{getRatingLabel(bank.creditScore)}</span>
          </div>
        </div>

        {/* FINANCIAL DASHBOARD METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-black bg-black/60 p-3 rounded-2xl border border-white/10">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase">Available Liquid Cash</span>
            <span className="text-emerald-400 font-black">${player.money.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase">High-Yield Savings</span>
            <span className="text-sky-300 font-black">${(bank.savingsBalance || 0).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase">Weekly Cash Flow</span>
            <span className={finSummary.weeklyNetChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {finSummary.weeklyNetChange >= 0 ? '+' : ''}${finSummary.weeklyNetChange.toLocaleString()}/wk
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase">Financial Rating</span>
            <span className="text-amber-300 font-black">{bank.reputationRating}</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-sky-500/20 border border-sky-500/50 text-sky-300 text-xs font-black shadow-lg text-center">
          {feedback}
        </div>
      )}

      {/* SUB-TAB NAVIGATION */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-black/60 border border-white/10 text-xs font-black">
        {[
          { id: 'CHECKING', label: 'Checking' },
          { id: 'SAVINGS', label: 'Savings' },
          { id: 'CREDIT_CARDS', label: `Credit Cards (${ownedCreditCards.length})` },
          { id: 'LOANS', label: `Loan Offers & Active (${(bank.activeLoans || []).length})` },
          { id: 'MORTGAGES', label: `Mortgages (${mortgagedProperties.length})` },
          { id: 'BUSINESS', label: 'Business Accounts' },
          { id: 'TRANSACTIONS', label: 'Transaction History' },
          { id: 'FINANCIAL_INTEL', label: 'Financial Audit & Reports' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-sky-500 text-white shadow-lg font-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CHECKING */}
      {activeTab === 'CHECKING' && (
        <div className="p-5 rounded-3xl border border-sky-500/30 bg-black/50 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <h2 className="text-sm font-black text-sky-400 uppercase">Primary Checking Account</h2>
              <p className="text-xs text-gray-400">Contains your available liquid cash for studio bids, auditions, real estate, and daily expenses.</p>
            </div>
            <span className="text-2xl font-black text-emerald-400">${player.money.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-gray-400 font-bold block">Account Protection</span>
              <span className="text-emerald-400 font-black">FDIC INSURED TO $250,000</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-gray-400 font-bold block">Overdraft Protection</span>
              <span className="text-sky-300 font-black">Beverly Hills Private Wealth Line Active</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAVINGS */}
      {activeTab === 'SAVINGS' && (
        <div className="p-5 rounded-3xl border border-sky-500/30 bg-black/50 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <h2 className="text-sm font-black text-sky-400 uppercase">High-Yield Interest Savings</h2>
              <p className="text-xs text-gray-400">2.5% APY • Earn weekly interest distributions on deposited funds.</p>
            </div>
            <span className="text-2xl font-black text-sky-300">${(bank.savingsBalance || 0).toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Weekly Interest</span>
              <span className="text-emerald-400 font-black">+${Math.round((bank.savingsBalance || 0) * (0.025 / 52)).toLocaleString()}/wk</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Lifetime Interest Earned</span>
              <span className="text-amber-300 font-black">${(bank.lifetimeInterestEarned || 0).toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Auto Save (10%)</span>
                <span className={bank.autoSaveEnabled ? 'text-emerald-400 font-black' : 'text-gray-400'}>
                  {bank.autoSaveEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <button
                onClick={handleToggleAutoSave}
                className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-black hover:bg-sky-500/30 cursor-pointer"
              >
                {bank.autoSaveEnabled ? 'DISABLE' : 'ENABLE'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <span className="text-xs font-black text-sky-300 uppercase block">Deposit Cash</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="flex-1 bg-black/80 border border-white/10 rounded-2xl px-3 py-2 text-xs font-black text-white outline-none"
                  placeholder="Deposit Amount"
                />
                <button
                  onClick={handleDepositSavings}
                  className="px-4 py-2 rounded-2xl bg-emerald-500 text-black font-black text-xs hover:scale-102 transition-all cursor-pointer"
                >
                  DEPOSIT
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <span className="text-xs font-black text-sky-300 uppercase block">Withdraw Cash</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="flex-1 bg-black/80 border border-white/10 rounded-2xl px-3 py-2 text-xs font-black text-white outline-none"
                  placeholder="Withdraw Amount"
                />
                <button
                  onClick={handleWithdrawSavings}
                  className="px-4 py-2 rounded-2xl bg-black/80 text-sky-300 border border-sky-500/30 font-black text-xs hover:bg-sky-500/20 transition-all cursor-pointer"
                >
                  WITHDRAW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CREDIT CARDS */}
      {activeTab === 'CREDIT_CARDS' && (
        <div className="p-5 rounded-3xl border border-sky-500/30 bg-black/50 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-black text-sky-400 uppercase">Hollywood Private Credit Cards</h2>
            <p className="text-xs text-gray-400">Apply for high-status credit cards based on your credit score and financial standing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CREDIT_CARD_TIERS.map((card) => {
              const isOwned = ownedCreditCards.includes(card.id);
              const isEligible = bank.creditScore >= card.minCredit;

              return (
                <div
                  key={card.id}
                  className={`p-4 rounded-2xl border space-y-2 text-xs flex flex-col justify-between ${
                    isOwned
                      ? 'bg-sky-500/10 border-sky-500/40'
                      : 'bg-black/60 border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-white text-sm">{card.name}</h3>
                      <span className="text-emerald-400 font-black">${card.limit.toLocaleString()} Limit</span>
                    </div>
                    <p className="text-[11px] text-gray-300 mt-1">{card.perk}</p>
                    <div className="text-[10px] text-gray-400 mt-2">Required Credit: {card.minCredit}+</div>
                  </div>

                  <button
                    onClick={() => handleApplyCreditCard(card)}
                    disabled={isOwned}
                    className={`w-full py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      isOwned
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                        : isEligible
                        ? 'bg-sky-400 text-black hover:scale-102'
                        : 'bg-black/40 text-gray-500 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {isOwned ? '✓ CARD ACTIVE' : isEligible ? 'APPLY FOR CARD' : `REQUIRES ${card.minCredit} CREDIT`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: LOANS & AUTOMATED LOAN OFFERS */}
      {activeTab === 'LOANS' && (
        <div className="p-5 rounded-3xl border border-amber-500/30 bg-black/50 space-y-6 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <h2 className="text-sm font-black text-amber-400 uppercase">Pre-Generated Bank Loan Offers</h2>
              <p className="text-xs text-gray-400">Automated Wall Street credit offers generated dynamically based on your Credit Score ({bank.creditScore}) & Net Worth.</p>
            </div>
            <CreditCard className="w-6 h-6 text-amber-400" />
          </div>

          {/* SINGLE ACTIVE LOAN POLICY BANNER */}
          {(bank.activeLoans || []).length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-amber-200 text-xs font-black shadow-lg flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 shrink-0 text-amber-400" />
              <div>
                <span className="text-sm font-black block text-amber-300">
                  You must fully repay your current loan before applying for another.
                </span>
                <span className="text-[10px] text-gray-300 font-medium block mt-0.5">
                  Hollywood Private Bank policy strictly restricts borrowers to one active personal loan facility at a time. Pay off your existing loan balance below to apply for new credit lines.
                </span>
              </div>
            </div>
          )}

          {/* REALISTIC CREDIT SCORE & BUILDING REQUIREMENTS CARD */}
          <div className="p-4 rounded-2xl border border-white/10 bg-black/60 space-y-3 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">FICO CREDIT STANDING</span>
                <h3 className="text-sm font-black text-white">Credit Score: {bank.creditScore} ({getRatingLabel(bank.creditScore)} Rating)</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Credit score starts at 320 for new players and builds gradually over time through disciplined repayment. Unrealistic instant score jumps are capped.
                </p>
              </div>
              <div className="text-right bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                <span className="text-[9px] text-gray-400 font-bold uppercase block">SCORE RANGE</span>
                <span className="text-base font-black text-amber-400">{bank.creditScore} / 850</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider block">4 REALISTIC CREDIT BUILDING REQUIREMENTS</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">1. Repaid Loans</span>
                  <span className="text-emerald-400 font-black">{bank.loansRepaidCount || 0} Repaid Loans</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Multiple successful loan cycles required (+5 to +15 pts per payoff).</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">2. On-Time Payments</span>
                  <span className={(bank.missedPaymentsCount || 0) === 0 ? 'text-emerald-400 font-black' : 'text-rose-400 font-black'}>
                    {bank.onTimePaymentsCount || 0} On-Time / {bank.missedPaymentsCount || 0} Missed
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Missed repayments reduce credit score by 20 pts immediately.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">3. Repayment History</span>
                  <span className="text-sky-300 font-black">{bank.creditAgeWeeks || 0} Weeks Active</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Long credit maturity builds gradual FICO standing over weeks.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">4. Default Record</span>
                  <span className={(bank.loanDefaultsCount || 0) === 0 ? 'text-emerald-400 font-black' : 'text-rose-400 font-black'}>
                    {(bank.loanDefaultsCount || 0) === 0 ? '0 Defaults (Clean)' : `${bank.loanDefaultsCount} Default(s)`}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Defaults severely penalize score and cap future credit limits.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 PRE-GENERATED LOAN OFFERS */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Available Loan Pre-Approvals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {loanOffers.map((offer) => {
                const hasActiveLoan = (bank.activeLoans || []).length > 0;
                const metCredit = bank.creditScore >= offer.requirements.minCreditScore;
                const metNetWorth = finSummary.netWorth >= offer.requirements.minNetWorth;
                const canClaim = !hasActiveLoan && metCredit && metNetWorth;

                return (
                  <div
                    key={offer.id}
                    className={`p-4 rounded-2xl border border-white/10 bg-black/60 flex flex-col justify-between space-y-3 shadow-lg transition-all ${
                      hasActiveLoan ? 'opacity-60 border-white/5' : 'hover:border-amber-500/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">{offer.type}</span>
                          <h4 className="text-sm font-black text-white">{offer.title}</h4>
                        </div>
                        <span className="text-lg font-black text-emerald-400 font-mono">${offer.principal.toLocaleString()}</span>
                      </div>

                      <p className="text-[11px] text-gray-300 leading-tight">{offer.description}</p>

                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-black/40 p-2 rounded-xl border border-white/5">
                        <div>
                          <span className="text-gray-400 block uppercase">Interest Rate</span>
                          <span className="text-amber-300 font-black">{offer.interestRatePct}% p.a.</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase">Weekly Payment</span>
                          <span className="text-white font-black">${offer.weeklyPayment.toLocaleString()}/wk</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase">Term Length</span>
                          <span className="text-sky-300 font-black">{offer.weeksLength} Weeks</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase">Risk Rating</span>
                          <span className="text-rose-400 font-black">{offer.riskRating}</span>
                        </div>
                      </div>

                      <div className="text-[10px] space-y-0.5">
                        <div className={metCredit ? 'text-emerald-400' : 'text-rose-400'}>
                          • Min Credit: {offer.requirements.minCreditScore} (Your Score: {bank.creditScore})
                        </div>
                        <div className={metNetWorth ? 'text-emerald-400' : 'text-rose-400'}>
                          • Min Net Worth: ${offer.requirements.minNetWorth.toLocaleString()} (Your NW: ${finSummary.netWorth.toLocaleString()})
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaimLoanOffer(offer.id)}
                      disabled={!canClaim}
                      className={`w-full py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                        canClaim
                          ? 'bg-amber-400 text-black hover:scale-102 shadow-lg'
                          : 'bg-black/40 text-gray-500 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      {hasActiveLoan
                        ? 'REPAY CURRENT LOAN FIRST'
                        : canClaim
                        ? '✓ ACCEPT & CLAIM DISBURSEMENT'
                        : 'REQUIREMENTS NOT MET'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE LOANS LIST */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Active Loans ({(bank.activeLoans || []).length})</h3>
            {(bank.activeLoans || []).length === 0 ? (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-gray-400 font-bold">
                No active loans. Choose a pre-approved loan offer above to inject cash into your account.
              </div>
            ) : (
              <div className="space-y-2">
                {bank.activeLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="p-4 rounded-2xl border border-white/10 bg-black/60 flex flex-wrap justify-between items-center gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white">{loan.title || loan.type}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold">{loan.status || 'ACTIVE'}</span>
                      </div>
                      <div className="text-gray-400 text-[11px] mt-1">
                        Remaining: <span className="text-emerald-400 font-black">${loan.balanceRemaining.toLocaleString()}</span> • Payment: ${loan.weeklyPayment.toLocaleString()}/wk • {loan.weeksRemaining} wks remaining
                      </div>
                    </div>

                    <button
                      onClick={() => handleRepayLoanEarly(loan.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-black text-xs hover:scale-102 transition-all cursor-pointer"
                    >
                      PAY OFF FULL (${loan.balanceRemaining.toLocaleString()})
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: MORTGAGES */}
      {activeTab === 'MORTGAGES' && (
        <div className="p-5 rounded-3xl border border-sky-500/30 bg-black/50 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-black text-sky-400 uppercase">Real Estate Mortgages</h2>
            <p className="text-xs text-gray-400">Manage ongoing property mortgages across your portfolio.</p>
          </div>

          {mortgagedProperties.length === 0 ? (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-gray-400 font-bold">
              No mortgaged properties found. Visit Real Estate in Network to buy properties with financing.
            </div>
          ) : (
            <div className="space-y-2">
              {mortgagedProperties.map((prop) => (
                <div key={prop.id} className="p-4 rounded-2xl bg-black/60 border border-white/10 flex justify-between items-center text-xs">
                  <div>
                    <h3 className="font-black text-white">{prop.name}</h3>
                    <p className="text-gray-400 text-[11px]">Mortgage Balance: ${prop.mortgageRemaining?.toLocaleString() || 0} • Payment: ${prop.weeklyMortgage.toLocaleString()}/wk</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-300 text-[10px] font-black border border-sky-500/30">MORTGAGED</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: BUSINESS ACCOUNTS */}
      {activeTab === 'BUSINESS' && (
        <div className="p-5 rounded-3xl border border-sky-500/30 bg-black/50 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-black text-sky-400 uppercase">Corporate Business Accounts</h2>
            <p className="text-xs text-gray-400">Commercial banking services for studio ventures, production companies, and talent agencies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-gray-400 font-bold block uppercase">Commercial Line of Credit</span>
              <span className="text-emerald-400 font-black text-base">$5,000,000 Facility Available</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-gray-400 font-bold block uppercase">Corporate Payroll Services</span>
              <span className="text-sky-300 font-black text-base">SAG-AFTRA Automated Weekly Disbursement</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: TRANSACTIONS */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="p-5 rounded-3xl border border-sky-500/30 bg-black/50 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-black text-sky-400 uppercase">Transaction Audit Ledger</h2>
            <p className="text-xs text-gray-400">Permanent record of all earnings, loans, property deals, and expenses.</p>
          </div>

          {(bank.transactionHistory || []).length === 0 ? (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-gray-400 font-bold">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {bank.transactionHistory.map((tx) => (
                <div key={tx.id} className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-black text-white block">{tx.description}</span>
                    <span className="text-[10px] text-gray-400">{tx.category} • Week {tx.week}</span>
                  </div>
                  <span className={`font-black font-mono ${tx.type === 'INCOME' ? 'text-emerald-400' : tx.type === 'EXPENSE' ? 'text-rose-400' : 'text-sky-300'}`}>
                    {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : ''}${tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 8: FINANCIAL INTEL & AUDIT */}
      {activeTab === 'FINANCIAL_INTEL' && (
        <div className="p-5 rounded-3xl border border-sky-500/30 bg-black/50 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-black text-sky-400 uppercase">Itemized Weekly Financial Audit & Origin Ledger</h2>
              <p className="text-xs text-gray-400">Complete origin breakdown of every single dollar flowing in and out of your personal & corporate accounts.</p>
            </div>
            <span className={`px-3 py-1.5 rounded-xl border text-xs font-black text-center ${finSummary.weeklyNetChange >= 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
              Net Flow: {finSummary.weeklyNetChange >= 0 ? '+' : ''}${finSummary.weeklyNetChange.toLocaleString()}/wk
            </span>
          </div>

          {/* Hollywood Box Office vs Liquid Earnings Explanation */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
            <DollarSign className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block font-bold mb-0.5">🎬 Understanding Your Hollywood Income Origins:</strong>
              Theatrical Box Office gross (e.g. $100M+ theatrical revenue) belongs to film studios and cinema chains. As an actor/creator, your liquid cash inflow comes from: <strong>Contract Salary</strong> (paid upfront during filming), <strong>SAG-AFTRA Residuals</strong> (weekly performance payouts), <strong>Backend Profit Share</strong> (negotiated contract %), <strong>Streaming Rights</strong>, <strong>Sponsorship Deals</strong>, and <strong>Real Estate / Business Dividends</strong>.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* WEEKLY INFLOWS */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex justify-between items-center border-b border-emerald-500/20 pb-2">
                <span className="font-black text-emerald-400 uppercase">Weekly Inflows (Earnings)</span>
                <span className="font-black text-white text-sm">+${finSummary.weeklyIncome.toLocaleString()}</span>
              </div>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between items-center p-2 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <span className="font-bold text-white block">Studio Film & TV Salaries</span>
                    <span className="text-[10px] text-gray-400">Upfront pay from active filming contracts</span>
                  </div>
                  <span className="font-bold text-emerald-400">+${finSummary.weeklyIncome.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <span className="font-bold text-white block">High-Yield Savings Interest</span>
                    <span className="text-[10px] text-gray-400">APY compounding weekly</span>
                  </div>
                  <span className="font-bold text-emerald-400">+${Math.round((bank.savingsBalance || 0) * (0.025 / 52)).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* WEEKLY OUTFLOWS */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
              <div className="flex justify-between items-center border-b border-rose-500/20 pb-2">
                <span className="font-black text-rose-400 uppercase">Weekly Outflows (Expenses)</span>
                <span className="font-black text-white text-sm">-${finSummary.weeklyExpenses.toLocaleString()}</span>
              </div>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between items-center p-2 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <span className="font-bold text-white block">Personal Living & Lifestyle</span>
                    <span className="text-[10px] text-gray-400">Housing, dining, staff, and personal expenses</span>
                  </div>
                  <span className="font-bold text-rose-400">-${finSummary.weeklyExpenses.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <span className="font-bold text-white block">Active Loan Repayments</span>
                    <span className="text-[10px] text-gray-400">Automated bank debt servicing</span>
                  </div>
                  <span className="font-bold text-rose-400">-${(bank.activeLoans || []).reduce((sum, l) => sum + l.weeklyPayment, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
