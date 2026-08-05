/**
 * HOLLYWOOD RISING - SAG-AFTRA Membership Modal
 * Strict criteria: $2,000 Cash AND 4 Lead Roles (ONLY Lead roles count).
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { X, ShieldCheck, CheckCircle2, Lock, DollarSign, Crown, Sparkles } from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const MembershipModal: React.FC = () => {
  const { setActiveModal, player, joinSAGMembership, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const hasCash = player.money >= 2000;
  const totalPrincipalRoles = (player.principalRolesCount || 0) + (player.leadRolesCount || 0);
  const hasLeads = totalPrincipalRoles >= 4;
  const canJoin = hasCash && hasLeads && !player.isUnionMember;

  const benefits = [
    'Professional Studio Auditions',
    'Major Studio Access (Paramount, Warner Bros, A24)',
    'Official Talent Agency Representation',
    'Residual Payments & Box Office Royalties',
    'Guild & Academy Award Eligibility',
    'SAG-AFTRA Scale Minimum Contracts',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg rounded-2xl flex flex-col overflow-hidden border shadow-2xl"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between border-b"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">SAG-AFTRA Guild Membership</h2>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Status Badge */}
          <div
            className="p-4 rounded-xl border flex items-center gap-3"
            style={{
              backgroundColor: player.isUnionMember ? 'rgba(51, 204, 85, 0.1)' : 'rgba(0,0,0,0.4)',
              borderColor: player.isUnionMember ? '#33CC55' : theme.borderDark,
            }}
          >
            <div
              className={`p-3 rounded-full ${
                player.isUnionMember ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {player.isUnionMember ? <Crown className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {player.isUnionMember ? 'ACTIVE SAG-AFTRA MEMBER' : 'MEMBERSHIP LOCKED'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {player.isUnionMember
                  ? 'Official Hollywood Union Actor in good standing.'
                  : 'Complete qualification requirements below to unlock SAG Guild Status.'}
              </p>
            </div>
          </div>

          {/* Qualification Requirements */}
          {!player.isUnionMember && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Qualification Requirements
              </h4>

              <div className="space-y-2 text-xs">
                {/* Requirement 1: $2,000 */}
                <div
                  className="p-3 rounded-lg border flex items-center justify-between"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderColor: hasCash ? '#33CC55' : theme.borderDark,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className={`w-4 h-4 ${hasCash ? 'text-emerald-400' : 'text-gray-500'}`} />
                    <span className="text-white font-medium">Initiation Fee ($2,000 Cash)</span>
                  </div>
                  <span className={`font-bold ${hasCash ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${player.money.toLocaleString()} / $2,000
                  </span>
                </div>

                {/* Requirement 2: 4 Principal / Lead Roles */}
                <div
                  className="p-3 rounded-lg border flex items-center justify-between"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderColor: hasLeads ? '#33CC55' : theme.borderDark,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Crown className={`w-4 h-4 ${hasLeads ? 'text-emerald-400' : 'text-gray-500'}`} />
                    <div>
                      <span className="text-white font-medium block">4 Completed Principal / Lead Roles</span>
                      <span className="text-[10px] text-gray-500 block">Both Principal and Lead roles count toward membership.</span>
                    </div>
                  </div>
                  <span className={`font-bold ${hasLeads ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {totalPrincipalRoles} / 4 Principal Roles
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Benefits Unlocked */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Membership Privileges
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-2 text-gray-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          {!player.isUnionMember && (
            <button
              onClick={() => {
                const res = joinSAGMembership();
                alert(res.message);
              }}
              disabled={!canJoin}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: canJoin ? theme.primary : '#333344',
                color: canJoin ? '#000000' : '#888888',
              }}
            >
              <Sparkles className="w-4 h-4" />
              {canJoin ? 'Unlock SAG-AFTRA Membership ($2,000)' : 'Requirements Not Met Yet'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
