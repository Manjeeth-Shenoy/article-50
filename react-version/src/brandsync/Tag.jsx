function Tag({ type = 'neutral', children }) {
  return <span className={`bs-tag bs-tag-${type}`}>{children}</span>;
}

export default Tag;
