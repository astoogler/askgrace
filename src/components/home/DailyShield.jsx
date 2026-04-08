import { useState } from 'react';
import { DAILY_SHIELD_TIPS } from '../../constants/dailyShield';
import { shareText } from '../../utils/share';
import { trackFeature } from '../../utils/analytics';

function getTodayShield() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return DAILY_SHIELD_TIPS[dayOfYear % DAILY_SHIELD_TIPS.length];
}

function getTodayDateLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const styles = {
  card: {
    backgroundColor: '#FEF3CD',
    border: '2px solid #D4A017',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
    margin: 'var(--space-md)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-sm)',
  },
  icon: {
    fontSize: '1.4em',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '1em',
    color: '#8B6914',
  },
  tip: {
    fontSize: '0.9em',
    lineHeight: 1.6,
    color: 'var(--brown-dark)',
    marginBottom: 'var(--space-md)',
  },
  shareBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-full)',
    backgroundColor: '#D4A017',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.8em',
    minHeight: 44,
    cursor: 'pointer',
  },
};

export default function DailyShield() {
  const [copied, setCopied] = useState(false);
  const tip = getTodayShield();
  const dateLabel = getTodayDateLabel();

  const handleShare = () => {
    const text = `Grace's Daily Shield for ${dateLabel}: "${tip}" Stay sharp! 🛡️`;
    trackFeature('daily_shield_share');
    shareText(text, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, 'https://askgrace.org');
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>🛡️</span>
        <span style={styles.title}>Today's Daily Shield</span>
      </div>
      <p style={styles.tip}>{tip}</p>
      <button style={styles.shareBtn} onClick={handleShare} aria-label="Share today's safety tip">
        {copied ? '✓ Copied!' : "📤 Share Today's Shield"}
      </button>
    </div>
  );
}
