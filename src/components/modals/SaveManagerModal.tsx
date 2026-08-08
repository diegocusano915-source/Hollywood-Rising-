/**
 * HOLLYWOOD RISING - Offline Save Slot Manager
 * 3 Offline Slots, Manual Save, Backup & Restore, Rename, Delete - No Cloud/JSON
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import {
  StorageService,
  SaveSlotSummary,
} from '../../database/storageService';
import {
  X,
  Database,
  Save,
  RefreshCw,
  Trash2,
  Edit3,
  Check,
  AlertTriangle,
  Film,
  Building2,
  DollarSign,
  Star,
  Award,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const SaveManagerModal: React.FC = () => {
  const { setActiveModal, saveData, settings, switchSaveSlot, manualSave, resetGame } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [summaries, setSummaries] = useState<SaveSlotSummary[]>([]);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [confirmState, setConfirmState] = useState<{ type: 'delete' | 'restore' | null; slot: number | null }>({ type: null, slot: null });

  const refreshSummaries = () => {
    const all = StorageService.getSaveSlotSummaries();
    // Only show first 3 slots offline
    setSummaries(all.filter(s => s.slotNumber <= 3));
  };

  useEffect(() => {
    refreshSummaries();
  }, []);

  const handleManualSaveToSlot = (slotNum: number) => {
    StorageService.saveGameData(saveData, slotNum);
    setFeedback({ type: 'success', msg: `Game saved successfully to Slot ${slotNum}!` });
    refreshSummaries();
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSwitchSlot = (slotNum: number) => {
    switchSaveSlot(slotNum);
    setFeedback({ type: 'success', msg: `Switched active save slot to Slot ${slotNum}.` });
    refreshSummaries();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRestoreBackup = (slotNum: number) => {
    setConfirmState({ type: 'restore', slot: slotNum });
  };

  const confirmRestore = () => {
    const slotNum = confirmState.slot;
    if (!slotNum) return;
    const restored = StorageService.restoreBackupSave(slotNum);
    if (restored) {
      setFeedback({ type: 'success', msg: `Slot ${slotNum} restored from backup!` });
      refreshSummaries();
      if (settings.activeSlot === slotNum) {
        switchSaveSlot(slotNum);
      }
    } else {
      setFeedback({ type: 'error', msg: `No backup found for Slot ${slotNum}.` });
    }
    setConfirmState({ type: null, slot: null });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleStartRename = (summary: SaveSlotSummary) => {
    setEditingSlot(summary.slotNumber);
    setRenameTitle(summary.customTitle || `Save Slot ${summary.slotNumber}`);
  };

  const handleSaveRename = (slotNum: number) => {
    StorageService.setSlotTitle(slotNum, renameTitle.trim() || `Save Slot ${slotNum}`);
    setEditingSlot(null);
    refreshSummaries();
    setFeedback({ type: 'success', msg: `Slot ${slotNum} title updated!` });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleDeleteSlot = (slotNum: number) => {
    setConfirmState({ type: 'delete', slot: slotNum });
  };

  const confirmDelete = () => {
    const slotNum = confirmState.slot;
    if (!slotNum) return;
    StorageService.deleteSaveData(slotNum);
    setFeedback({ type: 'error', msg: `Save Slot ${slotNum} deleted.` });
    refreshSummaries();
    if (settings.activeSlot === slotNum) {
      resetGame();
    }
    setConfirmState({ type: null, slot: null });
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="w-full max-w-2xl rounded-3xl flex flex-col overflow-hidden border shadow-2xl max-h-[90vh]"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3 text-amber-400">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">OFFLINE SAVE MANAGER</h2>
              <p className="text-[11px] text-amber-300 font-medium">
                Manage 3 offline save slots — local device only.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 mx-5 mt-4 rounded-2xl border text-xs font-black shadow-lg flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Custom Confirm Modal - No browser alert, no arena link */}
        {confirmState.type && (
          <div className="mx-5 mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
            <p className="text-xs font-black text-amber-300">
              {confirmState.type === 'delete'
                ? `Permanently delete Save Slot ${confirmState.slot}? This cannot be undone.`
                : `Restore Slot ${confirmState.slot} from backup? Current data will be overwritten.`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmState({ type: null, slot: null })}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => (confirmState.type === 'delete' ? confirmDelete() : confirmRestore())}
                className={`px-4 py-2 rounded-xl font-black text-xs cursor-pointer ${
                  confirmState.type === 'delete'
                    ? 'bg-rose-500 text-white hover:bg-rose-400'
                    : 'bg-amber-400 text-black hover:bg-amber-300'
                }`}
              >
                {confirmState.type === 'delete' ? 'Delete' : 'Restore'}
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Save Slots List - 3 Offline Slots */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-gray-300 uppercase tracking-wider text-[11px]">
              Offline Save Slots (1 - 3)
            </h4>

            {summaries.map((summary) => {
              const isActive = settings.activeSlot === summary.slotNumber;
              const isEditing = editingSlot === summary.slotNumber;

              return (
                <div
                  key={summary.slotNumber}
                  className={`p-4 rounded-3xl border transition-all space-y-3 ${
                    isActive
                      ? 'border-amber-400 bg-amber-500/10 shadow-lg'
                      : 'border-white/10 bg-black/40 hover:bg-black/60'
                  }`}
                >
                  {/* Slot Title Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black text-[10px]">
                        SLOT {summary.slotNumber}
                      </span>

                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={renameTitle}
                            onChange={(e) => setRenameTitle(e.target.value)}
                            className="bg-gray-900 border border-amber-400 rounded-lg px-2 py-1 text-xs text-white font-bold"
                          />
                          <button
                            onClick={() => handleSaveRename(summary.slotNumber)}
                            className="p-1 rounded bg-emerald-500 text-black cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-black text-white">{summary.customTitle}</h3>
                          <button
                            onClick={() => handleStartRename(summary)}
                            className="p-1 text-gray-400 hover:text-amber-300 cursor-pointer"
                            title="Rename Slot"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black uppercase flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          ACTIVE SLOT
                        </span>
                      )}

                      {summary.hasBackup && (
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold">
                          Backup Ready
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Slot Details Preview */}
                  {summary.hasData ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-black/60 border border-white/5 text-[11px]">
                      <div className="flex items-center gap-2">
                        <img
                          src={summary.avatarUrl}
                          alt="Actor Avatar"
                          className="w-9 h-9 rounded-xl object-cover border border-amber-400/30"
                        />
                        <div>
                          <strong className="text-white block font-bold text-xs truncate max-w-[100px]">
                            {summary.playerName}
                          </strong>
                          <span className="text-amber-300 text-[10px] font-bold">{summary.fameLevel}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400 block font-bold text-[9px] uppercase">Timeline</span>
                        <span className="text-white font-mono font-bold">
                          Year {summary.year} • Wk {summary.week}
                        </span>
                        <span className="text-gray-500 text-[9px] block">Saved: {summary.lastSavedAt.slice(0, 10)}</span>
                      </div>

                      <div>
                        <span className="text-gray-400 block font-bold text-[9px] uppercase">Net Worth</span>
                        <span className="text-emerald-400 font-bold">${summary.netWorth.toLocaleString()}</span>
                        <span className="text-gray-400 text-[9px] block">
                          Movies: {summary.moviesCompleted} | Awards: {summary.awardsWon}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-400 block font-bold text-[9px] uppercase">Active Feature</span>
                        <span className="text-sky-300 font-bold truncate block">{summary.currentMovie}</span>
                        <span className="text-gray-400 text-[9px] block truncate">{summary.currentStudio}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center text-gray-500 font-bold italic text-xs">
                      Empty Save Slot — Select "Save Progress" or "Switch" to initialize.
                    </div>
                  )}

                  {/* Actions Toolbar - Offline Only */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {!isActive && (
                      <button
                        onClick={() => handleSwitchSlot(summary.slotNumber)}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 text-black font-black text-xs hover:scale-102 transition-all cursor-pointer shadow"
                      >
                        Switch to Slot {summary.slotNumber}
                      </button>
                    )}

                    <button
                      onClick={() => handleManualSaveToSlot(summary.slotNumber)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-emerald-400" />
                      Save Current State
                    </button>

                    {summary.hasBackup && (
                      <button
                        onClick={() => handleRestoreBackup(summary.slotNumber)}
                        className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                        Restore Backup
                      </button>
                    )}

                    {summary.hasData && (
                      <button
                        onClick={() => handleDeleteSlot(summary.slotNumber)}
                        className="ml-auto px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        Clear Slot
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};