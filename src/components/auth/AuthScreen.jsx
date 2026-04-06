import PropTypes from 'prop-types';
import OAuthButtons from './OAuthButtons';
import EmailPasswordForm from './EmailPasswordForm';

const styles = {
  container: {
    flex: 1,
    overflowY: 'auto',
    padding: 'var(--space-xl) var(--space-lg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  brand: {
    textAlign: 'center',
    marginBottom: 'var(--space-xl)',
    marginTop: 'var(--space-xl)',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2em',
    fontWeight: 700,
  },
  titleAsk: {
    color: 'var(--forest)',
  },
  titleGrace: {
    color: 'var(--brown-light)',
  },
  tagline: {
    color: 'var(--slate)',
    fontSize: '0.9em',
    marginTop: 'var(--space-xs)',
  },
  formWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    margin: 'var(--space-lg) 0',
    color: 'var(--slate-light)',
    fontSize: '0.8em',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'var(--tan)',
  },
  skip: {
    textAlign: 'center',
    marginTop: 'var(--space-xl)',
  },
  skipBtn: {
    color: 'var(--slate-light)',
    fontSize: '0.85em',
    minHeight: 44,
    cursor: 'pointer',
  },
};

export default function AuthScreen({ onOAuth, onSignIn, onSignUp, onSkip, loading }) {
  return (
    <div style={styles.container}>
      <div style={styles.brand}>
        <h1 style={styles.title}>
          <span style={styles.titleAsk}>Ask </span>
          <span style={styles.titleGrace}>Grace</span>
        </h1>
        <p style={styles.tagline}>Your trusted companion</p>
      </div>

      <div style={styles.formWrapper}>
        <OAuthButtons onOAuth={onOAuth} disabled={loading} />

        <EmailPasswordForm
          onSignIn={onSignIn}
          onSignUp={onSignUp}
          disabled={loading}
        />
      </div>

      {onSkip && (
        <div style={styles.skip}>
          <button style={styles.skipBtn} onClick={onSkip} aria-label="Continue without account">
            Continue without an account
          </button>
        </div>
      )}
    </div>
  );
}

AuthScreen.propTypes = {
  onOAuth: PropTypes.func.isRequired,
  onSignIn: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
  onSkip: PropTypes.func,
  loading: PropTypes.bool,
};
