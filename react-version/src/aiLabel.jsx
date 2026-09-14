import {
  AILabel,
  AILabelContent,
  AILabelActions,
  IconButton,
} from '@carbon/react';
import { View } from '@carbon/icons-react';

export const APPROVERS = ['Jordan Lee', 'Priya Nair', 'Marcus Chen', 'Sofia Ibarra'];

export function makeAILabel({
  heading,
  body,
  size = 'sm',
  kind = 'default',
  revertActive,
  onRevertClick,
}) {
  return (
    <AILabel
      className="ai-label-container"
      aria-label="AI disclosure"
      size={size}
      kind={kind}
      revertActive={revertActive}
      onRevertClick={onRevertClick}
      autoAlign
    >
      <AILabelContent>
        <div>
          <p className="ai-label-secondary">AI Explained</p>
          <h3 className="ai-label-heading">{heading}</h3>
          <p className="ai-label-body">{body}</p>
        </div>
        <hr />
        <AILabelActions>
          <IconButton kind="ghost" label="View source">
            <View />
          </IconButton>
        </AILabelActions>
      </AILabelContent>
    </AILabel>
  );
}
