import { useMemo, useState } from 'react';
import { ArrowUpRight, FileText, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useApp } from '../context/AppContext';

export default function Bids() {
  const { user, bids } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const rows = useMemo(() => bids.filter(b => {
    const owned = user?.role === 'officer' || b.bidder === user?.organization;
    const q = search.toLowerCase();
    return owned && (!q || b.id.toLowerCase().includes(q) || b.tenderTitle.toLowerCase().includes(q) || b.bidder.toLowerCase().includes(q)) && (status === 'All' || b.status === status);
  }), [bids, search, status, user]);
  const officer = user?.role === 'officer';
  return <div className="page-stack">
    <PageHeader eyebrow="SUBMISSIONS" title={officer ? 'Bid submissions' : 'My bid submissions'} description={officer ? 'Review incoming fictional bids and find items requiring attention.' : 'Track your local demo submissions and their current workflow status.'} />
    <section className="panel table-panel"><div className="filter-toolbar"><div className="search-field"><Search size={16} /><input placeholder="Search bids, tender, bidder..." value={search} onChange={e => setSearch(e.target.value)} /></div><div className="filter-label"><SlidersHorizontal size={15} /><select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter bid status"><option>All</option><option>Submitted</option><option>Under Review</option><option>Clarification Required</option><option>Approved</option><option>Rejected</option></select></div><span className="results-count">{rows.length} records</span></div>
      <div className="table-scroll"><table><thead><tr><th>Bid ID</th><th>Tender</th><th>Bidder / vendor</th><th>Submitted on</th><th>Documents</th><th>Compliance score</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map(b => <tr key={b.id}><td><strong className="table-primary">{b.id}</strong></td><td><span className="table-title">{b.tenderTitle}</span><small className="table-sub">{b.tenderId}</small></td><td>{b.bidder}</td><td>{new Date(b.submittedAt).toLocaleDateString('en-IN')}</td><td><span className="doc-count"><FileText size={14} /> {b.documents}</span></td><td><span className={`score-text ${b.complianceScore >= 80 ? 'score-good' : b.complianceScore > 0 ? 'score-warn' : ''}`}>{b.complianceScore ? `${b.complianceScore}%` : 'Not assessed'}</span></td><td><StatusBadge>{b.status}</StatusBadge></td><td><button className="table-action" onClick={() => navigate(officer ? '/review' : '/reports')}>{officer ? 'Review' : 'Details'} <ArrowUpRight size={14} /></button></td></tr>)}</tbody></table></div>
      {rows.length === 0 && <div className="empty-state"><FileText size={28} /><strong>No matching bids</strong><p>Adjust your filters or submit a new demo bid.</p>{!officer && <button className="button button-primary" onClick={() => navigate('/submit-bid')}>Submit a bid</button>}</div>}
    </section>
    <div className="prototype-note"><SlidersHorizontal size={16} /> Scores and statuses are illustrative demo fields, not official eligibility decisions.</div>
  </div>;
}
