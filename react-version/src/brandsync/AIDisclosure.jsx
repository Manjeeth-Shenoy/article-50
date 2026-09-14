/**
 * Brandsync has no dedicated AI-disclosure component, so this composes
 * the Tag + Tooltip primitives into one: a small "AI" trigger that reveals
 * an explanation popover on hover/focus. Per Brandsync's Tooltip guidance,
 * tooltips are informational only and must never hold actionable controls,
 * so the revert action renders as a normal always-visible button next to
 * the trigger rather than inside the hover/focus popover.
 */
function AIDisclosure({ heading, body, revertActive, onRevertClick }) {
  return (
    <span className="bs-ai-disclosure-group">
      <span className="bs-ai-disclosure" tabIndex={0}>
        <button type="button" className="bs-ai-disclosure-trigger" aria-label="AI disclosure">
          AI
        </button>
        <div className="bs-ai-disclosure-popover" role="tooltip">
          <p className="bs-ai-disclosure-eyebrow">AI Explained</p>
          <p className="bs-ai-disclosure-heading">{heading}</p>
          <p className="bs-ai-disclosure-body">{body}</p>
        </div>
      </span>
      {revertActive && (
        <button type="button" className="bs-btn bs-btn-text bs-ai-disclosure-revert-btn" onClick={onRevertClick}>
          Revert to AI content
        </button>
      )}
    </span>
  );
}

export default AIDisclosure;
