import { useState } from 'react';
import { Tile, Button, Select, SelectItem, Tag } from '@carbon/react';
import { Locked, Unlocked } from '@carbon/icons-react';
import { APPROVERS, makeAILabel } from './aiLabel';
import ApprovalGate from './ApprovalGate';

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

function O1CaseNoteSummary() {
  const aiLabel = makeAILabel({
    heading: 'Note generated',
    body: 'Drafted from the caseworker’s dictated visit notes for the case file. Not a decision or recommendation — shown for reference only.',
    kind: 'inline',
    size: 'xs',
  });

  return (
    <section className="anomaly-scenario">
      <LevelTag
        level="O1"
        title="Case note summary"
        requirement="Ship requirement: disclosure only, no confirmation gate."
      />
      <Tile className="anomaly-tile">
        <div className="anomaly-tile-header">
          <p className="anomaly-metric">Case: Family Jensen &mdash; home visit follow-up</p>
          {aiLabel}
        </div>
        <p className="anomaly-note">
          Home conditions appeared stable. Both children were present and
          engaged during the visit. No new concerns raised by the family.
        </p>
      </Tile>
    </section>
  );
}

function O2ActionPlanWording() {
  const [dismissed, setDismissed] = useState(false);

  const aiLabel = makeAILabel({
    heading: 'Wording generated',
    body: 'Drafted from the goals discussed in the last case review. The caseworker can dismiss it if it doesn’t reflect the citizen’s own words.',
    kind: 'inline',
    size: 'xs',
    revertActive: dismissed,
    onRevertClick: () => setDismissed(false),
  });

  return (
    <section className="anomaly-scenario">
      <LevelTag
        level="O2"
        title="Action plan wording"
        requirement="Ship requirement: disclosure plus a revert-to-AI-content interaction."
      />
      <Tile className="anomaly-tile">
        <div className="anomaly-tile-header">
          <p className="anomaly-metric">Citizen: L. Berg &mdash; employment support plan</p>
          {aiLabel}
        </div>
        <p className="anomaly-note">
          {dismissed
            ? 'AI wording dismissed. Section left blank for the caseworker to write.'
            : '"Goal: complete a work-readiness course within 8 weeks, with weekly check-ins to track progress."'}
        </p>
        <div className="anomaly-controls">
          <Tag type={dismissed ? 'gray' : 'blue'}>
            {dismissed ? 'Blank, pending caseworker' : 'AI-suggested'}
          </Tag>
          <Button
            kind="tertiary"
            size="sm"
            onClick={() => setDismissed(true)}
            disabled={dismissed}
          >
            Dismiss AI wording
          </Button>
        </div>
      </Tile>
    </section>
  );
}

function O3RiskAssessmentDraft() {
  const [decision, setDecision] = useState(null);

  const aiLabel = makeAILabel({
    heading: 'Risk assessment drafted',
    body: 'Drafted from recent case notes and the citizen’s housing history. Nothing is added to the case file until confirmed.',
    kind: 'inline',
    size: 'xs',
  });

  return (
    <section className="anomaly-scenario">
      <LevelTag
        level="O3"
        title="Housing instability risk note"
        requirement="Ship requirement: explicit Confirm or Cancel before the action takes effect."
      />
      <Tile className="anomaly-tile">
        <div className="anomaly-tile-header">
          <p className="anomaly-metric">Citizen: A. Madsen &mdash; housing risk assessment</p>
          {aiLabel}
        </div>
        <p className="anomaly-note">
          Recommended note: &ldquo;Moderate risk of housing instability due to
          upcoming lease expiry and no confirmed alternative address.&rdquo;
        </p>
        {!decision && (
          <div className="anomaly-controls">
            <Button kind="primary" size="sm" onClick={() => setDecision('confirmed')}>
              Confirm
            </Button>
            <Button kind="secondary" size="sm" onClick={() => setDecision('cancelled')}>
              Cancel
            </Button>
          </div>
        )}
        {decision && (
          <p className={`oversight-result ${decision}`}>
            {decision === 'confirmed'
              ? 'Risk note added to the case file.'
              : 'Draft discarded. Case file unchanged.'}
          </p>
        )}
      </Tile>
    </section>
  );
}

