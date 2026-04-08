import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../lib/supabase';
import { CloseIcon } from '../shared/Icons';

const RELATIONSHIPS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'friend', label: 'Friend' },
  { value: 'neighbor', label: 'Neighbor' },
  { value: 'caregiver', label: 'Caregiver' },
  { value: 'other', label: 'Other' },
];

const MAX_CONTACTS = 5;

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
    marginBottom: 'var(--space-sm)',
    minHeight: 52,
  },
  select: {
    width: '100%',
    padding: 'var(--space-sm) var(--space-md)',
    border: '2px solid var(--tan)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'inherit',
    marginBottom: 'var(--space-md)',
    minHeight: 52,
    backgroundColor: 'white',
  },
  contactCard: {
    backgroundColor: 'white',
    border: '1px solid var(--tan)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    marginBottom: 'var(--space-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-md)',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontWeight: 600,
    fontSize: '0.95em',
    color: 'var(--brown-dark)',
  },
  contactMeta: {
    fontSize: '0.8em',
    color: 'var(--slate-light)',
    marginTop: 2,
  },
  removeBtn: {
    minWidth: 40,
    minHeight: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--red)',
    borderRadius: 'var(--radius-full)',
    flexShrink: 0,
  },
  addBtn: {
    backgroundColor: 'var(--forest)',
    color: 'white',
    fontWeight: 700,
    padding: 'var(--space-sm) var(--space-lg)',
    borderRadius: 'var(--radius-md)',
    minHeight: 52,
    width: '100%',
    marginTop: 'var(--space-sm)',
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
  limit: {
    fontSize: '0.75em',
    color: 'var(--slate-light)',
    textAlign: 'center',
    marginTop: 'var(--space-sm)',
  },
};

export default function EmergencyContactForm({ userId, onContactsChange }) {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('daughter');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load contacts from Supabase
  useEffect(() => {
    if (!userId) return;

    supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) {
          setContacts(data);
          // Update the primary contact for emergency bar/modal
          if (data.length > 0 && onContactsChange) {
            onContactsChange(data[0].name, data[0].phone);
          }
        }
      });
  }, [userId, onContactsChange]);

  const handleAdd = async () => {
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please enter a name.');
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setError('Phone number must have at least 10 digits.');
      return;
    }

    if (contacts.length >= MAX_CONTACTS) {
      setError(`You can add up to ${MAX_CONTACTS} contacts.`);
      return;
    }

    const newContact = {
      user_id: userId,
      name: name.trim(),
      phone: phone.trim(),
      relationship,
      sort_order: contacts.length,
    };

    if (userId) {
      const { data, error: dbError } = await supabase
        .from('emergency_contacts')
        .insert(newContact)
        .select()
        .single();

      if (dbError) {
        setError('Something went wrong. Please try again.');
        return;
      }

      const updated = [...contacts, data];
      setContacts(updated);

      // Update primary contact for emergency features
      if (updated.length === 1 && onContactsChange) {
        onContactsChange(data.name, data.phone);
      }
    }

    setName('');
    setPhone('');
    setRelationship('daughter');
    setSuccess('Contact saved!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRemove = async (id) => {
    if (userId) {
      await supabase.from('emergency_contacts').delete().eq('id', id);
    }

    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);

    // Update primary contact
    if (onContactsChange) {
      if (updated.length > 0) {
        onContactsChange(updated[0].name, updated[0].phone);
      } else {
        onContactsChange('', '');
      }
    }
  };

  const getRelLabel = (value) => {
    const r = RELATIONSHIPS.find((rel) => rel.value === value);
    return r ? r.label : value;
  };

  return (
    <div>
      {/* Existing contacts */}
      {contacts.map((c) => (
        <div key={c.id} style={styles.contactCard}>
          <div style={styles.contactInfo}>
            <div style={styles.contactName}>{c.name}</div>
            <div style={styles.contactMeta}>
              {getRelLabel(c.relationship)} &bull; {c.phone}
            </div>
          </div>
          <button
            style={styles.removeBtn}
            onClick={() => handleRemove(c.id)}
            aria-label={`Remove ${c.name}`}
          >
            <CloseIcon size={18} />
          </button>
        </div>
      ))}

      {/* Add new contact form */}
      {contacts.length < MAX_CONTACTS && (
        <>
          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Sarah"
            aria-label="Contact name"
          />

          <label style={styles.label}>Relationship</label>
          <select
            style={styles.select}
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            aria-label="Relationship"
          >
            {RELATIONSHIPS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <label style={styles.label}>Phone Number</label>
          <input
            style={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g., (555) 123-4567"
            type="tel"
            aria-label="Phone number"
          />

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button style={styles.addBtn} onClick={handleAdd} aria-label="Add contact">
            + Add Contact
          </button>
        </>
      )}

      <p style={styles.limit}>
        {contacts.length} of {MAX_CONTACTS} contacts added
      </p>
    </div>
  );
}

EmergencyContactForm.propTypes = {
  userId: PropTypes.string,
  onContactsChange: PropTypes.func,
};
