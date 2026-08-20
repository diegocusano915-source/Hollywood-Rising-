/**
 * HOLLYWOOD RISING — Tax Statement Popup (Option B: Live Tax Dashboard)
 * Fires ONLY on real tax events from taxEngine: a calendar month actually
 * closed, or the year-52 filing actually ran. Every number shown comes
 * from the real TaxWeekResult / TaxYearRecord — nothing is simulated.
 */
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface TaxStatementData {
  type: 'monthly' | 'filing';
  year: number;
  week: number;
  // monthly payload
  month?: string;
  monthIncome?: number;
  monthWithheld?: number;
  ytdIncome?: number;
  ytdWithheld?: number;
  ytdLiability?: number;
  // filing payload
  refund?: number;
  balanceDue?: number;
  totalIncome?: number;
  deductions?: number;
  taxable?: number;
  liability?: number;
  effectiveRate?: number;
  // shared
  audited: boolean;
  penalty?: number;
  auditNote?: string;
  // real context
  monthlyHistory: Array<{ month: string; income: number; withheld: number; closed: boolean; audited?: boolean }>;
  accountantTier: string;
}

const fmt = (v: number) => `$${Math.round(v).toLocaleString()}`;
const fmtK = (v: number) =>
  v >= 1000000 ? `$${(v / 1000000).toFixed(2)}M` : v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${Math.round(v)}`;

const MONTH_ORDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const TaxStatementModal: React.FC<{ data: TaxStatementData; onClose: () => void }> = ({ data, onClose }) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 60);
    return () => clearTimeout(t);
  }, []);

  const isMonthly = data.type === 'monthly';
  const flagged = data.audited && (data.penalty || 0) > 0;
  const contested = data.audited && !(data.penalty || 0); // lawyer dismissed

  // Real coverage ratio from engine numbers
  const liability = isMonthly ? (data.ytdLiability || 0) : (data.liability || 0);
  const withheld = isMonthly ? (data.ytdWithheld || 0) : (data.ytdWithheld || 0);
  const coverage = liability > 0 ? Math.min(100, (withheld / liability) * 100) : 100;
  const covDeg = Math.round((coverage / 100) * 360);
  const covColor = coverage >= 85 ? '#4ade80' : coverage >= 70 ? '#fbbf24' : '#f87171';

  // Risk marker: low coverage = far right (danger)
  const riskPos = Math.max(2, Math.min(98, Math.round(100 - coverage)));

  // Real closed months only — future months never appear
  const closed = data.monthlyHistory
    .filter((m) => m.closed)
    .sort((a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month));
  const maxIncome = Math.max(1, ...closed.map((m) => m.income));

  // Count-up animation for the hero number
  const heroAmt = isMonthly ? 0 : (data.refund || data.balanceDue || 0);
  const [countUp, setCountUp] = useState(0);
  useEffect(() => {
    if (isMonthly || heroAmt <= 0) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      setCountUp(Math.floor(heroAmt * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [heroAmt, isMonthly]);

  const isRefund = isMonthly ? false : !!(data.refund && data.refund > 0);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3">
      <div
        className={`relative w-full max-w-[420px] max-h-[88vh] overflow-y-auto rounded-[22px] border shadow-2xl transition-all duration-500 ${
          shown ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-97'
        } ${flagged ? 'border-red-400/40 bg-gradient-to-b from-[#1a1016] to-[#0c0c16]' : 'border-white/10 bg-gradient-to-b from-[#12121e] to-[#0c0c16]'}`}
        style={isRefund ? { boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 46px rgba(74,222,128,0.14)' } : undefined}
      >
        {/* top glow */}
        <div
          className="pointer-events-none absolute -top-14 left-1/2 h-28 w-64 -translate-x-1/2 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${flagged ? 'rgba(248,113,113,0.28)' : isRefund ? 'rgba(74,222,128,0.3)' : 'rgba(59,110,255,0.28)'}, transparent 70%)` }}
        />

        {/* header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${flagged ? 'bg-gradient-to-br from-[#7f1d1d] to-[#450a0a]' : 'bg-gradient-to-br from-[#1e3a8a] to-[#3b2f8a]'}`}
              style={{ boxShadow: flagged ? '0 0 18px rgba(248,113,113,0.4)' : '0 0 18px rgba(59,110,255,0.4)' }}>
              {flagged ? '🚨' : isMonthly ? '📊' : '🏛️'}
            </div>
            <div>
              <h3 className="text-[13px] font-black tracking-wide text-white">
                {isMonthly ? `${data.month?.toUpperCase()} TAX STATEMENT` : `${data.year} TAX RETURN`}
              </h3>
              <p className="mt-0.5 text-[8.5px] tracking-[0.2em] text-gray-500">
                WEEK {data.week} · {data.year} · {isMonthly ? 'MONTH CLOSED' : 'FINAL FILING'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg bg-white/10 p-1.5 text-white/80">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 px-4 pb-4">
          {/* ===== MONTHLY: gauge + stats + real month bars ===== */}
          {isMonthly && (
            <>
              <div className="flex items-center gap-4 py-2">
                <div className="relative h-[108px] w-[108px] shrink-0">
                  <div
                    className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      background: `conic-gradient(${covColor} 0deg ${shown ? covDeg : 0}deg, rgba(255,255,255,0.07) ${shown ? covDeg : 0}deg 360deg)`,
                    }}
                  />
                  <div className="absolute inset-[13px] flex flex-col items-center justify-center rounded-full bg-[#0e0e18]">
                    <b className="font-mono text-xl" style={{ color: covColor }}>
                      {shown ? coverage.toFixed(1) : '0.0'}%
                    </b>
                    <span className="mt-0.5 text-[7.5px] tracking-[0.15em] text-gray-500">COVERAGE</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex justify-between text-[10.5px]"><span className="text-gray-500">{data.month} income</span><b className="font-mono text-amber-300">{fmtK(data.monthIncome || 0)}</b></div>
                  <div className="flex justify-between text-[10.5px]"><span className="text-gray-500">{data.month} withheld</span><b className="font-mono" style={{ color: covColor }}>{fmtK(data.monthWithheld || 0)}</b></div>
                  <div className="flex justify-between text-[10.5px]"><span className="text-gray-500">YTD income</span><b className="font-mono text-amber-300">{fmtK(data.ytdIncome || 0)}</b></div>
                  <div className="flex justify-between text-[10.5px]"><span className="text-gray-500">YTD withheld</span><b className="font-mono" style={{ color: covColor }}>{fmtK(data.ytdWithheld || 0)}</b></div>
                  <div className="flex justify-between text-[10.5px]"><span className="text-gray-500">Est. liability</span><b className="font-mono text-white">{fmtK(data.ytdLiability || 0)}</b></div>
                </div>
              </div>

              {/* audit strip — real engine verdict only */}
              {(flagged || contested) && (
                <div className={`flex items-center gap-2.5 rounded-2xl border p-3 ${flagged ? 'animate-[taxshake_0.5s_ease_0.3s] border-red-400/40 bg-red-500/10' : 'border-amber-400/40 bg-amber-500/10'}`}>
                  <span className="text-xl">{flagged ? '⚠️' : '⚖️'}</span>
                  <p className={`text-[10px] leading-relaxed ${flagged ? 'text-red-300' : 'text-amber-300'}`}>
                    {flagged ? (
                      <><b className="text-white">MONTH-END FIELD AUDIT.</b> Penalty of <b className="text-white">{fmt(data.penalty || 0)}</b> charged to your account. </>
                    ) : (
                      <><b className="text-white">FIELD AUDIT CONTESTED.</b> </>
                    )}
                    {data.auditNote?.replace(/^[⚠️✔]+\s*/, '')}
                  </p>
                </div>
              )}

              {/* real closed months only */}
              {closed.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[9px] font-bold tracking-[0.15em] text-gray-500">MONTHLY INCOME — {data.year}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[8.5px] font-black tracking-wider ${flagged ? 'border border-red-400/40 bg-red-500/10 text-red-300' : 'border border-emerald-400/40 bg-emerald-500/10 text-emerald-300'}`}>
                      {flagged ? 'FLAGGED' : contested ? 'CONTESTED' : 'ON TRACK'}
                    </span>
                  </div>
                  <div className="flex h-[76px] items-end gap-1.5">
                    {closed.map((m, i) => {
                      const h = Math.max(4, Math.round((m.income / maxIncome) * 100));
                      const isCur = m.month === data.month;
                      return (
                        <div key={m.month} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                          <div
                            className={`w-full rounded-t transition-all duration-700 ${m.audited ? 'bg-gradient-to-b from-red-400 to-red-900' : isCur ? 'bg-gradient-to-b from-emerald-400 to-emerald-900' : 'bg-gradient-to-b from-sky-500 to-indigo-900'}`}
                            style={{ height: `${shown ? h : 2}%`, transitionDelay: `${i * 60}ms`, boxShadow: isCur ? '0 0 14px rgba(74,222,128,0.45)' : undefined }}
                          />
                          <span className="text-[7.5px] font-bold text-gray-600">{m.month[0]}{m.month[2] || ''}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* risk meter — derived from real coverage */}
                  <div className="relative mt-3 h-[7px] rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400">
                    <div
                      className="absolute top-[-4px] h-[15px] w-1 rounded-sm bg-white transition-all duration-1000"
                      style={{ left: `${shown ? riskPos : 50}%`, boxShadow: '0 0 8px rgba(255,255,255,0.8)' }}
                    />
                  </div>
                  <p className="mt-2 text-[9.5px] leading-relaxed text-gray-500">
                    Year-end audit risk: <b style={{ color: coverage >= 85 ? '#4ade80' : coverage >= 70 ? '#fbbf24' : '#f87171' }}>
                      {coverage >= 85 ? 'LOW' : coverage >= 70 ? 'MODERATE' : 'HIGH'}</b>
                    {' '}· Accountant: <b className="text-gray-300">{data.accountantTier}</b>
                  </p>
                </div>
              )}

              <button
                onClick={onClose}
                className={`w-full cursor-pointer rounded-xl py-3 text-[11px] font-black tracking-widest uppercase ${flagged ? 'bg-gradient-to-r from-red-600 to-red-800 text-white' : 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white'}`}
              >
                {flagged ? 'Understood' : 'Looks Good'}
              </button>
            </>
          )}

          {/* ===== FILING: hero + ledger ===== */}
          {!isMonthly && (
            <>
              <div className="relative py-4 text-center">
                {isRefund && (
                  <>
                    {[18, 42, 66, 84].map((left, i) => (
                      <span
                        key={left}
                        className={`absolute top-0 h-2 w-2 rounded-sm ${i % 2 === 0 ? 'bg-emerald-400' : i % 3 === 0 ? 'bg-amber-400' : 'bg-sky-400'}`}
                        style={{ left: `${left}%`, animation: `taxfall 2.4s ${i * 0.6}s linear infinite` }}
                      />
                    ))}
                  </>
                )}
                <div className="text-[9px] font-extrabold tracking-[0.3em] text-gray-500">
                  {isRefund ? 'REFUND INCOMING' : 'BALANCE DUE'}
                </div>
                <div
                  className={`mt-1.5 font-mono text-[38px] font-black leading-none ${isRefund ? 'text-emerald-400' : 'text-red-400'}`}
                  style={{ textShadow: isRefund ? '0 0 30px rgba(74,222,128,0.5)' : '0 0 30px rgba(248,113,113,0.45)' }}
                >
                  {isRefund ? '+' : '−'}{fmt(countUp)}
                </div>
                <div className="mt-1.5 text-[10px] text-gray-400">
                  {isRefund
                    ? 'You over-withheld this year — money returned to your account.'
                    : 'Collected automatically from your balance by the Tax Authority.'}
                </div>
              </div>

              {/* audit strip — real engine verdict only */}
              {(flagged || contested) && (
                <div className={`flex items-center gap-2.5 rounded-2xl border p-3 ${flagged ? 'border-red-400/40 bg-red-500/10' : 'border-amber-400/40 bg-amber-500/10'}`}>
                  <span className="text-xl">{flagged ? '⚖️' : '🛡️'}</span>
                  <p className={`text-[10px] leading-relaxed ${flagged ? 'text-red-300' : 'text-amber-300'}`}>
                    {flagged && <><b className="text-white">AUDIT PENALTY {fmt(data.penalty || 0)}.</b> </>}
                    {data.auditNote?.replace(/^[⚠️✔]+\s*/, '')}
                  </p>
                </div>
              )}

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                {[
                  ['Total income', fmt(data.totalIncome || 0), ''],
                  ['Deductions applied', `−${fmt(data.deductions || 0)}`, ''],
                  ['Taxable income', fmt(data.taxable || 0), ''],
                  ['Final liability', fmt(data.liability || 0), ''],
                  ['Withheld all year', fmt(data.ytdWithheld || 0), ''],
                  ['Effective rate', `${data.effectiveRate || 0}%`, ''],
                  [flagged ? 'Compliance check' : 'Audit check', flagged ? '✖ AUDITED — PENALTY APPLIED' : contested ? '⚖️ AUDITED — LAWYER DISMISSED' : '✔ CLEARED — NO AUDIT', flagged ? 'text-red-400' : contested ? 'text-amber-400' : 'text-amber-300'],
                ].map(([label, value, cls]) => (
                  <div key={label as string} className="flex justify-between border-b border-white/5 px-3.5 py-2.5 text-[11px] last:border-b-0">
                    <span className="text-gray-500">{label}</span>
                    <b className={`font-mono ${cls || 'text-white'}`}>{value}</b>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className={`w-full cursor-pointer rounded-xl py-3 text-[11px] font-black tracking-widest uppercase text-white ${isRefund ? 'bg-gradient-to-r from-emerald-600 to-emerald-800' : 'bg-gradient-to-r from-red-600 to-red-800'}`}
              >
                {isRefund ? 'Collect Refund' : 'Close Filing'}
              </button>
            </>
          )}
        </div>

        <style>{`
          @keyframes taxfall { to { transform: translateY(150px) rotate(540deg); opacity: 0; } }
          @keyframes taxshake { 0%,100%{transform:none} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(2px)} }
        `}</style>
      </div>
    </div>
  );
};
