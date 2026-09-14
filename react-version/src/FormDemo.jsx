import { useState } from 'react';
import { TextArea, TextInput, Button, Select, SelectItem, Tag } from '@carbon/react';
import { Locked, Unlocked } from '@carbon/icons-react';
import { APPROVERS, makeAILabel } from './aiLabel';
import ApprovalGate from './ApprovalGate';

function OversightSection({ level, title, requirement, children }) {
  return (
    <section className="oversight-section">
      <div className="oversight-header">
        <Tag type="high-contrast">{level}</Tag>
        <h2>{title}</h2>
      </div>
      <p className="oversight-requirement">{requirement}</p>
      <div className="oversight-body">{children}</div>
    </section>
  );
}

function O1Disclosure() {
  const aiLabel = makeAILabel({
    heading: 'Summary generated',
    body: 'This summary was generated automatically from the linked ticket thread. No review is required before display.',
  });

  return (
    <OversightSection
      level="O1"
      title="AI-generated summary"
      requirement="Ship requirement: disclosure only, no confirmation gate."
    >
      <TextArea
        labelText="Ticket summary"
        value="Customer reports intermittent login failures on the mobile app since the last release. Root cause appears to be a token refresh race condition."
        readOnly
        rows={3}
        decorator={aiLabel}
      />
    </OversightSection>
  );
}

function O2RevertToggle() {
  const [isEdited, setIsEdited] = useState(false);
  const [text, setText] = useState(
    'Bonjour, merci de nous avoir contactés. Nous traitons votre demande dès que possible.'
  );
  const original = 'Bonjour, merci de nous avoir contactés. Nous traitons votre demande dès que possible.';
  const edited = 'Bonjour ! Merci de votre message — nous revenons vers vous très vite avec une solution.';

  const handleRevert = () => {
    setText(original);
    setIsEdited(false);
  };

  const handleSimulateEdit = () => {
    setText(edited);
    setIsEdited(true);
  };

  const aiLabel = makeAILabel({
    heading: 'Translation generated',
    body: 'Machine-translated from English to French. A human can revert to the original AI output at any time.',
    revertActive: isEdited,
    onRevertClick: handleRevert,
  });

  return (
    <OversightSection
      level="O2"
      title="AI-translated text field"
      requirement="Ship requirement: disclosure plus a revert-to-AI-content interaction."
    >
      <TextArea
        labelText="Translated reply"
        value={text}
        readOnly
        rows={3}
        decorator={aiLabel}
      />
      <div className="oversight-controls">
        <Tag type={isEdited ? 'purple' : 'blue'}>
          {isEdited ? 'Human-edited' : 'AI-generated'}
        </Tag>
        <Button kind="tertiary" size="sm" onClick={handleSimulateEdit} disabled={isEdited}>
          Simulate human edit
        </Button>
      </div>
    </OversightSection>
  );
}

function O3ConfirmCancel() {
  const [decision, setDecision] = useState(null);

  const aiLabel = makeAILabel({
    heading: 'Reply drafted',
    body: 'This reply was drafted from the customer message and prior thread context. Nothing is sent until confirmed.',
  });

  return (
    <OversightSection
      level="O3"
      title="AI-drafted reply"
      requirement="Ship requirement: explicit Confirm or Cancel before the action takes effect."
    >
      <TextArea
        labelText="Draft reply"
        value="Thanks for flagging this — I've escalated your ticket to our mobile team and you should see a fix within 48 hours."
        readOnly
        rows={3}
        decorator={aiLabel}
      />
      <div className="oversight-controls">
        <Button kind="primary" size="sm" onClick={() => setDecision('confirmed')}>
          Confirm
        </Button>
        <Button kind="secondary" size="sm" onClick={() => setDecision('cancelled')}>
          Cancel
        </Button>
      </div>
      {decision && (
        <p className={`oversight-result ${decision}`}>
          {decision === 'confirmed'
            ? 'Reply sent to the customer.'
            : 'Draft discarded. Nothing was sent.'}
        </p>
      )}
    </OversightSection>
  );
}

