function Button({ variant = 'primary', size, children, className = '', ...rest }) {
  const classes = ['bs-btn', `bs-btn-${variant}`, className].filter(Boolean).join(' ');
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
