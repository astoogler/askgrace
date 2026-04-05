import { useState } from 'react';
import PropTypes from 'prop-types';
import { REMINDER_TYPES } from '../../constants/topics';
import { CloseIcon } from '../shared/Icons';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
    width: '100%',
    maxWidth: 480,
    padding: 'var(--space-lg)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-lg)',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.2em',
    fontWeight: 600,
  },
  closeBtn: {
    minWidth: 48,
    minHeight: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--slate)',
  },
  label: {
    fontWeight: 600,
    fontSize: '0.85em',
    marginBottom: 'var(--space-xs)',
    display: 'block',
    color: 'var(--slate)',
  },
  input: {
    width: '100%',
    padding: 'var(--space-sm) var(--space-md)',
    border: '2px solid var(--tan)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'inherit',
    marginBottom: 'var(--space-md)',
    minHeight: 52,
  },
  typeRow: {
    display: 'flex',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-lg)',
  },
  typeBtn: (active) => ({
    flex: 1,
    padding: 'var(--space-sm)',
    borderRadius: 'var(--radius-md)',
    border: `2px solid ${active ? 'var(--forest)' : 'var(--tan)'}`,
    backgroundColor: active ? 'var(--forest-pale)' : 'white',
    fontWeight: 600,
    fontSize: '0.85em',
    textAlign: 'center',
    minHeight: 52,
    cursor: 'pointer',
  }),
  saveBtn: {
    width: '100%',
    padding: 'var(--space-md)',
    backgroundColor: 'var(--forest)',
    color: 'white',
    fontWeight: 700,
    borderRadius: 'var(--radius-md)',
    fontSize: '1em',
    minHeight: 60,
    marginBottom: 'var(--space-sm)',
  },
  cancelBtn: {
    width: '100%',
    padding: 'var(--space-md)',
    backgroundColor: 'var(--parchment)',
    color: 'var(--slate)',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    fontSize: '1em',
    minHeight: 60,
  },
};

export default function AddReminderModal({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('pill');

  const handleSave = () => {
    if (!name.trim() || !time.trim()) return;
    onSave({ name: name.trim(), time: time.trim(), type });
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add Reminder</h2>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon size={24} />
          </button>
        </div>

        <label style={styles.label}>Reminder Name</label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Take blood pressure pill"
          aria-label="Reminder name"
        />

        <label style={styles.label}>Time</label>
        <input
          style={styles.input}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g., 8:00 AM"
          aria-label="Reminder time"
        />

        <label style={styles.label}>Type</label>
        <div style={styles.typeRow}>
          {REMINDER_TYPES.map((t) => (
            <button
              key={t.value}
              style={styles.typeBtn(type === t.value)}
              onClick={() => setType(t.value)}
              aria-label={`Type: ${t.label}`}
              aria-pressed={type === t.value}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <button style={styles.saveBtn} onClick={handleSave} aria-label="Save reminder">
          Save Reminder
        </button>
        <button style={styles.cancelBtn} onClick={onClose} aria-label="Cancel">
          Cancel
        </button>
      </div>
    </div>
  );
}

AddReminderModal.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
