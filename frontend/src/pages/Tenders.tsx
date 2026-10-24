import { useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, FileText, Plus, Search } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import type { Tender } from '../types';

const tenderSchema = z.object({
  title: z.string().min(5, 'Enter a descriptive tender title.'),
  department: z.string().min(2, 'Enter a department name.'),
  deadline: z.string().min(1, 'Select a submission deadline.'),
  description: z.string().min(12, 'Add a short scope description.'),
  minTurnover: z.coerce.number().min(0, 'Turnover must be zero or more.'),
  requiredDocuments: z.string().min(3, 'List at least one document type.')
});
type TenderForm = z.infer<typeof tenderSchema>;

export default function Tenders() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, tenders, addTender, bids } = useApp();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [department, setDepartment] = useState('All');
  const [showCreate, setShowCreate] = useState(new URLSearchParams(location.search).get('create') === '1');
  const isOfficer = user?.role === 'officer';
  const tender = id ? tenders.find(t => t.id === id) : undefined;
  const departments = Array.from(new Set(tenders.map(t => t.department)));
  const filtered = useMemo(() => tenders.filter(t => {
    const q = search.toLowerCase();
    return (!q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) &&
      (status === 'All' || t.status === status) && (department === 'All' || t.department === department);
  }), [tenders, search, status, department]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TenderForm>({
    resolver: zodResolver(tenderSchema),
    defaultValues: { title: '', department: 'Department of Information Technology', deadline: '2026-12-15', description: '', minTurnover: 1000000, requiredDocuments: 'PAN Card, GST Registration, Turnover Certificate' }
  });
  const onCreate = (values: TenderForm) => {
    const newTender: Tender = {
      id: `GEM/2026/B/${String(Date.now()).slice(-7)}`, title: values.title, department: values.department,
      deadline: values.deadline, status: 'Open',
      requiredDocuments: values.requiredDocuments.split(',').map(x => x.trim()).filter(Boolean),
      description: values.description, minTurnover: values.minTurnover, bidCount: 0
    };
    addTender(newTender);
    setShowCreate(false); reset();
  };

  if (id && !tender) return <div className="page-stack"><PageHeader title="Tender not found" description="The requested tender is not in the local demo dataset." /><Link to="/tenders" className="button button-secondary">Back to tenders</Link></div>;
  if (tender) return <div className="page-stack">
    <button className="back-link" onClick={() => navigate('/tenders')}><ArrowLeft size={16} /> Back to tenders</button>
    <PageHeader eyebrow={tender.id} title={tender.title} description={tender.department} actions={<StatusBadge>{tender.status}</StatusBadge>} />
    <div className="detail-grid"><section className="panel detail-main"><div className="panel-heading"><div><h2>Tender overview</h2><p>Scope and submission requirements</p></div></div><p className="detail-description">{tender.description}</p><div className="detail-meta-grid"><div><span>Tender ID</span><strong>{tender.id}</strong></div><div><span>Submission deadline</span><strong><CalendarDays size={15} /> {new Date(tender.deadline + 'T00:00:00').toLocaleDateString('en-IN', { dateStyle: 'long' })}</strong></div><div><span>Department</span><strong>{tender.department}</strong></div><div><span>Minimum turnover (demo)</span><strong>₹{tender.minTurnover.toLocaleString('en-IN')}</strong></div></div><div className="section-divider" /><h3>Required document checklist</h3><div className="checklist">{tender.requiredDocuments.map(doc => <div key={doc} className="checklist-row"><span className="checklist-icon"><Check size={15} /></span><span>{doc}</span><small>Required</small></div>)}</div><div className="prototype-note in-panel-note">Requirements are example values for academic demonstration and are not taken from an official GeM tender.</div></section>
      <aside className="panel tender-summary"><h3>Submission summary</h3><div className="summary-kpi"><span>Current bid count</span><strong>{tender.bidCount + bids.filter(b => b.tenderId === tender.id).length}</strong></div><div className="summary-kpi"><span>Deadline</span><strong>{new Date(tender.deadline + 'T00:00:00').toLocaleDateString('en-IN')}</strong></div><div className="summary-kpi"><span>Required documents</span><strong>{tender.requiredDocuments.length}</strong></div>{user?.role === 'bidder' ? <button className="button button-primary button-full" disabled={tender.status === 'Closed'} onClick={() => navigate(`/submit-bid?tenderId=${encodeURIComponent(tender.id)}`)}>Submit bid <ArrowUpRight size={16} /></button> : <button className="button button-secondary button-full" onClick={() => navigate('/bids')}>View submissions <ArrowUpRight size={16} /></button>}<p className="muted tiny">Submission is simulated locally. No bid is sent to GeM.</p></aside></div>
  </div>;

  return <div className="page-stack">
    <PageHeader eyebrow="PROCUREMENT" title={isOfficer ? 'Tender management' : 'Available tenders'} description={isOfficer ? 'Create and manage the fictional tenders used in the demo workspace.' : 'Browse opportunities and review requirements before submitting a demo bid.'} actions={isOfficer && <button className="button button-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> Create tender</button>} />
    <section className="panel table-panel"><div className="filter-toolbar"><div className="search-field"><Search size={16} /><input placeholder="Search title or tender ID" value={search} onChange={e => setSearch(e.target.value)} /></div><select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter tender status"><option>All</option><option>Open</option><option>Closing Soon</option><option>Closed</option><option>Draft</option></select><select value={department} onChange={e => setDepartment(e.target.value)} aria-label="Filter department"><option>All</option>{departments.map(d => <option key={d}>{d}</option>)}</select><span className="results-count">{filtered.length} tenders</span></div>
      <div className="table-scroll"><table><thead><tr><th>Tender</th><th>Department</th><th>Deadline</th><th>Required docs</th><th>Bids</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map(t => <tr key={t.id}><td><button className="table-link-button" onClick={() => navigate(`/tenders/${encodeURIComponent(t.id)}`)}><strong className="table-primary">{t.title}</strong><small className="table-sub">{t.id}</small></button></td><td>{t.department}</td><td><span className="doc-count"><CalendarDays size={14} /> {new Date(t.deadline + 'T00:00:00').toLocaleDateString('en-IN')}</span></td><td><span className="doc-count"><FileText size={14} /> {t.requiredDocuments.length} types</span></td><td>{t.bidCount}</td><td><StatusBadge>{t.status}</StatusBadge></td><td><button className="table-action" onClick={() => navigate(`/tenders/${encodeURIComponent(t.id)}`)}>Details <ArrowUpRight size={14} /></button></td></tr>)}</tbody></table></div>
      {filtered.length === 0 && <div className="empty-state"><Search size={26} /><strong>No tenders match</strong><p>Try changing your search or filters.</p><button className="button button-secondary" onClick={() => { setSearch(''); setStatus('All'); setDepartment('All'); }}>Clear filters</button></div>}
    </section>
    {showCreate && isOfficer && <Modal title="Create a demo tender" onClose={() => setShowCreate(false)} wide><form className="form-grid" onSubmit={handleSubmit(onCreate)}><div className="field-span-two"><label>Tender title</label><input {...register('title')} placeholder="e.g. Supply of computer accessories" />{errors.title && <small className="form-error">{errors.title.message}</small>}</div><div><label>Department</label><input {...register('department')} />{errors.department && <small className="form-error">{errors.department.message}</small>}</div><div><label>Submission deadline</label><input type="date" {...register('deadline')} />{errors.deadline && <small className="form-error">{errors.deadline.message}</small>}</div><div><label>Minimum turnover (₹)</label><input type="number" {...register('minTurnover')} />{errors.minTurnover && <small className="form-error">{errors.minTurnover.message}</small>}</div><div className="field-span-two"><label>Description</label><textarea rows={3} {...register('description')} placeholder="Outline the scope and delivery expectations." />{errors.description && <small className="form-error">{errors.description.message}</small>}</div><div className="field-span-two"><label>Required document types (comma-separated)</label><input {...register('requiredDocuments')} />{errors.requiredDocuments && <small className="form-error">{errors.requiredDocuments.message}</small>}</div><div className="field-span-two form-note"><ShieldCheck size={16} /> This creates a fictional tender in your browser only. It is not published to GeM.</div><div className="form-actions field-span-two"><button type="button" className="button button-secondary" onClick={() => setShowCreate(false)}>Cancel</button><button type="submit" className="button button-primary"><Plus size={16} /> Create tender</button></div></form></Modal>}
  </div>;
}
