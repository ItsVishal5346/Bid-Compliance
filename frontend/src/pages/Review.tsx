import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ClipboardCheck, FileCheck2, ShieldAlert } from 'lucide-react';
import { PageHeader, StatCard } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { useApp } from '../context/AppContext';
import type { BidStatus } from '../types';

export default function Review() {
  const { bids, updateBid, addAudit } = useApp();
  const [bidId, setBidId] = useState(bids[0]?.id ?? '');
  const [remarks, setRemarks] = useState('');
  const [decision, setDecision] = useState<BidStatus>('Under Review');
  const [dialog, setDialog] = useState(false);
  const bid = useMemo(() => bids.find(b => b.id === bidId), [bids, bidId]);
  const record = () => {
    if (!bid) return;
    updateBid(bid.id, { status: decision, reviewRemarks: remarks.trim() || 'No remarks entered.' });
    addAudit('DECISION_RECORDED', 'Bid', bid.id, 'Simulated officer decision recorded: ' + decision + '.');
    setDialog(false);
  };
  return <div className="page-stack"><PageHeader eyebrow="OFFICER WORKSPACE" title="Review & decisions" description="Review sample flags and record a simulated decision. A compliance score never auto-approves a bid." actions={<span className="demo-chip"><span /> OFFICER DEMO</span>} />
    <section className="panel assessment-selector"><div><label>Select bid to review</label><select value={bidId} onChange={e => { setBidId(e.target.value); setRemarks(''); setDecision('Under Review'); }}>{bids.map(b => <option key={b.id} value={b.id}>{b.id} — {b.bidder}</option>)}</select></div><div className="assessment-status"><span>Current status</span>{bid && <StatusBadge>{bid.status}</StatusBadge>}</div></section>
    {bid ? <><div className="stats-grid"><StatCard title="Compliance score" value={bid.complianceScore ? bid.complianceScore + '%' : 'Not assessed'} note="Illustrative value only" icon={ClipboardCheck} tone="blue" /><StatCard title="Mandatory failures" value={bid.mandatoryFailures} note="Review source evidence" icon={ShieldAlert} tone="red" /><StatCard title="Pending checks" value={bid.pendingChecks} note="Must not be treated as pass" icon={AlertCircle} tone="amber" /><StatCard title="Documents received" value={bid.documents} note="Count of demo file records" icon={FileCheck2} tone="green" /></div>
      <div className="dashboard-grid"><section className="panel review-detail"><div className="panel-heading"><div><h2>Bid overview</h2><p>{bid.id} · {bid.tenderId}</p></div></div><div className="details-list"><div><span>Tender title</span><strong>{bid.tenderTitle}</strong></div><div><span>Bidder / vendor</span><strong>{bid.bidder}</strong></div><div><span>Submitted date</span><strong>{new Date(bid.submittedAt).toLocaleString('en-IN')}</strong></div><div><span>Required review</span><strong>{bid.mandatoryFailures || bid.pendingChecks ? 'Further review indicated' : 'No open flags in this sample'}</strong></div></div><div className="review-alert-list">{bid.mandatoryFailures > 0 && <div className="inline-alert danger"><AlertCircle size={17} /><span>{bid.mandatoryFailures} mandatory failure(s) are recorded in this demo bid.</span></div>}{bid.pendingChecks > 0 && <div className="inline-alert warning"><AlertCircle size={17} /><span>{bid.pendingChecks} pending check(s) require evidence review.</span></div>}{bid.mandatoryFailures === 0 && bid.pendingChecks === 0 && <div className="inline-alert success"><CheckCircle2 size={17} /><span>No open flags are stored for this example. A final decision still requires an officer action.</span></div>}</div><button className="button button-secondary" onClick={() => window.print()}>Print review summary</button></section>
        <section className="panel decision-panel"><div className="panel-heading"><div><h2>Officer review</h2><p>Remarks and final demo decision</p></div></div><label>Review remarks</label><textarea rows={5} value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Record evidence reviewed, questions, or rationale..." /><label>Simulated decision</label><select value={decision} onChange={e => setDecision(e.target.value as BidStatus)}><option value="Under Review">Pending Review</option><option value="Clarification Required">Clarification Required</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select><div className="inline-alert warning"><ShieldAlert size={17} /><span>This is a local prototype decision, not a procurement action. Confirm all mandatory criteria and source evidence independently.</span></div><button className="button button-primary button-full" onClick={() => setDialog(true)}>Review and record decision</button></section></div>
      {bid.reviewRemarks && <section className="panel"><div className="panel-heading"><div><h2>Previous review remarks</h2><p>Saved in local demo state</p></div></div><p>{bid.reviewRemarks}</p></section>}
    </> : <div className="empty-state">No bids available for review.</div>}
    {dialog && bid && <Modal title="Confirm demo decision" onClose={() => setDialog(false)}><div className="decision-confirm"><span className="decision-confirm-icon"><ClipboardCheck size={24} /></span><h3>Record “{decision === 'Under Review' ? 'Pending Review' : decision}”?</h3><p>This updates only the local browser state for {bid.id}. It does not notify a bidder or submit anything to GeM.</p><div className="decision-confirm-summary"><span>Mandatory failures</span><strong className={bid.mandatoryFailures ? 'text-danger' : ''}>{bid.mandatoryFailures}</strong><span>Pending checks</span><strong>{bid.pendingChecks}</strong></div></div><div className="form-actions"><button className="button button-secondary" onClick={() => setDialog(false)}>Cancel</button><button className="button button-primary" onClick={record}>Confirm decision</button></div></Modal>}
  </div>;
}
