import { useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, ClipboardCheck, FileCheck2, Search, ShieldAlert } from 'lucide-react';
import { PageHeader, StatCard } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { useApp } from '../context/AppContext';
import { initialChecks } from '../data/mockData';
import type { ComplianceCheck } from '../types';

export default function Compliance() {
  const { bids, user } = useApp();
  const [bidId, setBidId] = useState('BID-2026-0184');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ComplianceCheck | null>(null);
  const checks = initialChecks;
  const currentBid = bids.find(b => b.id === bidId) ?? bids[0];
  const viewChecks = useMemo(() => checks.filter(c => (filter === 'All' || c.status === filter) && (!search || c.criterion.toLowerCase().includes(search.toLowerCase()) || c.document.toLowerCase().includes(search.toLowerCase()))), [filter, search]);
  const fails = checks.filter(c => c.status === 'FAIL').length;
  const pending = checks.filter(c => c.status === 'PENDING REVIEW').length;
  const passes = checks.filter(c => c.status === 'PASS').length;
  return <div className="page-stack">
    <PageHeader eyebrow="RULE-BASED WORKSPACE" title="Compliance verification" description="Inspect criterion-level outcomes, requirements and evidence references. Results shown here are seeded fictional data." actions={<span className="demo-chip"><span /> SAMPLE ASSESSMENT</span>} />
    <section className="panel assessment-selector"><div><label>Assessment / bid reference</label><select value={bidId} onChange={e => setBidId(e.target.value)}>{bids.map(b => <option key={b.id} value={b.id}>{b.id} — {b.bidder}</option>)}</select></div><div className="assessment-status"><span>Assessment status</span><StatusBadge>{currentBid?.status ?? 'Pending Review'}</StatusBadge></div></section>
    <div className="stats-grid"><StatCard title="Overall sample score" value={currentBid?.complianceScore ? `${currentBid.complianceScore}%` : 'Not assessed'} note="Score alone does not establish eligibility" icon={ClipboardCheck} tone="blue" /><StatCard title="Mandatory failures" value={fails} note="Must be resolved by officer review" icon={ShieldAlert} tone="red" /><StatCard title="Pending checks" value={pending} note="Pending is not a pass" icon={AlertCircle} tone="amber" /><StatCard title="Passed checks" value={passes} note="Seeded example outcomes" icon={FileCheck2} tone="green" /></div>
    <section className="panel table-panel"><div className="panel-heading"><div><h2>Criterion-wise verification</h2><p>{currentBid?.tenderTitle ?? 'Selected assessment'} · {checks.length} checks in the demo rule set</p></div></div><div className="filter-toolbar"><div className="search-field"><Search size={16} /><input placeholder="Search criteria or documents" value={search} onChange={e => setSearch(e.target.value)} /></div><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter compliance status"><option>All</option><option>PASS</option><option>FAIL</option><option>PENDING REVIEW</option><option>NOT APPLICABLE</option></select><span className="results-count">{viewChecks.length} criteria</span></div>
      <div className="table-scroll"><table><thead><tr><th>Criterion</th><th>Requirement</th><th>Document</th><th>Actual value</th><th>Expected condition</th><th>Status</th><th>Evidence</th><th></th></tr></thead><tbody>{viewChecks.map(c => <tr key={c.id}><td><strong className="table-primary">{c.criterion}</strong><small className="table-sub">{c.id}</small></td><td>{c.requirement}</td><td>{c.document}</td><td>{c.actual}</td><td>{c.expected}</td><td><StatusBadge>{c.status}</StatusBadge></td><td>{c.evidence}</td><td><button className="table-action" onClick={() => setSelected(c)}>Details <ArrowRight size={13} /></button></td></tr>)}</tbody></table></div>
      {viewChecks.length === 0 && <div className="empty-state"><Search size={25} /><strong>No criteria found</strong><p>Try another search or status.</p></div>}
    </section>
    <div className="principles-grid"><div className="principle-card principle-danger"><ShieldAlert size={19} /><div><strong>Mandatory failures remain failures</strong><p>A high overall score must not override a mandatory criterion failure.</p></div></div><div className="principle-card principle-warning"><AlertCircle size={19} /><div><strong>Pending is not passing</strong><p>Checks requiring more evidence must stay pending until reviewed.</p></div></div><div className="principle-card principle-info"><ClipboardCheck size={19} /><div><strong>Officer retains final authority</strong><p>This academic prototype never makes a real procurement determination.</p></div></div></div>
    {selected && <Modal title="Verification criterion details" onClose={() => setSelected(null)}><div className="criterion-title"><StatusBadge>{selected.status}</StatusBadge><h3>{selected.criterion}</h3><p>{selected.requirement}</p></div><div className="details-list"><div><span>Expected condition</span><strong>{selected.expected}</strong></div><div><span>Sample actual value</span><strong>{selected.actual}</strong></div><div><span>Document reference</span><strong>{selected.document}</strong></div><div><span>Evidence ID</span><strong>{selected.evidence}</strong></div></div><div className="explanation-box"><strong>Verification explanation</strong><p>{selected.explanation}</p></div><div className="inline-alert warning"><AlertCircle size={16} /><span>Seeded sample data only. The content of local documents was not analyzed. {user?.role === 'officer' ? 'Use the review page to record a simulated decision.' : 'Contact the procurement officer for an official determination.'}</span></div><button className="button button-secondary button-full" onClick={() => setSelected(null)}>Close</button></Modal>}
  </div>;
}