import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const HOLD_DURATION = 1500; // 1.5 seconds to activate

const styles = {
  bar: {
    backgroundColor: 'var(--red)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-sm) var(--space-lg)',
    cursor: 'pointer',
    minHeight: 48,
    gap: 'var(--space-sm)',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    fontWeight: 700,
    fontSize: '0.85em',
    zIndex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: 'white',
    animation: 'pulse 1.5s ease-in-out infinite',
    flexShrink: 0,
  },
  right: {
    fontSize: '0.75em',
    opacity: 0.9,
    whiteSpace: 'nowrap',
    zIndex: 1,
  },
  // Fill bar that animates while holding
  fill: (progress) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: `${progress}%`,
    backgroundColor: 'rgba(0,0,0,0.25)',
    transition: progress === 0 ? 'width 0.2s ease' : 'none',
  }),
};

export default function EmergencyBar({ onTap }) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const timerRef = useRef(null);
  const startRef = useRef(0);
  const frameRef = useRef(null);

  const updateProgress = () => {
    const elapsed = Date.now() - startRef.current;
    const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100);
    setProgress(pct);

    if (pct >= 100) {
      // Hold complete — trigger emergency
      cleanup();
      onTap();
    } else {
      frameRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const startHold = () => {
    startRef.current = Date.now();
    setHolding(true);
    frameRef.current = requestAnimationFrame(updateProgress);
  };

  const cleanup = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setHolding(false);
    setProgress(0);
  };

  const endHold = () => {
    cleanup();
  };

  return (
    <button
      style={styles.bar}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onTouchCancel={endHold}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      aria-label="Emergency — hold for 2 seconds to call for help"
    >
      <div style={styles.fill(progress)} />
      <span style={styles.left}>
        <span style={styles.dot} />
        <span>{holding ? 'Keep holding...' : 'EMERGENCY — Hold for Help'}</span>
      </span>
      <span style={styles.right}>Calls family + 911</span>
    </button>
  );
}

EmergencyBar.propTypes = {
  onTap: PropTypes.func.isRequired,
};
