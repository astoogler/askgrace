import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SendIcon, MicIcon, MicOffIcon } from '../shared/Icons';
import { trackFeature } from '../../utils/analytics';

const styles = {
  wrapper: {
    borderTop: '1px solid var(--parchment)',
    backgroundColor: 'white',
    padding: 'var(--space-sm) var(--space-md)',
    flexShrink: 0,
  },
  inputRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 'var(--space-sm)',
  },
  textarea: {
    flex: 1,
    resize: 'none',
    border: '2px solid var(--tan)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm) var(--space-md)',
    fontSize: 'inherit',
    lineHeight: 1.4,
    maxHeight: 'calc(1.4em * 3 + 2 * var(--space-sm))',
    minHeight: 48,
    fontFamily: 'inherit',
    outline: 'none',
  },
  textareaRecording: {
    borderColor: 'var(--red)',
    boxShadow: '0 0 0 2px var(--red-light)',
  },
  sendBtn: (disabled) => ({
    minWidth: 60,
    minHeight: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-full)',
    backgroundColor: disabled ? 'var(--tan)' : 'var(--forest)',
    color: 'white',
    transition: 'background-color var(--transition-fast)',
  }),
  micBtn: (listening) => ({
    minWidth: 60,
    minHeight: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-full)',
    backgroundColor: listening ? 'var(--red-light)' : 'var(--parchment)',
    color: listening ? 'var(--red)' : 'var(--slate)',
    border: listening ? '2px solid var(--red)' : '2px solid transparent',
    transition: 'all var(--transition-fast)',
    animation: listening ? 'pulse 1.5s ease-in-out infinite' : 'none',
  }),
  hint: {
    fontSize: '0.65em',
    color: 'var(--slate-light)',
    textAlign: 'center',
    padding: 'var(--space-xs) 0',
  },
};

export default function ChatInput({ onSend, loading, listening, onMicToggle, micSupported }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || loading) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMic = () => {
    trackFeature('voice_input');
    onMicToggle((transcript) => {
      setText((prev) => (prev ? prev + ' ' + transcript : transcript));
    });
  };

  const isEmpty = !text.trim();

  return (
    <div style={styles.wrapper}>
      <div style={styles.inputRow}>
        <textarea
          ref={textareaRef}
          style={{
            ...styles.textarea,
            ...(listening ? styles.textareaRecording : {}),
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message to Grace..."
          rows={1}
          aria-label="Message input"
        />
        {micSupported && (
          <button
            style={styles.micBtn(listening)}
            onClick={handleMic}
            aria-label={listening ? 'Stop recording' : 'Start voice recording'}
          >
            {listening ? <MicOffIcon size={24} /> : <MicIcon size={24} />}
          </button>
        )}
        <button
          style={styles.sendBtn(isEmpty || loading)}
          onClick={handleSend}
          disabled={isEmpty || loading}
          aria-label="Send message"
        >
          <SendIcon size={22} />
        </button>
      </div>
      <p style={styles.hint}>Press Enter to send &bull; Tap mic to speak</p>
    </div>
  );
}

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  listening: PropTypes.bool.isRequired,
  onMicToggle: PropTypes.func.isRequired,
  micSupported: PropTypes.bool.isRequired,
};