function O4NamedApprover() {
  const aiLabel = makeAILabel({
    heading: 'Refund recommended',
    body: 'Recommended based on the order history and stated reason. Selecting a named approver only requests their sign-off — the refund is not issued until they actually approve it.',
  });

  return (
    <OversightSection
      level="O4"
      title="AI-recommended refund"
      requirement="Ship requirement: the named approver must explicitly approve — selecting their name alone does not release the action."
    >
      <TextInput
        labelText="Recommended action"
        value="Issue full refund of $84.00 for order #48213"
        readOnly
        decorator={aiLabel}
      />
      <ApprovalGate
        id="o4-approver"
        approverFieldLabel="Approver"
        approvers={APPROVERS}
        requestLabel="Request approval"
        renderPending={(name) => (
          <p className="oversight-result">Waiting for {name} to approve the refund.</p>
        )}
        renderApproved={(name) => (
          <p className="oversight-result confirmed">Refund approved by {name}.</p>
        )}
        renderDenied={(name) => (
          <p className="oversight-result cancelled">
            Refund declined by {name}. Not issued.
          </p>
        )}
      />
    </OversightSection>
  );
}

function O5DualReviewer() {
  const [reviewer1, setReviewer1] = useState('');
  const [reviewer2, setReviewer2] = useState('');
  const [auditLog, setAuditLog] = useState([]);
  const [unlocked, setUnlocked] = useState(false);

  const bothSelected = reviewer1 && reviewer2;
  const distinctReviewers = bothSelected && reviewer1 !== reviewer2;

  const logApproval = (label, name) => {
    setAuditLog((log) => [
      ...log,
      { label, name, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const handleReviewer1Change = (e) => {
    const name = e.target.value;
    setReviewer1(name);
    setUnlocked(false);
    if (name) logApproval('Reviewer 1', name);
  };

  const handleReviewer2Change = (e) => {
    const name = e.target.value;
    setReviewer2(name);
    setUnlocked(false);
    if (name) logApproval('Reviewer 2', name);
  };

  const handleUnlock = () => {
    setUnlocked(true);
    logApproval('Action unlocked', `${reviewer1} + ${reviewer2}`);
  };

  const aiLabel = makeAILabel({
    heading: 'High-impact action flagged',
    body: 'This system access change was flagged as high impact. It requires two different named reviewers before it can be unlocked.',
  });

  return (
    <OversightSection
      level="O5"
      title="AI-flagged system access change"
      requirement="Ship requirement: two different named reviewers required to unlock, with each approval logged to a visible audit trail."
    >
      <TextInput
        labelText="Flagged action"
        value="Grant admin-level access to service account svc-billing-sync"
        readOnly
        decorator={aiLabel}
      />
      <div className="oversight-controls">
        <Select
          id="o5-reviewer1"
          labelText="Reviewer 1"
          value={reviewer1}
          onChange={handleReviewer1Change}
        >
          <SelectItem value="" text="Select a reviewer" />
          {APPROVERS.map((name) => (
            <SelectItem key={name} value={name} text={name} />
          ))}
        </Select>
        <Select
          id="o5-reviewer2"
          labelText="Reviewer 2"
          value={reviewer2}
          onChange={handleReviewer2Change}
        >
          <SelectItem value="" text="Select a reviewer" />
          {APPROVERS.map((name) => (
            <SelectItem key={name} value={name} text={name} />
          ))}
        </Select>
        <Button
          kind="primary"
          size="sm"
          disabled={!distinctReviewers || unlocked}
          onClick={handleUnlock}
          renderIcon={distinctReviewers ? Unlocked : Locked}
        >
          {unlocked ? 'Unlocked' : 'Unlock action'}
        </Button>
      </div>
      {bothSelected && !distinctReviewers && (
        <p className="oversight-result cancelled">
          Reviewer 1 and Reviewer 2 must be different people.
        </p>
      )}
      {unlocked && (
        <p className="oversight-result confirmed">
          Access change unlocked and applied.
        </p>
      )}
      <div className="audit-trail">
        <h4>Audit trail</h4>
        {auditLog.length === 0 ? (
          <p className="audit-empty">No approvals logged yet.</p>
        ) : (
          <ul>
            {auditLog.map((entry, i) => (
              <li key={i}>
                <span className="audit-timestamp">{entry.timestamp}</span>
                <span>
                  {entry.label}: {entry.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </OversightSection>
  );
}

function FormDemo() {
  return (
    <div className="form-demo">
      <O1Disclosure />
      <O2RevertToggle />
      <O3ConfirmCancel />
      <O4NamedApprover />
      <O5DualReviewer />
    </div>
  );
}

export default FormDemo;
