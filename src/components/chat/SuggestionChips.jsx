import PropTypes from 'prop-types';
import { SUGGESTION_CHIPS } from '../../constants/topics';
import { trackFeature } from '../../utils/analytics';

const styles = {
  wrapper: {
    padding: 'var(--space-md)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-sm)',
    justifyContent: 'center',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-full)',
    border: '2px solid var(--tan)',
    backgroundColor: 'white',
    fontSize: '0.85em',
    fontWeight: 500,
    color: 'var(--brown-dark)',
    minHeight: 48,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
};

export default function SuggestionChips({ onSelect }) {
  const handleClick = (chip) => {
    trackFeature('suggestion_chip');
    onSelect(chip.label);
  };

  return (
    <div style={styles.wrapper} aria-label="Suggested topics">
      {SUGGESTION_CHIPS.map((chip) => (
        <button
          key={chip.id}
          style={styles.chip}
          onClick={() => handleClick(chip)}
          aria-label={chip.label}
        >
          <span>{chip.icon}</span>
          <span>{chip.label}</span>
        </button>
      ))}
    </div>
  );
}

SuggestionChips.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
