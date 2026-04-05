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
};

export default function EmailPasswordForm({ onSignIn, onSignUp, disabled }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
        await onSignUp(email.trim(), password, name.trim());
      } else {
        await onSignIn(email.trim(), password);
      }
    } catch (err) {
      // Friendly error messages — never show raw Supabase errors
      const msg = err.message || '';
      if (msg.includes('Invalid login')) {
        setError('Email or password is incorrect. Please try again.');
      } else if (msg.includes('already registered')) {
        setError('That email is already registered. Try signing in instead.');
      } else if (msg.includes('valid email')) {
        setError('Please enter a valid email address.');
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

      {error && <p style={styles.error}>{error}</p>}

      <button style={styles.submitBtn} type="submit" disabled={disabled}>
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
