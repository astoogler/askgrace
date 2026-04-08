import { useState } from 'react';
import PropTypes from 'prop-types';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  label: {
    fontWeight: 600,
    fontSize: '0.85em',
    color: 'var(--slate)',
  },
  input: {
    width: '100%',
    padding: 'var(--space-sm) var(--space-md)',
    border: '2px solid var(--tan)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'inherit',
    minHeight: 52,
  },
  submitBtn: {
    width: '100%',
    minHeight: 60,
    padding: 'var(--space-md)',
    backgroundColor: 'var(--forest)',
    color: 'white',
    fontWeight: 700,
    borderRadius: 'var(--radius-md)',
    fontSize: '1em',
    marginTop: 'var(--space-sm)',
  },
  toggle: {
    textAlign: 'center',
    color: 'var(--forest)',
    fontWeight: 600,
    fontSize: '0.85em',
    minHeight: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  error: {
    color: 'var(--red)',
    fontSize: '0.8em',
    textAlign: 'center',
  },
  success: {
    color: 'var(--forest)',
    fontSize: '0.85em',
    textAlign: 'center',
    backgroundColor: 'var(--forest-pale)',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-md)',
    lineHeight: 1.5,
  },
};

export default function EmailPasswordForm({ onSignIn, onSignUp, disabled }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      if (isSignUp) {
        await onSignUp(email.trim(), password, name.trim(), phone.trim(), optIn);
      } else {
        await onSignIn(email.trim(), password);
      }
    } catch (err) {
      const msg = err.message || '';

      // Email confirmation required — show success, not error
      if (msg.includes('email_confirmation_required')) {
        setSuccessMsg('Check your email for a confirmation link. Once confirmed, come back and sign in.');
        return;
      }

      // Friendly error messages — never show raw Supabase errors
      if (msg.includes('Invalid login')) {
        setError('Email or password is incorrect. Please try again.');
      } else if (msg.includes('already registered')) {
        setError('That email is already registered. Try signing in instead.');
      } else if (msg.includes('valid email')) {
        setError('Please enter a valid email address.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link first, then try signing in.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {isSignUp && (
        <>
          <label style={styles.label}>Your Name</label>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Margaret"
            aria-label="Your name"
          />
        </>
      )}

      <label style={styles.label}>Email</label>
      <input
        style={styles.input}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        autoComplete="email"
      />

      <label style={styles.label}>Password</label>
      <input
        style={styles.input}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={isSignUp ? 'At least 8 characters' : 'Your password'}
        aria-label="Password"
        autoComplete={isSignUp ? 'new-password' : 'current-password'}
      />

      {isSignUp && (
        <>
          <label style={styles.label}>Phone Number <span style={{ fontWeight: 400, color: 'var(--slate-light)' }}>(optional)</span></label>
          <input
            style={styles.input}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g., (555) 123-4567"
            aria-label="Phone number (optional)"
            autoComplete="tel"
          />

          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-sm)',
            fontSize: '0.8em',
            color: 'var(--slate)',
            lineHeight: 1.5,
            cursor: 'pointer',
            marginBottom: 'var(--space-md)',
          }}>
            <input
              type="checkbox"
              checked={optIn}
              onChange={(e) => setOptIn(e.target.checked)}
              style={{ marginTop: 3, width: 20, height: 20, flexShrink: 0 }}
              aria-label="Opt in to tips and updates"
            />
            <span>
              I'd like to receive helpful tips and updates from Ask Grace via text and email.
              You can unsubscribe anytime.
            </span>
          </label>
        </>
      )}

      {error && <p style={styles.error}>{error}</p>}
      {successMsg && <p style={styles.success}>{successMsg}</p>}

      <button style={styles.submitBtn} type="submit" disabled={disabled || !!successMsg}>
        {isSignUp ? 'Create Account' : 'Sign In'}
      </button>

      <button
        type="button"
        style={styles.toggle}
        onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
      >
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
      </button>
    </form>
  );
}

EmailPasswordForm.propTypes = {
  onSignIn: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
