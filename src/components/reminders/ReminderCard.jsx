import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { REMINDER_TYPES } from '../../constants/topics';

const styles = {
  card: (done) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-md)',
    margin: '0 var(--space-md) var(--space-sm)',
    backgroundColor: 'white',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
    opacity: done ? 0.6 : 1,
    transition: 'opacity var(--transition-fast)',
    minHeight: 64,
  }),
  checkbox: (done) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: `3px solid ${done ? 'var(--forest)' : 'var(--tan)'}`,
    backgroundColor: done ? 'var(--forest)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'white',
    fontSize: '0.85em',
    transition: 'all var(--transition-fast)',
  }),
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: (done) => ({
    fontWeight: 600,
    fontSize: '0.95em',
    textDecoration: done ? 'line-through' : 'none',
    color: done ? 'var(--slate-light)' : 'var(--brown-dark)',
  }),
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginTop: 2,
  },
  timeBadge: {
    fontSize: '0.75em',
    color: 'var(--slate-light)',
  },
  typeBadge: (color) => ({
    fontSize: '0.7em',
    fontWeight: 600,
    color,
    backgroundColor: `${color}15`,
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
  }),
  deleteOverlay: {
    position: 'absolute',
    right: 'var(--space-md)',
    backgroundColor: 'var(--red)',
    color: 'white',
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    fontSize: '0.85em',
    minHeight: 44,
    display: 'flex',
    alignItems: 'center',
  },
};

export default function ReminderCard({ reminder, onToggle, onDelete }) {
  const [showDelete, setShowDelete] = useState(false);
  const longPressTimer = useRef(null);

  const typeConfig = REMINDER_TYPES.find((t) => t.value === reminder.type) || REMINDER_TYPES[0];

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowDelete(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleClick = () => {
    if (showDelete) {
      setShowDelete(false);
      return;
    }
    onToggle(reminder.id);
  };

  return (
    <div
      style={{ ...styles.card(reminder.done), position: 'relative' }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      role="button"
      aria-label={`${reminder.done ? 'Completed' : 'Incomplete'}: ${reminder.name} at ${reminder.time}`}
    >
      <div style={styles.checkbox(reminder.done)}>
        {reminder.done && '✓'}
      </div>
      <div style={styles.info}>
        <div style={styles.name(reminder.done)}>{reminder.name}</div>
        <div style={styles.meta}>
          <span style={styles.timeBadge}>{reminder.time}</span>
          <span style={styles.typeBadge(typeConfig.color)}>
            {typeConfig.icon} {typeConfig.label}
          </span>
        </div>
      </div>

      {showDelete && (
        <button
          style={styles.deleteOverlay}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(reminder.id);
            setShowDelete(false);
          }}
          aria-label={`Delete ${reminder.name}`}
        >
          Delete
        </button>
      )}
    </div>
  );
}

ReminderCard.propTypes = {
  reminder: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
