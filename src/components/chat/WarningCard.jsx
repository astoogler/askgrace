import { useState } from 'react';
import PropTypes from 'prop-types';
import { RISK_WARNINGS } from '../../utils/safetyClassifier';
import { shareText } from '../../utils/share';
import { trackFeature } from '../../utils/analytics';

const variantStyles = {
  emergency: { bg: 'var(--red-light)', border: 'var(--red)', text: 'var(--red)' },
  scam: { bg: 'var(--amber-light)', border: 'var(--amber)', text: 'var(--amber)' },
  medical: { bg: 'var(--forest-pale)', border: 'var(--forest)', text: 'var(--forest)' },
  financial: { bg: 'var(--amber-light)', border: 'var(--brown)', text: 'var(--brown)' },
};

const TOPIC_LABELS = {
  emergency: 'an emergency situation',
  scam: 'a possible scam',
  medical: 'a health question',
  financial: 'a financial question',
};

export default function WarningCard({ riskLevel }) {
  const [copied, setCopied] = useState(false);
  const warning = RISK_WARNINGS[riskLevel];
  if (!warning) return null;

  const variant = variantStyles[warning.variant] || variantStyles.medical;

  const styles = {
    card: {
      backgroundColor: variant.bg,
      border: `2px solid ${variant.border}`,
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)',
      margin: '0 var(--space-md) var(--space-sm)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      marginBottom: 'var(--space-xs)',
    },
    icon: { fontSize: '1.3em' },
    title: {
      fontWeight: 700,
      color: variant.text,
      fontSize: '0.95em',
    },
    description: {
      color: 'var(--brown-dark)',
      fontSize: '0.85em',
      lineHeight: 1.5,
      marginBottom: 'var(--space-sm)',
    },
    shareBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      padding: 'var(--space-xs) var(--space-md)',
      borderRadius: 'var(--radius-full)',
      backgroundColor: variant.border,
      color: 'white',
      fontWeight: 600,
      fontSize: '0.75em',
      minHeight: 40,
      cursor: 'pointer',
    },
  };

  const handleShare = () => {
    const topic = TOPIC_LABELS[riskLevel] || 'a question';
    const text = `I just asked Grace about ${topic} and she reminded me to verify with a professional first before acting on anything. Staying smart out there! 🛡️ askgrace.org`;

    trackFeature('guardian_share', { riskLevel });
    shareText(text, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, 'https://askgrace.org');
  };

  return (
    <div style={styles.card} role="alert" aria-label={warning.title}>
      <div style={styles.header}>
        <span style={styles.icon}>{warning.icon}</span>
        <span style={styles.title}>{warning.title}</span>
      </div>
      <p style={styles.description}>{warning.description}</p>
      {riskLevel !== 'emergency' && (
        <button style={styles.shareBtn} onClick={handleShare} aria-label="Share this warning with a friend">
          {copied ? '✓ Copied!' : '🛡️ Protect a Friend — Share This'}
        </button>
      )}
    </div>
  );
}

WarningCard.propTypes = {
  riskLevel: PropTypes.oneOf(['emergency', 'scam', 'medical', 'financial']).isRequired,
};
