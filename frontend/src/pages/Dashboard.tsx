import { ArrowRight, ArrowUpRight, ClipboardCheck, Clock3, FileCheck2, FileText, Plus, ShieldAlert, ShieldCheck, TrendingUp, WalletCards } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';
import { PageHeader, StatCard } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';

const chartData = [{ name: 'Pass', value: 18, color: '#16a34a' }, { name: 'Fail', value: 5, color: '#dc2626' }, { name: 'Pending', value: 7, color: '#d97706' }];

export default function Dashboard() {
  const { user, tenders, bids, documents, audit } = useApp();
  const navigate = useNavigate();
  const officer = user?.role === 'officer';
  const pending = bids.filter(b => b.status === 'Submitted' || b.status === 'Under Review' || b.status === 'Clarification Required').length;
  const needsReview = bids.filter(b => b.mandatoryFailures > 0 || b.pendingChecks > 0).length;
  const activeTenders = tenders.filter(t => t.status === 'Open' || t.status === 'Closing Soon').length;
  return <div className="page-stack">
    <PageHeader eyebrow="OVERVIEW" title={officer ? 'Procurement dashboard' : 'Bidder dashboard'} description={`Good morning, ${user?.name.split(' ')[0]}. Here’s your workspace snapshot.`} actions={<><span className="demo-chip"><span /> DEMO DATA</span>{officer ? <button className="button button-primary" onClick={() => navigate('/tenders?create=1')}><Plus size={16} /> Create tender</button> : <button className="button button-primary" onClick={() => navigate('/submit-bid')}><Plus size={16} /> Submit a bid</button>}</>} />
    <div className="stats-grid">
      <StatCard title={officer ? 'Active tenders' : 'Available tenders'} value={activeTenders} note="Open for submissions" icon={ClipboardCheck} tone="blue" />
      <StatCard title={officer ? 'Total bids received' : 'My submitted bids'} value={officer ? bids.length : bids.filter(b => b.bidder === user?.organization).length} note="Across demo tenders" icon={FileText} tone="green" />
      <StatCard title={officer ? 'Pending verification' : 'Documents awaiting review'} value={officer ? pending : documents.filter(d => d.status === 'Manual Review' || d.status === 'Queued').length} note="Needs follow-up" icon={Clock3} tone="amber" />
      <StatCard title={officer ? 'Bids requiring review' : 'Verification issues'} value={officer ? needsReview : bids.filter(b => b.mandatoryFailures > 0).length} note="Mandatory or pending checks" icon={ShieldAlert} tone="red" />
    </div>

    <div className="dashboard-grid">
      <section className="panel compliance-panel"><div className="panel-heading"><div><h2>Compliance overview</h2><p>Criterion results from a seeded demo assessment</p></div><Link to="/compliance" className="text-link">View assessment <ArrowRight size={14} /></Link></div>
        <div className="chart-wrap"><div className="donut-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={84} paddingAngle={3} stroke="none">{chartData.map(entry => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="donut-center"><strong>30</strong><span>Checks</span></div></div><div className="legend-list">{chartData.map(d => <div className="legend-item" key={d.name}><span className="legend-dot" style={{ background: d.color }} /><span>{d.name}</span><strong>{d.value}</strong></div>)}<p className="chart-disclaimer">Illustrative sample results only</p></div></div>
      </section>
      <section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Latest actions recorded in this browser</p></div><Link to="/audit" className="text-link">View audit log <ArrowRight size={14} /></Link></div>
        <div className="activity-list">{audit.slice(0, 4).map((item, i) => <div className="activity-row" key={item.id}><span className={`activity-icon activity-${i % 4}`}>{i === 0 ? <FileCheck2 size={16} /> : i === 1 ? <ShieldCheck size={16} /> : i === 2 ? <ClipboardCheck size={16} /> : <WalletCards size={16} />}</span><span className="activity-copy"><strong>{item.action.replaceAll('_', ' ')}</strong><small>{item.description}</small><em>{item.timestamp} · {item.user}</em></span></div>)}</div>
      </section>
    </div>

    <section className="panel"><div className="panel-heading"><div><h2>{officer ? 'Recent bid submissions' : 'My recent submissions'}</h2><p>{officer ? 'A quick view of bids that may need attention' : 'Track the status of your submitted bids'}</p></div><Link to="/bids" className="text-link">View all bids <ArrowRight size={14} /></Link></div>
      <div className="table-scroll"><table><thead><tr><th>Bid reference</th><th>Tender</th><th>Bidder / vendor</th><th>Submitted</th><th>Documents</th><th>Status</th><th></th></tr></thead><tbody>{bids.slice(0, 4).map(bid => <tr key={bid.id}><td><strong className="table-primary">{bid.id}</strong></td><td><span className="table-title">{bid.tenderTitle}</span><small className="table-sub">{bid.tenderId}</small></td><td>{bid.bidder}</td><td>{new Date(bid.submittedAt).toLocaleDateString('en-IN')}</td><td><span className="doc-count"><FileText size={14} /> {bid.documents}</span></td><td><StatusBadge>{bid.status}</StatusBadge></td><td><button className="table-action" onClick={() => navigate(officer ? '/review' : '/reports')}>Open <ArrowUpRight size={14} /></button></td></tr>)}</tbody></table></div>
      {bids.length === 0 && <div className="empty-state"><FileText size={28} /><strong>No bids yet</strong><p>Submit a bid to start using the demo workflow.</p><button className="button button-primary" onClick={() => navigate('/submit-bid')}>Start bid submission</button></div>}
    </section>
    <div className="quick-actions-grid">
      <button className="quick-action" onClick={() => navigate('/tenders')}><span className="quick-action-icon blue"><ClipboardCheck size={19} /></span><span><strong>Explore tenders</strong><small>Review scope and requirements</small></span><ArrowRight size={16} /></button>
      <button className="quick-action" onClick={() => navigate(officer ? '/compliance' : '/documents')}><span className="quick-action-icon green"><FileCheck2 size={19} /></span><span><strong>{officer ? 'Review compliance' : 'Manage documents'}</strong><small>{officer ? 'Inspect checks and evidence' : 'Check document status'}</small></span><ArrowRight size={16} /></button>
      <button className="quick-action" onClick={() => navigate('/reports')}><span className="quick-action-icon amber"><TrendingUp size={19} /></span><span><strong>Verification reports</strong><small>View and export sample results</small></span><ArrowRight size={16} /></button>
    </div>
  </div>;
}
