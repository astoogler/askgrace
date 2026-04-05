import PropTypes from 'prop-types';
import { LANGUAGES } from '../../constants/topics';
import { trackFeature } from '../../utils/analytics';

const styles = {
  select: {
    width: '100%',
    padding: 'var(--space-sm) var(--space-md)',
    border: '2px solid var(--tan)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'inherit',
    backgroundColor: 'white',
    minHeight: 52,
    color: 'var(--brown-dark)',
  },
};

export default function LanguageSelect({ value, onChange }) {
  const handleChange = (e) => {
    const lang = e.target.value;
    onChange(lang);
    trackFeature('language_change', { language: lang });
  };

  return (
    <select
      style={styles.select}
      value={value}
      onChange={handleChange}
      aria-label="Select language"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}

LanguageSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
