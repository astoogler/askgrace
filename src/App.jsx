import { useState, useEffect, useCallback } from 'react';
import { trackSessionStart, trackScreen, trackFeature } from './utils/analytics';
import { useAuth } from './contexts/AuthContext';
import { useSettings } from './hooks/useSettings';
import { useEmergency } from './hooks/useEmergency';
import { useChat } from './hooks/useChat';
import { useReminders } from './hooks/useReminders';
import { useVoice } from './hooks/useVoice';
import { useGuestGate } from './hooks/useGuestGate';

import Header from './components/layout/Header';
import EmergencyBar from './components/layout/EmergencyBar';
import NavTabs from './components/layout/NavTabs';
import EmergencyModal from './components/shared/EmergencyModal';
import SignupGate from './components/auth/SignupGate';
import AuthScreen from './components/auth/AuthScreen';

import HomeScreen from './components/home/HomeScreen';
import ChatScreen from './components/chat/ChatScreen';
import RemindersScreen from './components/reminders/RemindersScreen';
import SettingsScreen from './components/settings/SettingsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);

  const {
    user, session, loading: authLoading,
    isAuthenticated, signInWithOAuth, signInWithEmail, signUpWithEmail, signOut,
  } = useAuth();

  const userId = user?.id || null;
  const accessToken = session?.access_token || null;
  // Ensure anon ID exists immediately (analytics.js also creates it, but after first render)
  const anonId = (() => {
    let id = localStorage.getItem('agrace_anon_id');
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('agrace_anon_id', id);
    }
    return id;
  })();
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || null;
  const firstName = fullName ? fullName.split(' ')[0] : null;

  const { settings, updateSettings } = useSettings(userId);
  const emergency = useEmergency(settings.caregiverName, settings.caregiverPhone);
  const gate = useGuestGate(isAuthenticated);

  const {
    listening, startListening, stopListening, speak, cancelSpeech,
    isSupported: micSupported,
  } = useVoice(settings.language);

  const chat = useChat({
    onEmergency: emergency.open,
    speak,
    voiceResponse: settings.voiceResponse,
    accessToken,
    anonId,
    onGateTriggered: gate.triggerGate,
  });

  const reminders = useReminders(userId);

  // Track session start
  useEffect(() => {
    trackSessionStart();
  }, []);

  // Track screen changes
  useEffect(() => {
    const screen = showSettings ? 'settings' : showAuthScreen ? 'auth' : activeTab;
    trackScreen(screen);
  }, [activeTab, showSettings, showAuthScreen]);

  // Close auth screen + gate when user signs in
  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthScreen(false);
      gate.clearGate();
    }
  }, [isAuthenticated, gate]);

  const handleTabChange = useCallback((tab) => {
    setShowSettings(false);
    setShowAuthScreen(false);
    setActiveTab(tab);
  }, []);

  const handleMicToggle = useCallback(
    (onTranscript) => {
      if (listening) {
        stopListening();
      } else {
        startListening(onTranscript);
        trackFeature('voice_input');
      }
    },
    [listening, startListening, stopListening]
  );

  const handleOAuth = useCallback(async (provider) => {
    try { await signInWithOAuth(provider); } catch { /* AuthContext handles errors */ }
  }, [signInWithOAuth]);

  const handleSignIn = useCallback(async (email, pw) => {
    await signInWithEmail(email, pw);
  }, [signInWithEmail]);

  const handleSignUp = useCallback(async (email, pw, name) => {
    await signUpWithEmail(email, pw, name);
  }, [signUpWithEmail]);

  // Show loading state while auth initializes
  if (authLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100dvh', fontFamily: 'var(--font-heading)', color: 'var(--forest)',
        fontSize: '1.3em',
      }}>
        <span>Loading Ask Grace...</span>
      </div>
    );
  }

  // Full-screen auth page
  if (showAuthScreen) {
    return (
      <>
        <Header
          onSettingsTap={() => setShowSettings(true)}
          isAuthenticated={isAuthenticated}
          userName={firstName}
          onSignInTap={() => setShowAuthScreen(true)}
        />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <AuthScreen
            onOAuth={handleOAuth}
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onSkip={() => setShowAuthScreen(false)}
            loading={authLoading}
          />
        </main>
      </>
    );
  }

  const renderScreen = () => {
    if (showSettings) {
      return (
        <SettingsScreen
          settings={settings}
          updateSettings={updateSettings}
          onBack={() => setShowSettings(false)}
          isAuthenticated={isAuthenticated}
          userId={userId}
          userEmail={user?.email}
          onSignOut={signOut}
        />
      );
    }

    switch (activeTab) {
      case 'chat':
        return (
          <ChatScreen
            messages={chat.messages}
            loading={chat.loading}
            sendMessage={chat.sendMessage}
            scrollRef={chat.scrollRef}
            listening={listening}
            onMicToggle={handleMicToggle}
            micSupported={micSupported}
          />
        );
      case 'reminders':
        return (
          <RemindersScreen
            reminders={reminders.reminders}
            toggleDone={reminders.toggleDone}
            addReminder={reminders.addReminder}
            deleteReminder={reminders.deleteReminder}
            resetDaily={reminders.resetDaily}
            stats={reminders.stats}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            reminders={reminders.reminders}
            onNavigate={handleTabChange}
            caregiverPhone={settings.caregiverPhone}
            firstName={firstName}
            isAuthenticated={isAuthenticated}
            onSignInTap={() => setShowAuthScreen(true)}
          />
        );
    }
  };

  return (
    <>
      <Header
        onSettingsTap={() => setShowSettings(true)}
        isAuthenticated={isAuthenticated}
        userName={firstName}
        onSignInTap={() => setShowAuthScreen(true)}
      />
      {settings.familyAlerts && <EmergencyBar onTap={emergency.open} />}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {renderScreen()}
      </main>

      {!showSettings && <NavTabs activeTab={activeTab} onTabChange={handleTabChange} />}

      {emergency.isOpen && (
        <EmergencyModal
          countdown={emergency.countdown}
          caregiverName={settings.caregiverName}
          caregiverPhone={settings.caregiverPhone}
          onCancel={emergency.cancel}
        />
      )}

      {gate.isGateActive && (
        <SignupGate
          onOAuth={handleOAuth}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onDismiss={gate.dismissGate}
          loading={authLoading}
        />
      )}
    </>
  );
}
