import PropTypes from 'prop-types';
import { trackFeature } from '../../utils/analytics';

const ACTIONS = [
  {
    id: 'chat',
    icon: '💬',
    label: 'Chat with Grace',
    sub: 'Ask anything',
    color: 'var(--forest-pale)',
    iconColor: 'var(--forest)',
    requiresAuth: false,
  },
  {
    id: 'medications',
    icon: '💊',
    label: 'Medications',
    sub: 'View reminders',
    color: 'var(--red-light)',
    iconColor: 'var(--red)',
    requiresAuth: true,
  },
  {
    id: 'call_family',
    icon: '📞',
    label: 'Call Family',
    sub: 'Stay connected',
    color: 'var(--amber-light)',
    iconColor: 'var(--amber)',
    requiresAuth: true,
  },
  {
    id: 'schedule',
    icon: '📅',
    label: 'My Schedule',
    sub: "Today's plan",
    color: '#e8e0f4',
    iconColor: '#6b46c1',
    requiresAuth: true,
  },
];

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-md)',
    padding: '0 var(--space-md)',
  },
  card: (locked) => ({
    backgroundColor: 'white',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 'var(--space-sm)',
    minHeight: 120,
    justifyContent: 'center',
    cursor: locked ? 'default' : 'pointer',
    opacity: locked ? 0.5 : 1,
  }),
  iconBadge: (bg) => ({
    width: 52,
    height: 52,
    borderRadius: 'var(--radius-md)',
    backgroundColor: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5em',
  }),
  label: {
    fontWeight: 600,
    fontSize: '0.85em',
  },
  sub: {
    fontSize: '0.7em',
    color: 'var(--slate-light)',
  },
  signupNote: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: 'var(--space-sm) var(--space-md)',
    fontSize: '0.8em',
    color: 'var(--slate)',
    lineHeight: 1.5,
  },
  signupLink: {
    color: 'var(--forest)',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'underline',
    background: 'none',
    border: 'none',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    padding: 0,
  },
};

export default function QuickActions({ onNavigate, caregiverPhone, isAuthenticated, onSignInTap }) {
  const handleTap = (action) => {
    if (action.requiresAuth && !isAuthenticated) return;

    trackFeature('quick_action', { action: action.id });

    if (action.id === 'chat') {
      onNavigate('chat');
    } else if (action.id === 'medications' || action.id === 'schedule') {
      onNavigate('reminders');
    } else if (action.id === 'call_family') {
      if (caregiverPhone) {
        const tel = caregiverPhone.replace(/\D/g, '');
        window.location.href = `tel:${tel}`;
      } else {
        alert('No family contact set. Add one in Settings → Emergency Contact.');
      }
    }
  };

  return (
    <div style={styles.grid}>
      {ACTIONS.map((action) => {
        const locked = action.requiresAuth && !isAuthenticated;
        return (
          <button
            key={action.id}
            style={styles.card(locked)}
            onClick={() => handleTap(action)}
            aria-label={locked ? `${action.label} — sign up to unlock` : `${action.label} — ${action.sub}`}
            disabled={locked}
          >
            <div style={styles.iconBadge(action.color)}>
              {action.icon}
            </div>
            <span style={styles.label}>{action.label}</span>
            <span style={styles.sub}>{locked ? 'Create account to unlock' : action.sub}</span>
          </button>
        );
      })}

      {!isAuthenticated && (
        <div style={styles.signupNote}>
          <button style={styles.signupLink} onClick={onSignInTap} aria-label="Create a free account">
            Create a free account
          </button>
          {' '}to unlock all features and save your data.
        </div>
      )}
    </div>
  );
}

QuickActions.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  caregiverPhone: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  onSignInTap: PropTypes.func,
};