function O4MedicationDispensingChange() {
  const aiLabel = makeAILabel({
    heading: 'Dispensing change recommended',
    body: 'Recommended based on the resident’s updated care plan. Selecting a named caseworker only requests their sign-off — the schedule is not changed until they actually approve it.',
    kind: 'inline',
    size: 'xs',
  });

  return (
    <section className="anomaly-scenario">
      <LevelTag
        level="O4"
        title="Medication dispensing change"
        requirement="Ship requirement: the named approver must explicitly approve — selecting their name alone does not release the change."
      />
      <Tile className="anomaly-tile">
        <div className="anomaly-tile-header">
          <p className="anomaly-metric">Resident: T. Holm &mdash; daily medication schedule</p>
          {aiLabel}
        </div>
        <p className="anomaly-note">
          Recommended action: move evening dose from 20:00 to 18:00 to align
          with the updated care plan.
        </p>
        <ApprovalGate
          id="social-o4-approver"
          approverFieldLabel="Approving caseworker"
          approvers={APPROVERS}
          requestLabel="Request approval"
          renderPending={(name) => (
            <p className="oversight-result">
              Waiting for {name} to approve the schedule change.
            </p>
          )}
          renderApproved={(name) => (
            <p className="oversight-result confirmed">
              Dispensing schedule changed by {name}.
            </p>
          )}
          renderDenied={(name) => (
            <p className="oversight-result cancelled">
              Schedule change declined by {name}. Left unchanged.
            </p>
          )}
        />
      </Tile>
    </section>
  );
}

function O5ChildProtectionEscalation() {
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
    if (name) logApproval('Caseworker 1', name);
  };

  const handleReviewer2Change = (e) => {
    const name = e.target.value;
    setReviewer2(name);
    setUnlocked(false);
    if (name) logApproval('Caseworker 2', name);
  };

  const handleUnlock = () => {
    setUnlocked(true);
    logApproval('Escalation authorized', `${reviewer1} + ${reviewer2}`);
  };

  const aiLabel = makeAILabel({
    heading: 'Elevated risk pattern flagged',
    body: 'Flagged because recent case notes match a pattern associated with elevated child-safety risk. Requires two different named caseworkers before this is escalated to child protection.',
    kind: 'inline',
    size: 'xs',
  });

  return (
    <section className="anomaly-scenario">
      <LevelTag
        level="O5"
        title="Child-protection risk escalation"
        requirement="Ship requirement: two different named reviewers required to unlock, with each approval logged to a visible audit trail."
      />
      <Tile className="anomaly-tile">
        <div className="anomaly-tile-header">
          <p className="anomaly-metric">Case: Family Nissen &mdash; minor in household</p>
          {aiLabel}
        </div>
        <p className="anomaly-note">
          Recommended action: escalate to the child protection team for
          immediate review.
        </p>
        <div className="anomaly-controls">
          <Select
            id="social-o5-reviewer1"
            labelText="Caseworker 1"
            value={reviewer1}
            onChange={handleReviewer1Change}
          >
            <SelectItem value="" text="Select a caseworker" />
            {APPROVERS.map((name) => (
              <SelectItem key={name} value={name} text={name} />
            ))}
          </Select>
          <Select
            id="social-o5-reviewer2"
            labelText="Caseworker 2"
            value={reviewer2}
            onChange={handleReviewer2Change}
          >
            <SelectItem value="" text="Select a caseworker" />
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
            Caseworker 1 and Caseworker 2 must be different people.
          </p>
        )}
        {unlocked && (
          <p className="oversight-result confirmed">
            Case escalated to the child protection team.
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
      </Tile>
    </section>
  );
}

function SocialServicesDemo() {
  return (
    <div className="dashboard-demo">
      <O1CaseNoteSummary />
      <O2ActionPlanWording />
      <O3RiskAssessmentDraft />
      <O4MedicationDispensingChange />
      <O5ChildProtectionEscalation />
    </div>
  );
}

export default SocialServicesDemo;
