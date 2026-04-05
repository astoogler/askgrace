import PropTypes from 'prop-types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestionChips from './SuggestionChips';
import ChatInput from './ChatInput';
import WarningCard from './WarningCard';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  messages: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: 'var(--space-md) 0',
  },
  welcome: {
    textAlign: 'center',
    padding: 'var(--space-xl) var(--space-md)',
    color: 'var(--slate)',
  },
  welcomeTitle: {
    fontFamily: 'var(--font-heading)',
    color: 'var(--forest)',
    fontSize: '1.3em',
    marginBottom: 'var(--space-sm)',
  },
  welcomeText: {
    fontSize: '0.9em',
    lineHeight: 1.6,
    marginBottom: 'var(--space-lg)',
  },
};

export default function ChatScreen({
  messages,
  loading,
  sendMessage,
  scrollRef,
  listening,
  onMicToggle,
  micSupported,
}) {
  const showSuggestions = messages.length <= 1;

  return (
    <div style={styles.container}>
      <div style={styles.messages} ref={scrollRef} className="chat-scroll">
        {messages.length === 0 && (
          <div style={styles.welcome}>
            <h2 style={styles.welcomeTitle}>Hello! I'm Grace</h2>
            <p style={styles.welcomeText}>
              Your trusted companion for questions, reminders, and friendly conversation.
              What can I help you with today?
            </p>
          </div>
        )}

        {showSuggestions && messages.length === 0 && (
          <SuggestionChips onSelect={sendMessage} />
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'user' && msg.riskLevel && msg.riskLevel !== 'safe' && (
              <WarningCard riskLevel={msg.riskLevel} />
            )}
            <MessageBubble message={msg} />
          </div>
        ))}

        {loading && <TypingIndicator />}
      </div>

      <ChatInput
        onSend={sendMessage}
        loading={loading}
        listening={listening}
        onMicToggle={onMicToggle}
        micSupported={micSupported}
      />
    </div>
  );
}

ChatScreen.propTypes = {
  messages: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  sendMessage: PropTypes.func.isRequired,
  scrollRef: PropTypes.object.isRequired,
  listening: PropTypes.bool.isRequired,
  onMicToggle: PropTypes.func.isRequired,
  micSupported: PropTypes.bool.isRequired,
};
