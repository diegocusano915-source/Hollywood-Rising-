/**
 * HOLLYWOOD RISING - Save Slot & Data Manager
 * 5 Save Slots, Manual Save, Backup & Restore, Rename, Delete, Save Preview, Import & Export.
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
  Download,
  Upload,
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

  // Import state
  const [importText, setImportText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [selectedImportSlot, setSelectedImportSlot] = useState<number>(settings.activeSlot || 1);

  const refreshSummaries = () => {
    setSummaries(StorageService.getSaveSlotSummaries());
  };

  useEffect(() => {
    refreshSummaries();
  }, []);

  const handleManualSaveToSlot = (slotNum: number) => {
    StorageService.saveGameData(saveData, slotNum);
    setFeedback({ type: 'success', msg: `Game saved successfully to Save Slot ${slotNum}!` });
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
    if (confirm(`Are you sure you want to restore Slot ${slotNum} from its previous backup? Current unsaved data in Slot ${slotNum} will be overwritten.`)) {
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
      setTimeout(() => setFeedback(null), 3500);
    }
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
    if (confirm(`CRITICAL WARNING: Are you sure you want to permanently delete Save Slot ${slotNum}? This action CANNOT be undone.`)) {
      StorageService.deleteSaveData(slotNum);
      setFeedback({ type: 'error', msg: `Save Slot ${slotNum} deleted.` });
      refreshSummaries();
      if (settings.activeSlot === slotNum) {
        resetGame();
      }
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleExportJson = (slotNum: number) => {
    const json = StorageService.exportSaveToJson(slotNum);
    if (!json) {
      setFeedback({ type: 'error', msg: `Slot ${slotNum} is empty. Nothing to export.` });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    // Download file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hollywood_rising_slot${slotNum}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedback({ type: 'success', msg: `Slot ${slotNum} JSON save file exported successfully!` });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleImportJson = () => {
    if (!importText.trim()) {
      setFeedback({ type: 'error', msg: 'Please paste raw JSON save data or select a valid JSON save file.' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const res = StorageService.importSaveFromJson(importText, selectedImportSlot);
    if (res.success) {
      setFeedback({ type: 'success', msg: res.message });
      setImportText('');
      setShowImportBox(false);
      refreshSummaries();
      if (settings.activeSlot === selectedImportSlot) {
        switchSaveSlot(selectedImportSlot);
      }
    } else {
      setFeedback({ type: 'error', msg: res.message });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
      }
    };
    reader.readAsText(file);
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
              <h2 className="text-lg font-black text-white uppercase tracking-wider">SAVE MANAGER & CLOUD EXPORT</h2>
              <p className="text-[11px] text-amber-300 font-medium">
                Manage 5 save slots, manual saves, backups, and save files.
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quick Import Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <div>
                <strong className="text-white block text-xs">Import Save File (JSON)</strong>
                <span className="text-[10px] text-gray-400">Restore or transfer save files across devices</span>
              </div>
            </div>
            <button
              onClick={() => setShowImportBox(!showImportBox)}
              className="px-4 py-2 rounded-xl bg-amber-400 text-black font-black text-xs hover:scale-102 transition-all cursor-pointer shadow"
            >
              {showImportBox ? 'Hide Import Box' : 'Open Import Tools'}
            </button>
          </div>

          {/* Import Box */}
          {showImportBox && (
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">Target Save Slot for Import:</span>
                <select
                  value={selectedImportSlot}
                  onChange={(e) => setSelectedImportSlot(Number(e.target.value))}
                  className="bg-gray-900 text-white border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold"
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <option key={s} value={s}>
                      Slot {s} ({StorageService.getSlotTitle(s)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 mb-1 font-bold">Upload Save File (.json):</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-400 file:text-black hover:file:bg-amber-300 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 mb-1 font-bold">Or Paste Raw JSON String:</label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste SaveData JSON string here..."
                  rows={3}
                  className="w-full bg-black/80 text-amber-300 border border-white/10 rounded-xl p-2.5 font-mono text-[10px] focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={handleImportJson}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 transition-all cursor-pointer shadow flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Validate & Import Save to Slot {selectedImportSlot}
              </button>
            </div>
          )}

          {/* Save Slots List */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-gray-300 uppercase tracking-wider text-[11px]">
              Available Save Slots (1 - 5)
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

                  {/* Actions Toolbar */}
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

                    {summary.hasData && (
                      <button
                        onClick={() => handleExportJson(summary.slotNumber)}
                        className="px-3 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-sky-400" />
                        Export JSON
                      </button>
                    )}

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
