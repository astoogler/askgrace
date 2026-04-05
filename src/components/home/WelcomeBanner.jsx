import PropTypes from 'prop-types';
import { DAILY_TIPS } from '../../constants/topics';

// Rotate tip based on day of year
function getTodayTip() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}

function getGreeting(firstName) {
  const hour = new Date().getHours();
  let timeOfDay;
  if (hour < 12) timeOfDay = 'Good Morning';
  else if (hour < 17) timeOfDay = 'Good Afternoon';
  else timeOfDay = 'Good Evening';

  return firstName ? `${timeOfDay}, ${firstName}` : timeOfDay;
}

function getDateString() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const styles = {
  banner: {
    background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 100%)',
    color: 'white',
    padding: 'var(--space-lg)',
    borderRadius: 'var(--radius-lg)',
    margin: 'var(--space-md)',
  },
  greeting: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.4em',
    fontWeight: 700,
    marginBottom: 'var(--space-xs)',
  },
  date: {
    fontSize: '0.85em',
    opacity: 0.9,
    marginBottom: 'var(--space-md)',
  },
  tipLabel: {
    fontSize: '0.7em',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    opacity: 0.8,
    marginBottom: 'var(--space-xs)',
  },
  tip: {
    fontSize: '0.9em',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
};

export default function WelcomeBanner({ firstName }) {
  return (
    <div style={styles.banner}>
      <h2 style={styles.greeting}>{getGreeting(firstName)} 👋</h2>
      <p style={styles.date}>{getDateString()}</p>
      <p style={styles.tipLabel}>Daily Tip</p>
      <p style={styles.tip}>{getTodayTip()}</p>
    </div>
  );
}

WelcomeBanner.propTypes = {
  firstName: PropTypes.string,
};
