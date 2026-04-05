import PropTypes from 'prop-types';
import FontSizeControl from './FontSizeControl';
import LanguageSelect from './LanguageSelect';
import EmergencyContactForm from './EmergencyContactForm';
import Toggle from '../shared/Toggle';

const styles = {
  container: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 'var(--space-2xl)',
  },
  section: {
    padding: 'var(--space-md) var(--space-lg)',
    borderBottom: '1px solid var(--parchment)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1em',
    fontWeight: 600,
    marginBottom: 'var(--space-md)',
    color: 'var(--brown-dark)',
  },
  about: {
    textAlign: 'center',
    padding: 'var(--space-xl) var(--space-lg)',
  },
  aboutName: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.5em',
    fontWeight: 700,
    color: 'var(--forest)',
    marginBottom: 'var(--space-xs)',
  },
  aboutTagline: {
    color: 'var(--slate)',
    fontSize: '0.85em',
    marginBottom: 'var(--space-md)',
  },
  aboutMeta: {
    fontSize: '0.75em',
    color: 'var(--slate-light)',
    lineHeight: 1.8,
  },
  disclaimer: {
    backgroundColor: 'var(--amber-light)',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-md)',
    margin: 'var(--space-md) 0',
    fontSize: '0.8em',
    lineHeight: 1.5,
    color: 'var(--brown-dark)',
  },
  privacy: {
    backgroundColor: 'var(--forest-pale)',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.8em',
    lineHeight: 1.5,
    color: 'var(--forest)',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-md) var(--space-lg)',
    fontWeight: 600,
    color: 'var(--forest)',
    fontSize: '0.95em',
    minHeight: 60,
  },
};

const signOutBtnStyle = {
  width: '100%',
  padding: 'var(--space-md)',
  backgroundColor: 'var(--red-light)',
  color: 'var(--red)',
  fontWeight: 700,
  borderRadius: 'var(--radius-md)',
  fontSize: '1em',
  minHeight: 60,
};

export default function SettingsScreen({ settings, updateSettings, onBack, isAuthenticated, userEmail, onSignOut }) {
  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={onBack} aria-label="Go back">
        ← Settings
      </button>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Text Size</h3>
        <FontSizeControl
          value={settings.fontSize}
          onChange={(size) => updateSettings({ fontSize: size })}
        />
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Language</h3>
        <LanguageSelect
          value={settings.language}
          onChange={(lang) => updateSettings({ language: lang })}
        />
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Safety & Alerts</h3>
        <Toggle
          label="Emergency button"
          checked={settings.familyAlerts}
          onChange={(v) => updateSettings({ familyAlerts: v })}
          ariaLabel="Toggle emergency button"
        />
        <p style={{ fontSize: '0.7em', color: 'var(--slate-light)', marginTop: -8, marginBottom: 'var(--space-sm)' }}>
          Show the emergency help bar at the top of the screen.
        </p>
        <Toggle
          label="Voice responses"
          checked={settings.voiceResponse}
          onChange={(v) => updateSettings({ voiceResponse: v })}
          ariaLabel="Toggle voice responses"
        />
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Emergency Contact</h3>
        <EmergencyContactForm
          name={settings.caregiverName}
          phone={settings.caregiverPhone}
          onSave={(name, phone) => updateSettings({ caregiverName: name, caregiverPhone: phone })}
        />
      </div>

      {isAuthenticated && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Account</h3>
          <p style={{ fontSize: '0.85em', color: 'var(--slate)', marginBottom: 'var(--space-md)' }}>
            Signed in as {userEmail}
          </p>
          <button style={signOutBtnStyle} onClick={onSignOut} aria-label="Sign out">
            Sign Out
          </button>
        </div>
      )}

      <div style={styles.about}>
        <h3 style={styles.aboutName}>Ask Grace</h3>
        <p style={styles.aboutTagline}>
          Your trusted companion for healthy, independent living
        </p>
        <p style={styles.aboutMeta}>
          Version {import.meta.env.VITE_APP_VERSION || '1.0.0-mvp'}<br />
          {import.meta.env.VITE_APP_DOMAIN || 'askgrace.org'}
        </p>
        <div style={styles.disclaimer}>
          Grace is not a doctor, nurse, lawyer, or financial advisor.
          Always check with a qualified professional before making health or
          financial decisions.
        </div>
        <div style={styles.privacy}>
          Your conversations are private. Ask Grace does not sell
          your personal information.
        </div>
      </div>
    </div>
  );
}

SettingsScreen.propTypes = {
  settings: PropTypes.object.isRequired,
  updateSettings: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  userEmail: PropTypes.string,
  onSignOut: PropTypes.func,
};
