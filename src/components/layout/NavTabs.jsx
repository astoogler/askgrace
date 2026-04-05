import PropTypes from 'prop-types';
import { HomeIcon, ChatIcon, ReminderIcon } from '../shared/Icons';

const TABS = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'chat', label: 'Chat', Icon: ChatIcon },
  { id: 'reminders', label: 'Reminders', Icon: ReminderIcon },
];

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    borderTop: '1px solid var(--parchment)',
    backgroundColor: 'white',
    padding: 'var(--space-xs) 0 var(--space-sm)',
    flexShrink: 0,
  },
  tab: (active) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minWidth: 80,
    minHeight: 60,
    color: active ? 'var(--forest)' : 'var(--slate-light)',
    fontWeight: active ? 600 : 400,
    fontSize: '0.7em',
    transition: 'color var(--transition-fast)',
    borderRadius: 'var(--radius-sm)',
  }),
};

export default function NavTabs({ activeTab, onTabChange }) {
  return (
    <nav style={styles.nav} aria-label="Main navigation">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          style={styles.tab(activeTab === id)}
          onClick={() => onTabChange(id)}
          aria-label={`${label} tab`}
          aria-current={activeTab === id ? 'page' : undefined}
        >
          <Icon size={26} active={activeTab === id} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

NavTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};
