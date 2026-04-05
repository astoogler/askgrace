import { useState } from 'react';
import PropTypes from 'prop-types';

const styles = {
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
  saveBtn: {
    backgroundColor: 'var(--forest)',
    color: 'white',
    fontWeight: 700,
    padding: 'var(--space-sm) var(--space-lg)',
    borderRadius: 'var(--radius-md)',
    minHeight: 52,
    minWidth: 120,
  },
  error: {
    color: 'var(--red)',
    fontSize: '0.8em',
    marginBottom: 'var(--space-sm)',
  },
  success: {
    color: 'var(--forest)',
    fontSize: '0.8em',
    marginBottom: 'var(--space-sm)',
    fontWeight: 600,
  },
};

export default function EmergencyContactForm({ name, phone, onSave }) {
  const [localName, setLocalName] = useState(name);
  const [localPhone, setLocalPhone] = useState(phone);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setError('');
    setSuccess(false);

    const digitsOnly = localPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setError('Phone number must have at least 10 digits.');
      return;
    }

    onSave(localName.trim(), localPhone.trim());
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div>
      <label style={styles.label}>Caregiver Name</label>
      <input
        style={styles.input}
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        placeholder="e.g., Sarah (daughter)"
        aria-label="Caregiver name"
      />

      <label style={styles.label}>Phone Number</label>
      <input
        style={styles.input}
        value={localPhone}
        onChange={(e) => setLocalPhone(e.target.value)}
        placeholder="e.g., (555) 123-4567"
        type="tel"
        aria-label="Caregiver phone number"
      />

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>Contact saved!</p>}

      <button style={styles.saveBtn} onClick={handleSave} aria-label="Save emergency contact">
        Save
      </button>
    </div>
  );
}

EmergencyContactForm.propTypes = {
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};
