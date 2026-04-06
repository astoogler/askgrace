import PropTypes from 'prop-types';
import OAuthButtons from './OAuthButtons';
import EmailPasswordForm from './EmailPasswordForm';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 500,
    backgroundColor: 'rgba(93, 74, 30, 0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'var(--warm-white)',
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
    width: '100%',
    maxWidth: 480,
    maxHeight: '85vh',
    overflowY: 'auto',
    padding: 'var(--space-xl) var(--space-lg)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 'var(--space-lg)',
  },
  icon: {
    fontSize: '2.5em',
    marginBottom: 'var(--space-sm)',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.3em',
    fontWeight: 700,
    color: 'var(--forest)',
    marginBottom: 'var(--space-sm)',
  },
  subtitle: {
    fontSize: '0.9em',
    color: 'var(--slate)',
    lineHeight: 1.5,
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
  dismiss: {
    textAlign: 'center',
    marginTop: 'var(--space-lg)',
  },
  dismissBtn: {
    color: 'var(--slate-light)',
    fontSize: '0.85em',
    minHeight: 44,
    cursor: 'pointer',
  },
};

export default function SignupGate({ onOAuth, onSignIn, onSignUp, onDismiss, loading }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.icon}>💬</div>
          <h2 style={styles.title}>Grace has more to share with you</h2>
          <p style={styles.subtitle}>
            Create a free account to keep chatting. It takes less than a minute.
            Your reminders and settings will be saved too.
          </p>
        </div>

        <OAuthButtons onOAuth={onOAuth} disabled={loading} />

        <EmailPasswordForm
          onSignIn={onSignIn}
          onSignUp={onSignUp}
          disabled={loading}
        />

        <div style={styles.dismiss}>
          <button style={styles.dismissBtn} onClick={onDismiss} aria-label="Maybe later">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

SignupGate.propTypes = {
  onOAuth: PropTypes.func.isRequired,
  onSignIn: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
