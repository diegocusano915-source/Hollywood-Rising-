/**
 * HOLLYWOOD RISING - Notification Center (REAL EVENTS ONLY)
 * Shows real alerts derived from the player's actual game state:
 * offers, bids, deadlines, runs, contracts and progress thresholds.
 * Offline alerts are PHONE-ONLY (first ping 40-60 min after leaving, then
 * hourly) — nothing offline is duplicated in here.
 */

import React, { useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { X, Bell, Smartphone, Zap, Clock, Trophy } from 'lucide-react';
import { THEMES } from '../../theme/colors';
import { collectNotificationItems } from '../../services/notificationEngine';
import { notificationService } from '../../services/notificationService';

export const NotificationCenterModal: React.FC = () => {
  const { setActiveModal, saveData, settings, updateSettings, addToast } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const liveItems = useMemo(() => collectNotificationItems(saveData), [saveData]);
  const offlineEnabled = settings.offlineNotifications !== false;
  const isNative = notificationService.isNativeAvailable();

  const deadlines = liveItems.filter((i) => i.kind === 'DEADLINE');
  const statuses = liveItems.filter((i) => i.kind === 'STATUS');
  const progress = liveItems.filter((i) => i.kind === 'PROGRESS');

  const handleToggle = async (enabled: boolean) => {
    updateSettings({ offlineNotifications: enabled });
    if (enabled) {
      const granted = await notificationService.requestPermissions();
      addToast(
        granted ? 'Success' : 'Information',
        granted ? 'Notifications enabled' : 'Notifications need permission',
        granted
          ? 'You\u2019ll get real alerts when you\u2019re away from the game.'
          : 'Enable notification permission in your phone settings to get offline alerts.'
      );
    } else {
      notificationService.cancelPendingNotifications();
      addToast('Information', 'Offline notifications off', 'No alerts will be sent while you\u2019re away.');
    }
  };

  const handleTest = async () => {
    const ok = await notificationService.sendTestNotification();
    if (ok) {
      addToast('Success', 'Test notification sent', 'Check your phone in a few seconds.');
    } else if (!isNative) {
      addToast('Information', 'Works on your Android build', 'Phone notifications run on the installed app — this web preview can\u2019t show them. Build via Android Studio and test there.');
    } else {
      addToast('Error', 'Could not send test', 'Notification permission may be off in phone settings.');
    }
  };

  const ItemCard: React.FC<{ icon: string; title: string; body: string; urgency: string; refWeek?: number; dim?: boolean }> = ({ icon, title, body, urgency, refWeek, dim }) => (
    <div
      className="p-3 rounded-2xl border flex gap-3 items-start"
      style={{
        backgroundColor: dim ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
        borderColor: dim ? theme.borderDark : 'rgba(255,255,255,0.08)',
        opacity: dim ? 0.65 : 1,
      }}
    >
      <span className="text-xl leading-none mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs font-black text-white">{title}</p>
          <span
            className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
            style={{
              backgroundColor:
                urgency === 'high' ? 'rgba(239,68,68,0.18)' : urgency === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.12)',
              color: urgency === 'high' ? '#f87171' : urgency === 'medium' ? '#fbbf24' : '#34d399',
            }}
          >
            {urgency === 'high' ? 'Urgent' : urgency === 'medium' ? 'Soon' : 'Progress'}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{body}</p>
        {refWeek ? (
          <p className="text-[9px] text-amber-400/80 font-semibold mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Week {refWeek}
          </p>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md max-h-[92vh] rounded-3xl flex flex-col overflow-hidden border-2 shadow-2xl"
        style={{ backgroundColor: theme.background, borderColor: theme.borderDark }}
      >
        {/* Header */}
        <div
          className="px-4 py-4 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div>
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" /> Notification Center
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Real alerts from your career — nothing simulated</p>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl hover:bg-white/10 text-gray-300 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* PHONE NOTIFICATIONS */}
          <div className="p-3 rounded-2xl border" style={{ borderColor: 'rgba(251,191,36,0.25)', backgroundColor: 'rgba(251,191,36,0.05)' }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-xs font-black text-white">Offline phone notifications</p>
                  <p className="text-[10px] text-gray-400">
                    {isNative
                      ? 'Real alerts when the app is closed'
                      : 'Active on your Android build — this preview shows the center only'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(!offlineEnabled)}
                className="relative w-11 h-6 rounded-full transition shrink-0"
                style={{ backgroundColor: offlineEnabled ? '#f59e0b' : '#374151' }}
                aria-label="Toggle offline notifications"
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                  style={{ left: offlineEnabled ? '22px' : '2px' }}
                />
              </button>
            </div>
            <button
              onClick={handleTest}
              className="mt-3 w-full py-2 rounded-xl text-[11px] font-black uppercase tracking-wide transition"
              style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <Zap className="w-3.5 h-3.5 inline mr-1" /> Send test notification
            </button>
          </div>

          {/* OFFLINE PHONE-ONLY NOTE */}
          <div className="p-3 rounded-2xl border flex items-start gap-2" style={{ borderColor: theme.borderDark, backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-400 leading-snug">
              While you're away, alerts go to your phone only — the first one lands 40-60 minutes after you
              leave, then one every hour (real events: bids, feuds, market moves, deadlines). Nothing is
              duplicated in here.
            </p>
          </div>

          {/* LIVE ALERTS */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" /> Live alerts
            </h3>

            {deadlines.length > 0 && (
              <div className="mb-3">
                <p className="text-[9px] font-black uppercase tracking-wider text-red-400/80 mb-1.5">Deadlines</p>
                <div className="space-y-2">
                  {deadlines.map((i) => (
                    <ItemCard key={i.id} icon={i.icon} title={i.title} body={i.body} urgency={i.urgency} refWeek={i.refWeek} />
                  ))}
                </div>
              </div>
            )}

            {statuses.length > 0 && (
              <div className="mb-3">
                <p className="text-[9px] font-black uppercase tracking-wider text-sky-400/80 mb-1.5">Status</p>
                <div className="space-y-2">
                  {statuses.map((i) => (
                    <ItemCard key={i.id} icon={i.icon} title={i.title} body={i.body} urgency={i.urgency} refWeek={i.refWeek} />
                  ))}
                </div>
              </div>
            )}

            {progress.length > 0 && (
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-emerald-400/80 mb-1.5 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Progress
                </p>
                <div className="space-y-2">
                  {progress.map((i) => (
                    <ItemCard key={i.id} icon={i.icon} title={i.title} body={i.body} urgency={i.urgency} refWeek={i.refWeek} />
                  ))}
                </div>
              </div>
            )}

            {liveItems.length === 0 && (
              <div
                className="p-3 rounded-2xl border text-center"
                style={{ borderColor: theme.borderDark, backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <p className="text-[11px] text-gray-400">
                  Nothing pending right now. Book roles, land bids and hit deadlines — real alerts will appear here.
                </p>
              </div>
            )}
          </div>

          <p className="text-[9px] text-gray-500 text-center leading-relaxed pb-2">
            Every alert above comes from your real game state — actual offers, bids, deadlines, runs and stats.
            Nothing is simulated or invented.
          </p>
        </div>
      </div>
    </div>
  );
};
