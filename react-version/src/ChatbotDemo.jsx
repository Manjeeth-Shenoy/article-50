import { useState } from 'react';
import { Button, Select, SelectItem, Tag } from '@carbon/react';
import { Locked, Unlocked } from '@carbon/icons-react';
import { APPROVERS, makeAILabel } from './aiLabel';

function LevelTag({ level, title, requirement }) {
  return (
    <div className="chat-level-tag">
      <Tag type="high-contrast">{level}</Tag>
      <div>
        <p className="chat-level-title">{title}</p>
        <p className="chat-level-requirement">{requirement}</p>
      </div>
    </div>
  );
}

function ChatRow({ from, children }) {
  const initials = from === 'customer' ? 'C' : from === 'ai' ? 'AI' : '✓';
  return (
    <div className={`chat-row chat-row--${from}`}>
      <div className="chat-avatar">{initials}</div>
      <div className="chat-bubble">{children}</div>
    </div>
  );
}

function O1Scenario() {
  const aiLabel = makeAILabel({
    heading: 'Answer generated',
    body: 'Answered directly from the published returns policy. No review is required before replying.',
    kind: 'inline',
    size: 'xs',
  });

  return (
    <section className="chat-scenario">
      <LevelTag
        level="O1"
        title="FAQ answer"
        requirement="Ship requirement: disclosure only, no confirmation gate."
      />
      <ChatRow from="customer">What&rsquo;s your return policy?</ChatRow>
      <ChatRow from="ai">
        You can return any item within 30 days of purchase for a full refund, no
        receipt required. {aiLabel}
      </ChatRow>
    </section>
  );
}

function O2Scenario() {
  const [isEdited, setIsEdited] = useState(false);
  const original =
    'Bonjour, merci de nous avoir contactés. Nous traitons votre demande dès que possible.';
  const edited =
    'Bonjour ! Merci de votre message — nous revenons vers vous très vite avec une solution.';

  const aiLabel = makeAILabel({
    heading: 'Translation generated',
    body: 'Machine-translated from English to French. A human can revert to the original AI output at any time.',
    kind: 'inline',
    size: 'xs',
    revertActive: isEdited,
    onRevertClick: () => setIsEdited(false),
  });

  return (
    <section className="chat-scenario">
      <LevelTag
        level="O2"
        title="Translated reply"
        requirement="Ship requirement: disclosure plus a revert-to-AI-content interaction."
      />
      <ChatRow from="customer">
        Can you reply to this French customer for me?
      </ChatRow>
      <ChatRow from="ai">
        {isEdited ? edited : original} {aiLabel}
      </ChatRow>
      <div className="chat-controls">
        <Tag type={isEdited ? 'purple' : 'blue'}>
          {isEdited ? 'Human-edited' : 'AI-generated'}
        </Tag>
        <Button
          kind="tertiary"
          size="sm"
          onClick={() => setIsEdited(true)}
          disabled={isEdited}
        >
          Simulate human edit
        </Button>
      </div>
    </section>
  );
}

function O3Scenario() {
  const [decision, setDecision] = useState(null);

  const aiLabel = makeAILabel({
    heading: 'Reply drafted',
    body: 'This reply was drafted from the customer message and prior thread context. Nothing is sent until confirmed.',
    kind: 'inline',
    size: 'xs',
  });

  return (
    <section className="chat-scenario">
      <LevelTag
        level="O3"
        title="Drafted apology"
        requirement="Ship requirement: explicit Confirm or Cancel before the action takes effect."
      />
      <ChatRow from="customer">
        The customer&rsquo;s asking about the shipping delay again, can you draft
        an apology?
      </ChatRow>
      <ChatRow from="ai">
        Thanks for flagging this — I&rsquo;ve escalated your ticket to our
        logistics team and you should see an update within 48 hours. {aiLabel}
      </ChatRow>
      {!decision && (
        <div className="chat-controls">
          <Button kind="primary" size="sm" onClick={() => setDecision('confirmed')}>
            Confirm
          </Button>
          <Button kind="secondary" size="sm" onClick={() => setDecision('cancelled')}>
            Cancel
          </Button>
        </div>
      )}
      {decision && (
        <ChatRow from="system">
          {decision === 'confirmed'
            ? 'Reply sent to the customer.'
            : 'Draft discarded. Nothing was sent.'}
        </ChatRow>
      )}
    </section>
  );
}

function O4Scenario() {
  const [approver, setApprover] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const aiLabel = makeAILabel({
    heading: 'Refund recommended',
    body: 'Recommended based on the order history and stated reason. Requires sign-off from a named approver before it can be issued.',
    kind: 'inline',
    size: 'xs',
  });

  return (
    <section className="chat-scenario">
      <LevelTag
        level="O4"
        title="Recommended refund"
        requirement="Ship requirement: confirm action stays disabled until a specific named approver is selected."
      />
      <ChatRow from="customer">
        This customer wants a refund for order #48213, can you handle it?
      </ChatRow>
      <ChatRow from="ai">
        I recommend issuing a full refund of $84.00 for order #48213. {aiLabel}
      </ChatRow>
      {!confirmed && (
        <div className="chat-controls">
          <Select
            id="chat-o4-approver"
            labelText="Approver"
            value={approver}
            onChange={(e) => setApprover(e.target.value)}
          >
            <SelectItem value="" text="Select an approver" />
            {APPROVERS.map((name) => (
              <SelectItem key={name} value={name} text={name} />
            ))}
          </Select>
          <Button
            kind="primary"
            size="sm"
            disabled={!approver}
            onClick={() => setConfirmed(true)}
          >
            Confirm refund
          </Button>
        </div>
      )}
      {confirmed && (
        <ChatRow from="system">Refund approved by {approver}.</ChatRow>
      )}
    </section>
  );
}

function O5Scenario() {
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
    body: 'This account ownership transfer was flagged as high impact. It requires two different named reviewers before it can be unlocked.',
    kind: 'inline',
    size: 'xs',
  });

  return (
    <section className="chat-scenario">
      <LevelTag
        level="O5"
        title="Flagged ownership transfer"
        requirement="Ship requirement: two different named reviewers required to unlock, with each approval logged to a visible audit trail."
      />
      <ChatRow from="customer">
        This customer wants to transfer account ownership — flagging for
        review before I do anything.
      </ChatRow>
      <ChatRow from="ai">
        Transferring ownership of this account is a high-impact, irreversible
        change. {aiLabel}
      </ChatRow>
      <div className="chat-controls">
        <Select
          id="chat-o5-reviewer1"
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
          id="chat-o5-reviewer2"
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
        <ChatRow from="system">Ownership transfer unlocked and applied.</ChatRow>
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
    </section>
  );
}

function ChatbotDemo() {
  return (
    <div className="chatbot-demo">
      <O1Scenario />
      <O2Scenario />
      <O3Scenario />
      <O4Scenario />
      <O5Scenario />
    </div>
  );
}

export default ChatbotDemo;
