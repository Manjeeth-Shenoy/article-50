import { useState } from 'react';
import { Select, SelectItem, Button } from '@carbon/react';

function defaultPending(name) {
  return <p className="oversight-result">Waiting for {name} to approve.</p>;
}

function defaultApproved(name) {
  return <p className="oversight-result confirmed">Approved by {name}.</p>;
}

function defaultDenied(name) {
  return <p className="oversight-result cancelled">Declined by {name}. Not published.</p>;
}

/**
 * Selecting a named approver is not the same as that person approving.
 * This models it as two distinct steps: request approval from the named
 * person, then a separate "Approve as <name>" action before anything
 * proceeds. Nothing is published/applied if that second step never happens.
 */
function ApprovalGate({
  id,
  approverFieldLabel = 'Approver',
  approvers,
  requestLabel = 'Request approval',
  renderPending = defaultPending,
  renderApproved = defaultApproved,
  renderDenied = defaultDenied,
  onApprove,
  onDeny,
}) {
  const [approver, setApprover] = useState('');
  const [status, setStatus] = useState('idle');

  const handleApproverChange = (e) => {
    setApprover(e.target.value);
    setStatus('idle');
  };

  const handleRequest = () => setStatus('pending');

  const handleApprove = () => {
    setStatus('approved');
    onApprove?.(approver);
  };

  const handleDeny = () => {
    setStatus('denied');
    onDeny?.(approver);
  };

  return (
    <div className="approval-gate">
      <div className="anomaly-controls">
        <Select
          id={id}
          labelText={approverFieldLabel}
          value={approver}
          onChange={handleApproverChange}
          disabled={status === 'pending' || status === 'approved'}
        >
          <SelectItem value="" text={`Select a ${approverFieldLabel.toLowerCase()}`} />
          {approvers.map((name) => (
            <SelectItem key={name} value={name} text={name} />
          ))}
        </Select>
        {status === 'idle' && (
          <Button kind="primary" size="sm" disabled={!approver} onClick={handleRequest}>
            {requestLabel}
          </Button>
        )}
        {status === 'pending' && (
          <>
            <Button kind="primary" size="sm" onClick={handleApprove}>
              Approve as {approver}
            </Button>
            <Button kind="secondary" size="sm" onClick={handleDeny}>
              Deny
            </Button>
          </>
        )}
      </div>
      {status === 'pending' && renderPending(approver)}
      {status === 'approved' && renderApproved(approver)}
      {status === 'denied' && renderDenied(approver)}
    </div>
  );
}

export default ApprovalGate;
