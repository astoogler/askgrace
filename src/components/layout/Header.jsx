import PropTypes from 'prop-types';
import { SettingsIcon } from '../shared/Icons';

const styles = {
  header: {
    backgroundColor: 'var(--forest)',
    padding: 'var(--space-md) var(--space-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.4em',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  titleAsk: {
    color: 'var(--cream)',
  },
  titleGrace: {
    color: 'var(--brown-light)',
  },
  subtitle: {
    color: 'var(--cream)',
    opacity: 0.75,
    fontSize: '0.7em',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  signInBtn: {
    color: 'var(--cream)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 'var(--space-xs) var(--space-md)',
    borderRadius: 'var(--radius-full)',
    fontWeight: 600,
    fontSize: '0.75em',
    minHeight: 40,
    whiteSpace: 'nowrap',
  },
  settingsBtn: {
    color: 'var(--cream)',
    minWidth: 60,
    minHeight: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-full)',
  },
};

export default function Header({ onSettingsTap, isAuthenticated, userName, onSignInTap }) {
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <h1 style={styles.title}>
          <span style={styles.titleAsk}>Ask </span>
          <span style={styles.titleGrace}>Grace</span>
        </h1>
        <span style={styles.subtitle}>
          {isAuthenticated && userName ? `Hi, ${userName}` : 'Your trusted companion'}
        </span>
      </div>
      <div style={styles.right}>
        {!isAuthenticated && (
          <button
            style={styles.signInBtn}
            onClick={onSignInTap}
            aria-label="Sign in"
          >
            Sign In
          </button>
        )}
        <button
          style={styles.settingsBtn}
          onClick={onSettingsTap}
          aria-label="Open settings"
        >
          <SettingsIcon size={28} />
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  onSettingsTap: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  userName: PropTypes.string,
  onSignInTap: PropTypes.func,
};
