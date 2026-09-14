function Card({ className = '', children }) {
  return <div className={`bs-card ${className}`.trim()}>{children}</div>;
}

export default Card;
