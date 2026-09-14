function Select({ id, labelText, value, onChange, disabled, placeholder, options }) {
  const article = /^[aeiou]/i.test(placeholder || labelText) ? 'an' : 'a';
  return (
    <div className="bs-field">
      <label htmlFor={id}>{labelText}</label>
      <div className="bs-select-wrapper">
        <select
          id={id}
          className="bs-select"
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="" disabled>
            {`Select ${article} ${(placeholder || labelText).toLowerCase()}`}
          </option>
          {options.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <span className="bs-select-arrow" aria-hidden="true">▾</span>
      </div>
    </div>
  );
}

export default Select;
