import PropTypes from 'prop-types';

const styles = {
  btn: (bg, color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-md)',
    width: '100%',
    minHeight: 60,
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '0.95em',
    backgroundColor: bg,
    color,
    border: bg === '#fff' ? '2px solid var(--tan)' : 'none',
    marginBottom: 'var(--space-sm)',
    cursor: 'pointer',
  }),
  icon: {
    fontSize: '1.3em',
  },
};

export default function OAuthButtons({ onOAuth, disabled }) {
  return (
    <div>
      <button
        style={styles.btn('#fff', 'var(--brown-dark)')}
        onClick={() => onOAuth('google')}
        disabled={disabled}
        aria-label="Sign in with Google"
      >
        <span style={styles.icon}>G</span>
        Sign in with Google
      </button>

      <button
        style={styles.btn('#000', '#fff')}
        onClick={() => onOAuth('apple')}
        disabled={disabled}
        aria-label="Sign in with Apple"
      >
        <span style={styles.icon}></span>
        Sign in with Apple
      </button>

      <button
        style={styles.btn('#2f2f2f', '#fff')}
        onClick={() => onOAuth('azure')}
        disabled={disabled}
        aria-label="Sign in with Microsoft"
      >
        <span style={styles.icon}>⊞</span>
        Sign in with Microsoft
      </button>
    </div>
  );
}

OAuthButtons.propTypes = {
  onOAuth: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
