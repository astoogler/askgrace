import { useState } from 'react';
import PropTypes from 'prop-types';
import ReminderCard from './ReminderCard';
import AddReminderModal from './AddReminderModal';
import { PlusIcon } from '../shared/Icons';

const styles = {
  container: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 'var(--space-lg)',
  },
  dateHeader: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1em',
    fontWeight: 600,
    padding: 'var(--space-lg) var(--space-md) var(--space-sm)',
    color: 'var(--brown-dark)',
  },
  statsRow: {
    display: 'flex',
    gap: 'var(--space-sm)',
    padding: '0 var(--space-md)',
    marginBottom: 'var(--space-md)',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm) var(--space-md)',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)',
  },
  statNumber: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.4em',
    fontWeight: 700,
    color: 'var(--forest)',
  },
  statLabel: {
    fontSize: '0.65em',
    color: 'var(--slate-light)',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    margin: 'var(--space-md)',
    padding: 'var(--space-md)',
    backgroundColor: 'var(--forest)',
    color: 'white',
    fontWeight: 700,
    borderRadius: 'var(--radius-md)',
    width: 'calc(100% - 2 * var(--space-md))',
    minHeight: 60,
    fontSize: '1em',
  },
};

export default function RemindersScreen({ reminders, toggleDone, addReminder, deleteReminder, resetDaily, stats }) {
  const [showModal, setShowModal] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.dateHeader}>{today}</h2>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.medicationsTaken}</div>
          <div style={styles.statLabel}>Meds Taken</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.appointments}</div>
          <div style={styles.statLabel}>Appointments</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.calls}</div>
          <div style={styles.statLabel}>Calls</div>
        </div>
      </div>

      {reminders.map((r) => (
        <ReminderCard
          key={r.id}
          reminder={r}
          onToggle={toggleDone}
          onDelete={deleteReminder}
        />
      ))}

      <button
        style={styles.addBtn}
        onClick={() => setShowModal(true)}
        aria-label="Add new reminder"
      >
        <PlusIcon size={22} />
        Add Reminder
      </button>

      {/* Dev-only reset button */}
      {import.meta.env.DEV && (
        <button
          onClick={resetDaily}
          style={{
            margin: 'var(--space-md)',
            padding: 'var(--space-sm)',
            fontSize: '0.75em',
            color: 'var(--slate-light)',
            textDecoration: 'underline',
          }}
          aria-label="Reset all reminders (development only)"
        >
          Reset Daily (Dev)
        </button>
      )}

      {showModal && (
        <AddReminderModal
          onSave={addReminder}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

RemindersScreen.propTypes = {
  reminders: PropTypes.array.isRequired,
  toggleDone: PropTypes.func.isRequired,
  addReminder: PropTypes.func.isRequired,
  deleteReminder: PropTypes.func.isRequired,
  resetDaily: PropTypes.func.isRequired,
  stats: PropTypes.shape({
    medicationsTaken: PropTypes.number,
    appointments: PropTypes.number,
    calls: PropTypes.number,
  }).isRequired,
};
