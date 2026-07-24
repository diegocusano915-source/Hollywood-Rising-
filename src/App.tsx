/**
 * HOLLYWOOD RISING - Main Application Router & Screen Orchestrator
 * Pure Clean Architecture, Riverpod state context, Hive storage, Phase 1 Grounded Aesthetics.
 */

import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { SplashScreen } from './components/screens/SplashScreen';
import { MainMenuScreen } from './components/screens/MainMenuScreen';
import { CharacterCreationScreen } from './components/screens/CharacterCreationScreen';
import { GameHomeScreen } from './components/screens/GameHomeScreen';

// Modals
import { CallboardModal } from './components/modals/CallboardModal';
import { AuditionsModal } from './components/modals/AuditionsModal';
import { BookingModal } from './components/modals/BookingModal';
import { ReleasesModal } from './components/modals/ReleasesModal';
import { InboxModal } from './components/modals/InboxModal';
import { MembershipModal } from './components/modals/MembershipModal';
import { RelationshipsModal } from './components/modals/RelationshipsModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { HowToPlayModal } from './components/modals/HowToPlayModal';

// Footer Modals
import {
  AboutModal,
  SupportModal,
  ContactModal,
  DisclaimerModal,
  CreditsModal,
} from './components/modals/FooterModals';

const AppContent: React.FC = () => {
  const { currentScreen, activeModal } = useGame();

  return (
    <DeviceFrame>
      {/* Screen Router */}
      {currentScreen === 'splash' && <SplashScreen />}
      {currentScreen === 'main_menu' && <MainMenuScreen />}
      {currentScreen === 'character_creation' && <CharacterCreationScreen />}
      {currentScreen === 'game_home' && <GameHomeScreen />}

      {/* Modal Manager */}
      {activeModal === 'callboard' && <CallboardModal />}
      {activeModal === 'auditions' && <AuditionsModal />}
      {activeModal === 'booking' && <BookingModal />}
      {activeModal === 'releases' && <ReleasesModal />}
      {activeModal === 'inbox' && <InboxModal />}
      {activeModal === 'membership' && <MembershipModal />}
      {activeModal === 'relationships' && <RelationshipsModal />}
      {activeModal === 'settings' && <SettingsModal />}
      {activeModal === 'how_to_play' && <HowToPlayModal />}

      {/* Footer Modals */}
      {activeModal === 'about' && <AboutModal />}
      {activeModal === 'support' && <SupportModal />}
      {activeModal === 'contact' && <ContactModal />}
      {activeModal === 'disclaimer' && <DisclaimerModal />}
      {activeModal === 'credits' && <CreditsModal />}
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
