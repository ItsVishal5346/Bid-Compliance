import { useMemo, useState } from 'react';
import { Download, FileBarChart, FileText, Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useApp } from '../context/AppContext';

export default function Reports() {
  const { user, bids, addAudit } = useApp();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const rows = useMemo(() => bids.filter(b => (user?.role === 'officer' || b.bidder === user?.organization) && (!query || b.id.toLowerCase().includes(query.toLowerCase()) || b.tenderTitle.toLowerCase().includes(query.toLowerCase()) || b.bidder.toLowerCase().includes(query.toLowerCase())) && (status === 'All' || b.status === status)), [bids, user, query, status]);
  const exportCsv = () => {
    const header = ['Report ID','Bid ID','Tender','Bidder','Assessment Date','Status','Demo Score','Mandatory Failures','Pending Checks'];
    const lines = rows.map((b, i) => {
      const values = ['RPT-DEMO-' + String(i + 1).padStart(4, '0'), b.id, b.tenderTitle, b.bidder, new Date(b.submittedAt).toLocaleDateString('en-IN'), b.status, b.complianceScore || 'Not assessed', b.mandatoryFailures, b.pendingChecks];
      return values.map(v => '"' + String(v).replaceAll('"', '""') + '"').join(',');
    });
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'bidsure-demo-reports.csv'; link.click(); URL.revokeObjectURL(url);
    addAudit('REPORT_EXPORTED', 'Report', 'CSV-DEMO', 'Downloaded a CSV export from local demo state.');
  };
  return <div className="page-stack"><PageHeader eyebrow="REPORTING" title="Verification reports" description="Review prototype assessment summaries and export the visible dataset." actions={<button className="button button-primary" onClick={exportCsv}><Download size={16} /> Export CSV</button>} />
    <div className="report-disclaimer"><FileBarChart size={19} /><div><strong>DEMO DATA — NOT AN OFFICIAL GeM REPORT</strong><p>Reports summarize fictional bid records and seeded sample checks. No official eligibility determination is represented.</p></div></div>
    <section className="panel table-panel"><div className="filter-toolbar"><div className="search-field"><Search size={16} /><input placeholder="Search report, bid, tender or bidder" value={query} onChange={e => setQuery(e.target.value)} /></div><select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter reports by status"><option>All</option><option>Submitted</option><option>Under Review</option><option>Clarification Required</option><option>Approved</option><option>Rejected</option></select><span className="results-count">{rows.length} reports</span></div>
      <div className="table-scroll"><table><thead><tr><th>Report ID</th><th>Bid ID</th><th>Tender title</th><th>Bidder</th><th>Assessment date</th><th>Status</th><th>Score</th><th>Action</th></tr></thead><tbody>{rows.map((b, i) => <tr key={b.id}><td><strong className="table-primary">{'RPT-DEMO-' + String(i + 1).padStart(4, '0')}</strong><small className="table-sub">Prototype report</small></td><td>{b.id}</td><td>{b.tenderTitle}</td><td>{b.bidder}</td><td>{new Date(b.submittedAt).toLocaleDateString('en-IN')}</td><td><StatusBadge>{b.status}</StatusBadge></td><td>{b.complianceScore ? b.complianceScore + '%' : 'Not assessed'}</td><td><button className="table-action" onClick={() => window.print()}><FileText size={14} /> View / print</button></td></tr>)}</tbody></table></div>
      {rows.length === 0 && <div className="empty-state"><FileBarChart size={28} /><strong>No reports found</strong><p>Try another filter or search term.</p></div>}
    </section>
    <section className="panel report-method"><div className="panel-heading"><div><h2>Report scoring notes</h2><p>How to interpret the demo fields</p></div></div><div className="report-method-grid"><div><strong>Not assessed</strong><p>New demo bids start without a compliance score until sample checks are reviewed.</p></div><div><strong>Mandatory failures</strong><p>Failures are surfaced separately and should not be hidden by a combined score.</p></div><div><strong>Officer decision</strong><p>Only an explicitly recorded officer action changes the demo decision state.</p></div></div></section>
  </div>;
}