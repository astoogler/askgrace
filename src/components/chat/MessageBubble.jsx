import { useState } from 'react';
import PropTypes from 'prop-types';
import { ThumbsUpIcon, ThumbsDownIcon } from '../shared/Icons';
import { trackFeedback } from '../../utils/analytics';

// Lightweight markdown renderer — handles **bold**, *italic*, and - bullet lists.
// Uses React elements (no dangerouslySetInnerHTML) so it's XSS-safe.
function renderMarkdown(text) {
  const lines = text.split('\n');

  return lines.map((line, i) => {
    // Bullet list items
    const bulletMatch = line.match(/^[\s]*[-•]\s+(.*)/);
    const isBullet = !!bulletMatch;
    const lineContent = isBullet ? bulletMatch[1] : line;

    // Parse inline bold (**text**) and italic (*text*)
    const parts = [];
    let remaining = lineContent;
    let key = 0;

    while (remaining.length > 0) {
      // Bold: **text**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch) {
        const idx = remaining.indexOf(boldMatch[0]);
        if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
        parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
        remaining = remaining.slice(idx + boldMatch[0].length);
        continue;
      }
      // No more matches — push the rest
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (isBullet) {
      return (
        <div key={i} style={{ display: 'flex', gap: 6, marginLeft: 4, marginBottom: 2 }}>
          <span style={{ flexShrink: 0 }}>•</span>
          <span>{parts}</span>
        </div>
      );
    }

    // Empty line = paragraph break
    if (line.trim() === '') {
      return <div key={i} style={{ height: '0.5em' }} />;
    }

    return <div key={i}>{parts}</div>;
  });
}

export default function MessageBubble({ message }) {
  const [vote, setVote] = useState(null);
  const isUser = message.role === 'user';

  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      padding: '0 var(--space-md)',
      marginBottom: 'var(--space-sm)',
    },
    bubble: {
      maxWidth: '85%',
      padding: 'var(--space-md)',
      borderRadius: 'var(--radius-lg)',
      ...(isUser
        ? {
            backgroundColor: 'var(--forest)',
            color: 'white',
            borderTopRightRadius: 4,
          }
        : {
            backgroundColor: 'white',
            border: '1px solid var(--tan)',
            color: 'var(--brown-dark)',
            borderTopLeftRadius: 4,
          }),
      boxShadow: 'var(--shadow-sm)',
    },
    text: {
      fontSize: 'inherit',
      lineHeight: 1.6,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    time: {
      fontSize: '0.65em',
      opacity: 0.6,
      marginTop: 'var(--space-xs)',
      textAlign: isUser ? 'right' : 'left',
    },
    feedback: {
      display: 'flex',
      gap: 'var(--space-sm)',
      marginTop: 'var(--space-xs)',
    },
    feedbackBtn: (isActive) => ({
      minWidth: 40,
      minHeight: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-full)',
      color: isActive ? 'var(--forest)' : 'var(--slate-light)',
      backgroundColor: isActive ? 'var(--forest-pale)' : 'transparent',
      transition: 'all var(--transition-fast)',
    }),
  };

  const handleVote = (v) => {
    if (vote !== null) return; // One vote per message
    setVote(v);
    trackFeedback(v, 'general');
  };

  return (
    <div style={styles.wrapper} className="slide-up">
      <div style={{
        ...styles.bubble,
        ...(message.blurred ? { filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' } : {}),
      }}>
        <div style={styles.text}>{isUser ? message.text : renderMarkdown(message.text)}</div>
        <div style={styles.time}>{message.time}</div>
        {!isUser && !message.isError && (
          <div style={styles.feedback}>
            <button
              style={styles.feedbackBtn(vote === 'up')}
              onClick={() => handleVote('up')}
              aria-label="Helpful response"
              disabled={vote !== null}
            >
              <ThumbsUpIcon size={18} filled={vote === 'up'} />
            </button>
            <button
              style={styles.feedbackBtn(vote === 'down')}
              onClick={() => handleVote('down')}
              aria-label="Not helpful response"
              disabled={vote !== null}
            >
              <ThumbsDownIcon size={18} filled={vote === 'down'} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    text: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    riskLevel: PropTypes.string,
    isError: PropTypes.bool,
    blurred: PropTypes.bool,
  }).isRequired,
};
