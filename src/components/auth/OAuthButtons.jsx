import PropTypes from 'prop-types';

// OAuth providers require configuration in the Supabase dashboard + developer consoles.
// Only show buttons for providers that are actually enabled.
// Set to true once you've configured each provider in Supabase → Authentication → Providers.
const ENABLED_PROVIDERS = {
  google: false,
  apple: false,
  azure: false,
};

const PROVIDERS = [
  { id: 'google', label: 'Sign in with Google', icon: 'G', bg: '#fff', color: 'var(--brown-dark)' },
  { id: 'apple', label: 'Sign in with Apple', icon: '\uF8FF', bg: '#000', color: '#fff' },
  { id: 'azure', label: 'Sign in with Microsoft', icon: '⊞', bg: '#2f2f2f', color: '#fff' },
];

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
  const activeProviders = PROVIDERS.filter((p) => ENABLED_PROVIDERS[p.id]);

  // Don't render anything if no OAuth providers are enabled
  if (activeProviders.length === 0) return null;

  return (
    <div>
      {activeProviders.map((p) => (
        <button
          key={p.id}
          style={styles.btn(p.bg, p.color)}
          onClick={() => onOAuth(p.id)}
          disabled={disabled}
          aria-label={p.label}
        >
          <span style={styles.icon}>{p.icon}</span>
          {p.label}
        </button>
      ))}
    </div>
  );
}

OAuthButtons.propTypes = {
  onOAuth: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
