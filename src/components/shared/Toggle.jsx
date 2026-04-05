import PropTypes from 'prop-types';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-md) 0',
    gap: 'var(--space-md)',
  },
  label: {
    fontWeight: 500,
    flex: 1,
  },
  track: (checked) => ({
    position: 'relative',
    width: 56,
    height: 32,
    borderRadius: 'var(--radius-full)',
    backgroundColor: checked ? 'var(--forest)' : 'var(--tan)',
    transition: 'background-color var(--transition-fast)',
    cursor: 'pointer',
    flexShrink: 0,
    minWidth: 60,
    minHeight: 32,
  }),
  thumb: (checked) => ({
    position: 'absolute',
    top: 3,
    left: checked ? 27 : 3,
    width: 26,
    height: 26,
    borderRadius: '50%',
    backgroundColor: 'white',
    boxShadow: 'var(--shadow-sm)',
    transition: 'left var(--transition-fast)',
  }),
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
};

export default function Toggle({ label, checked, onChange, ariaLabel }) {
  return (
    <div style={styles.wrapper}>
      <span style={styles.label}>{label}</span>
      <label style={{ position: 'relative', display: 'inline-block' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={styles.hiddenInput}
          aria-label={ariaLabel || label}
        />
        <div style={styles.track(checked)} role="switch" aria-checked={checked}>
          <div style={styles.thumb(checked)} />
        </div>
      </label>
    </div>
  );
}

Toggle.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
};
