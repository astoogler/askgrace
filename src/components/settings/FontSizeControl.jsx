import PropTypes from 'prop-types';
import { trackFeature } from '../../utils/analytics';

const SIZES = [
  { id: 'font-sm', label: 'A', displaySize: '0.85em' },
  { id: 'font-md', label: 'A', displaySize: '1em' },
  { id: 'font-lg', label: 'A', displaySize: '1.2em' },
  { id: 'font-xl', label: 'A', displaySize: '1.4em' },
];

const styles = {
  row: {
    display: 'flex',
    gap: 'var(--space-sm)',
  },
  btn: (active) => ({
    flex: 1,
    minHeight: 60,
    borderRadius: 'var(--radius-md)',
    border: `2px solid ${active ? 'var(--forest)' : 'var(--tan)'}`,
    backgroundColor: active ? 'var(--forest)' : 'white',
    color: active ? 'white' : 'var(--brown-dark)',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  }),
};

export default function FontSizeControl({ value, onChange }) {
  const handleChange = (sizeId) => {
    onChange(sizeId);
    trackFeature('font_size_change', { size: sizeId });
  };

  return (
    <div style={styles.row}>
      {SIZES.map((size) => (
        <button
          key={size.id}
          style={{ ...styles.btn(value === size.id), fontSize: size.displaySize }}
          onClick={() => handleChange(size.id)}
          aria-label={`Font size ${size.id.replace('font-', '')}`}
          aria-pressed={value === size.id}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
}

FontSizeControl.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
