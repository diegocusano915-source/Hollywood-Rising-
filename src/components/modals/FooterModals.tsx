/**
 * HOLLYWOOD RISING - Main Menu Footer Information Modals
 * About, Support, Contact, Disclaimer, Credits
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { X, Info, LifeBuoy, Mail, ShieldAlert, Award } from 'lucide-react';
import { THEMES } from '../../theme/colors';

const BaseFooterModal: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  const { setActiveModal, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md rounded-2xl flex flex-col overflow-hidden border shadow-2xl"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        <div
          className="p-4 flex items-center justify-between border-b"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-2 text-amber-400">
            {icon}
            <h2 className="text-base font-bold text-white uppercase tracking-wider">{title}</h2>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs text-gray-300 leading-relaxed overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AboutModal: React.FC = () => (
  <BaseFooterModal title="About Hollywood Rising" icon={<Info className="w-5 h-5" />}>
    <p className="font-bold text-white text-sm">Hollywood Rising - Phase 1 Foundation</p>
    <p>
      Hollywood Rising is a premier film industry career simulator. Step into the shoes of an ambitious newcomer in Los Angeles, navigate real casting callboards, manage energy, undergo auditions, wrap productions, and achieve SAG-AFTRA guild stardom.
    </p>
    <p className="text-gray-400">Version 1.0.0 (Grounded Pure Architecture)</p>
  </BaseFooterModal>
);

export const SupportModal: React.FC = () => (
  <BaseFooterModal title="Game Support" icon={<LifeBuoy className="w-5 h-5" />}>
    <p className="font-bold text-white text-sm">Help & Troubleshooting</p>
    <p>
      If you experience issues with your save data or gameplay loop, you can reset your active save slot anytime in Settings.
    </p>
    <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
      <span className="text-amber-400 font-bold block">Support Email</span>
      <span className="text-white font-mono">support@hollywoodrising.game</span>
    </div>
  </BaseFooterModal>
);

export const ContactModal: React.FC = () => (
  <BaseFooterModal title="Contact Us" icon={<Mail className="w-5 h-5" />}>
    <p className="font-bold text-white text-sm">Hollywood Studio Contact</p>
    <p>
      Have suggestions, feedback, or media inquiries? Reach out directly to our production team.
    </p>
    <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
      <span className="text-amber-400 font-bold block">Studio Relations</span>
      <span className="text-white font-mono">contact@hollywoodrising.game</span>
    </div>
  </BaseFooterModal>
);

export const DisclaimerModal: React.FC = () => (
  <BaseFooterModal title="Legal Disclaimer" icon={<ShieldAlert className="w-5 h-5" />}>
    <p className="font-bold text-white text-sm">Simulation Disclaimer</p>
    <p>
      Hollywood Rising is a fictional simulation game. All movie names, production companies, characters, and events depicted are entirely fictional or used fictitiously. SAG-AFTRA references are strictly for immersive career gameplay modeling.
    </p>
  </BaseFooterModal>
);

export const CreditsModal: React.FC = () => (
  <BaseFooterModal title="Game Credits" icon={<Award className="w-5 h-5" />}>
    <p className="font-bold text-white text-sm">Hollywood Rising Team</p>
    <ul className="space-y-2">
      <li className="flex justify-between border-b border-white/5 pb-1">
        <span>Game Director & Architecture</span>
        <strong className="text-amber-400">DeepMind & Google AI Studio</strong>
      </li>
      <li className="flex justify-between border-b border-white/5 pb-1">
        <span>Lead Game Designer</span>
        <strong className="text-white">Hollywood Rising Design Team</strong>
      </li>
      <li className="flex justify-between border-b border-white/5 pb-1">
        <span>Audio & Sound Effects</span>
        <strong className="text-white">Synthesizer Sound System</strong>
      </li>
    </ul>
  </BaseFooterModal>
);
