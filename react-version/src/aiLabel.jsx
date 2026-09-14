import AIDisclosure from './brandsync/AIDisclosure';

export const APPROVERS = ['Jordan Lee', 'Priya Nair', 'Marcus Chen', 'Sofia Ibarra'];

export function makeAILabel({ heading, body, revertActive, onRevertClick }) {
  return (
    <AIDisclosure
      heading={heading}
      body={body}
      revertActive={revertActive}
      onRevertClick={onRevertClick}
    />
  );
}
