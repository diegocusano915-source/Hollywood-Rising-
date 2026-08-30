/**
 * HOLLYWOOD RISING - Main Application Router & Screen Orchestrator
 * Pure Clean Architecture, Riverpod state context, Hive storage, Phase 1 Grounded Aesthetics.
 */

import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { installOfflineImageInterceptor } from './services/assetManager';
import { DeviceFrame } from './components/common/DeviceFrame';
import { SplashScreen } from './components/screens/SplashScreen';
import { DisclaimerScreen } from './components/screens/DisclaimerScreen';
import { MainMenuScreen } from './components/screens/MainMenuScreen';
import { CharacterCreationScreen } from './components/screens/CharacterCreationScreen';
import { GameHomeScreen } from './components/screens/GameHomeScreen';

// Overlays & Weekly Recap
import { ProcessingWeekOverlay } from './components/common/ProcessingWeekOverlay';
import { WeeklyRecapModal } from './components/modals/WeeklyRecapModal';
import { AwardNightModal } from './components/modals/AwardNightModal';
import { TaxStatementModal } from './components/modals/TaxStatementModal';
import { ToastContainer } from './components/common/ToastContainer';

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
import { TrophyRoomModal } from './components/modals/TrophyRoomModal';
import { CareerTimelineModal } from './components/modals/CareerTimelineModal';
import { FycCampaignModal } from './components/modals/FycCampaignModal';

// Phase 4 New Modals
import { SaveManagerModal } from './components/modals/SaveManagerModal';
import { CareerStatsHubModal } from './components/modals/CareerStatsHubModal';
import { CompletionTrackerModal } from './components/modals/CompletionTrackerModal';
import { PhotoModeModal } from './components/modals/PhotoModeModal';
import { NotificationHistoryModal } from './components/modals/NotificationHistoryModal';
import { CareerHandbookModal } from './components/modals/CareerHandbookModal';
import { RetainerManagementModal } from './components/modals/RetainerManagementModal';

// Footer & Information Modals
import {
  AboutModal,
  SupportModal,
  ContactModal,
  DisclaimerModal,
  CreditsModal,
  ScrollingCreditsModal,
  RoadmapModal,
  ChangelogModal,
  HelpCenterModal,
  BugReportModal,
  PrivacyPolicyModal,
  TermsOfServiceModal,
  LicensesModal,
} from './components/modals/FooterModals';

import { ErrorBoundary } from './components/common/ErrorBoundary';

const AppContent: React.FC = () => {
  const { currentScreen, activeModal, isProcessingWeek, selectedFycMovieId, releasedMovies, awardCeremonyData, setAwardCeremonyData, taxStatementData, setTaxStatementData, setActiveModal, toasts, dismissToast } = useGame();

  // Invisible offline asset manager: every picture renders from the bundled
  // pack, never the network.
  useEffect(() => { installOfflineImageInterceptor(); }, []);

  const fycMovie = releasedMovies.find((m) => m.id === selectedFycMovieId) || releasedMovies[0];

  return (
    <DeviceFrame>
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Screen Router */}
      {currentScreen === 'splash' && <SplashScreen />}
      {currentScreen === 'disclaimer' && <DisclaimerScreen />}
      {currentScreen === 'main_menu' && <MainMenuScreen />}
      {currentScreen === 'character_creation' && <CharacterCreationScreen />}
      {currentScreen === 'game_home' && <GameHomeScreen />}

      {/* Overlays & Recap */}
      {isProcessingWeek && <ProcessingWeekOverlay />}
      {activeModal === 'weekly_recap' && <WeeklyRecapModal />}

      {/* Year-End Awards Night (Week 52) */}
      {activeModal === 'award_ceremony' && awardCeremonyData && (
        <AwardNightModal
          data={awardCeremonyData}
          onClose={() => {
            setAwardCeremonyData(null);
            setActiveModal('weekly_recap');
          }}
        />
      )}

      {/* Tax statements — popup ONLY on real month-close / year-filing events */}
      {taxStatementData && (
        <TaxStatementModal data={taxStatementData} onClose={() => setTaxStatementData(null)} />
      )}

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
      {activeModal === 'trophy_room' && <TrophyRoomModal />}
      {activeModal === 'career_timeline' && <CareerTimelineModal />}
      {activeModal === 'fyc_campaign' && fycMovie && (
        <FycCampaignModal movie={fycMovie} onClose={() => setActiveModal('none')} />
      )}

      {/* Phase 4 Active Modals */}
      {activeModal === 'save_manager' && <SaveManagerModal />}
      {activeModal === 'career_stats' && <CareerStatsHubModal />}
      {activeModal === 'completion_tracker' && <CompletionTrackerModal />}
      {activeModal === 'photo_mode' && <PhotoModeModal />}
      {activeModal === 'notification_history' && <NotificationHistoryModal />}
      {activeModal === 'help_center' && <CareerHandbookModal />}
      {activeModal === 'retainer_management' && <RetainerManagementModal />}

      {/* Footer & Information Modals */}
      {activeModal === 'about' && <AboutModal />}
      {activeModal === 'support' && <SupportModal />}
      {activeModal === 'contact' && <ContactModal />}
      {activeModal === 'disclaimer' && <DisclaimerModal />}
      {activeModal === 'credits' && <CreditsModal />}
      {activeModal === 'scrolling_credits' && <ScrollingCreditsModal />}
      {activeModal === 'roadmap' && <RoadmapModal />}
      {activeModal === 'changelog' && <ChangelogModal />}
      {activeModal === 'help_center' && <HelpCenterModal />}
      {activeModal === 'bug_report' && <BugReportModal />}
      {activeModal === 'privacy_policy' && <PrivacyPolicyModal />}
      {activeModal === 'terms_of_service' && <TermsOfServiceModal />}
      {activeModal === 'licenses' && <LicensesModal />}
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ErrorBoundary>
  );
}
