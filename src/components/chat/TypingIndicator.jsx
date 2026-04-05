const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '0 var(--space-md)',
    marginBottom: 'var(--space-md)',
  },
  bubble: {
    backgroundColor: 'white',
    border: '1px solid var(--tan)',
    borderRadius: 'var(--radius-lg)',
    borderTopLeftRadius: 4,
    padding: 'var(--space-md) var(--space-lg)',
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  dot: (delay) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'var(--brown-light)',
    animation: `pulse 1.2s ease-in-out ${delay}s infinite`,
  }),
};

export default function TypingIndicator() {
  return (
    <div style={styles.wrapper} aria-label="Grace is typing" role="status">
      <div style={styles.bubble}>
        <span style={styles.dot(0)} />
        <span style={styles.dot(0.2)} />
        <span style={styles.dot(0.4)} />
      </div>
    </div>
  );
}
