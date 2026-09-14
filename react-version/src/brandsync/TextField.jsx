function TextField({ id, labelText, value, readOnly, rows, multiline, decorator }) {
  const fieldId = id || labelText.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="bs-field">
      <div className="bs-field-label-row">
        <label htmlFor={fieldId}>{labelText}</label>
        {decorator}
      </div>
      {multiline ? (
        <textarea
          id={fieldId}
          className="bs-textarea"
          value={value}
          readOnly={readOnly}
          rows={rows || 3}
        />
      ) : (
        <input
          id={fieldId}
          className="bs-input"
          type="text"
          value={value}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}

export default TextField;
