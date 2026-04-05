import PropTypes from 'prop-types';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    backgroundColor: 'var(--red)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-xl)',
    color: 'white',
    textAlign: 'center',
  },
  icon: {
    fontSize: '4rem',
    marginBottom: 'var(--space-lg)',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2em',
    fontWeight: 700,
    marginBottom: 'var(--space-md)',
  },
  contactInfo: {
    fontSize: '1.2em',
    marginBottom: 'var(--space-lg)',
    opacity: 0.95,
  },
  countdown: {
    fontSize: '4em',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    marginBottom: 'var(--space-sm)',
    lineHeight: 1,
  },
  countdownLabel: {
    fontSize: '1em',
    opacity: 0.9,
    marginBottom: 'var(--space-xl)',
  },
  callBtn: {
    backgroundColor: 'white',
    color: 'var(--red)',
    fontWeight: 700,
    fontSize: '1.1em',
    padding: 'var(--space-md) var(--space-2xl)',
    borderRadius: 'var(--radius-full)',
    minWidth: 280,
    minHeight: 70,
    boxShadow: 'var(--shadow-lg)',
    marginBottom: 'var(--space-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  },
  call911Btn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    fontWeight: 700,
    fontSize: '1em',
    padding: 'var(--space-sm) var(--space-xl)',
    borderRadius: 'var(--radius-full)',
    minWidth: 220,
    minHeight: 60,
    border: '2px solid white',
    marginBottom: 'var(--space-xl)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    fontWeight: 600,
    fontSize: '1.1em',
    padding: 'var(--space-md) var(--space-2xl)',
    borderRadius: 'var(--radius-full)',
    minWidth: 280,
    minHeight: 70,
    border: '2px solid rgba(255,255,255,0.5)',
  },
};

export default function EmergencyModal({ countdown, caregiverName, caregiverPhone, onCancel }) {
  const name = caregiverName || 'Emergency Services';
  const phone = caregiverPhone || '911';
  // Clean phone for tel: link — strip non-digit characters
  const telPhone = phone.replace(/\D/g, '') || '911';

  return (
    <div style={styles.overlay} role="alertdialog" aria-label="Emergency alert">
      <div style={styles.icon}>🚨</div>
      <h1 style={styles.title}>Emergency Help</h1>

      <div style={styles.countdown} aria-live="assertive">
        {countdown}
      </div>
      <p style={styles.countdownLabel}>seconds — tap a button below or wait</p>

      {caregiverPhone && (
        <a
          href={`tel:${telPhone}`}
          style={styles.callBtn}
          aria-label={`Call ${name} now`}
          onClick={() => onCancel()}
        >
          📞 Call {name}
        </a>
      )}

      <a
        href="tel:911"
        style={styles.call911Btn}
        aria-label="Call 911"
        onClick={() => onCancel()}
      >
        🚑 Call 911
      </a>

      <button
        style={styles.cancelBtn}
        onClick={onCancel}
        aria-label="Cancel — I'm okay"
        autoFocus
      >
        Cancel — I'm Okay
      </button>
    </div>
  );
}

EmergencyModal.propTypes = {
  countdown: PropTypes.number.isRequired,
  caregiverName: PropTypes.string,
  caregiverPhone: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
};
