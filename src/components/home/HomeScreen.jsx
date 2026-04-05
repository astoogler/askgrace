import PropTypes from 'prop-types';
import WelcomeBanner from './WelcomeBanner';
import DailyShield from './DailyShield';
import QuickActions from './QuickActions';

const styles = {
  container: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 'var(--space-lg)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--space-lg) var(--space-md) var(--space-sm)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1em',
    fontWeight: 600,
    color: 'var(--brown-dark)',
  },
  viewAll: {
    color: 'var(--forest)',
    fontWeight: 600,
    fontSize: '0.85em',
    minWidth: 60,
    minHeight: 44,
    display: 'flex',
    alignItems: 'center',
  },
  reminderItem: (done) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-sm) var(--space-md)',
    opacity: done ? 0.5 : 1,
  }),
  reminderDot: (done) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: done ? 'var(--forest-light)' : 'var(--amber)',
    flexShrink: 0,
  }),
  reminderName: (done) => ({
    flex: 1,
    fontWeight: 500,
    fontSize: '0.9em',
    textDecoration: done ? 'line-through' : 'none',
  }),
  reminderTime: {
    fontSize: '0.75em',
    color: 'var(--slate-light)',
    whiteSpace: 'nowrap',
  },
};

export default function HomeScreen({ reminders, onNavigate, caregiverPhone, firstName, isAuthenticated, onSignInTap }) {
  const topReminders = reminders.slice(0, 3);

  return (
    <div style={styles.container}>
      <WelcomeBanner firstName={firstName} />
      <DailyShield />

      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
      </div>
      <QuickActions onNavigate={onNavigate} caregiverPhone={caregiverPhone} isAuthenticated={isAuthenticated} onSignInTap={onSignInTap} />

      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Today's Reminders</h3>
        <button
          style={styles.viewAll}
          onClick={() => onNavigate('reminders')}
          aria-label="View all reminders"
        >
          View All →
        </button>
      </div>

      {topReminders.map((r) => (
        <div key={r.id} style={styles.reminderItem(r.done)}>
          <span style={styles.reminderDot(r.done)} />
          <span style={styles.reminderName(r.done)}>{r.name}</span>
          <span style={styles.reminderTime}>{r.time}</span>
        </div>
      ))}

      {topReminders.length === 0 && (
        <p style={{ padding: 'var(--space-md)', color: 'var(--slate-light)', fontSize: '0.9em' }}>
          No reminders set yet. Tap "View All" to add some!
        </p>
      )}
    </div>
  );
}

HomeScreen.propTypes = {
  reminders: PropTypes.array.isRequired,
  onNavigate: PropTypes.func.isRequired,
  caregiverPhone: PropTypes.string,
  firstName: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  onSignInTap: PropTypes.func,
};
