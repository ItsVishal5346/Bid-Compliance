import { useMemo, useState } from 'react';
import { AlertCircle, FileCheck2, FileText, Image as ImageIcon, Search, ShieldAlert, UploadCloud } from 'lucide-react';
import { PageHeader, StatCard } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { useApp } from '../context/AppContext';
import type { DocumentRecord } from '../types';

const supported = ['pdf', 'jpg', 'jpeg', 'png'];
const maxBytes = 10 * 1024 * 1024;

export default function Documents() {
  const { user, documents, bids, addDocument, addAudit } = useApp();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');
  const [selected, setSelected] = useState<DocumentRecord | null>(null);
  const [error, setError] = useState('');
  const [fileKey, setFileKey] = useState(0);
  const visible = useMemo(() => documents.filter(d => {
    const owned = user?.role === 'officer' || bids.some(b => b.id === d.bidId && b.bidder === user?.organization);
    const q = query.toLowerCase();
    return owned && (!q || d.name.toLowerCase().includes(q) || d.bidId.toLowerCase().includes(q)) &&
      (type === 'All' || d.type === type) && (status === 'All' || d.status === status);
  }), [documents, bids, user, query, type, status]);
  const types = Array.from(new Set(documents.map(d => d.type)));

  const upload = (file?: File) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!supported.includes(ext)) { setError('Unsupported file type. Select a PDF, JPG, JPEG or PNG.'); return; }
    if (file.size > maxBytes) { setError('File size exceeds 10 MB. Choose a smaller file.'); return; }
    const doc: DocumentRecord = {
      id: `DOC-DEMO-${String(Date.now()).slice(-7)}`, name: file.name, bidId: 'UNASSIGNED',
      type: 'Unclassified upload', uploadedAt: new Date().toISOString().slice(0, 10), size: file.size,
      status: 'Manual Review', classification: 'Not classified — manual review required', ocrStatus: 'Not run'
    };
    addDocument(doc);
    addAudit('LOCAL_FILE_SELECTED', 'Document', doc.id, 'Only file metadata was saved. File contents were not uploaded or analyzed.');
    setError(''); setSelected(doc); setFileKey(v => v + 1);
  };

  return <div className="page-stack">
    <PageHeader eyebrow="DOCUMENT CONTROL" title={user?.role === 'officer' ? 'Document management' : 'My documents'} description="Review file metadata and explicitly labelled demo processing states. No OCR or external upload occurs." actions={<label className="button button-primary upload-button"><UploadCloud size={16} /> Add local file<input key={fileKey} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => upload(e.target.files?.[0])} /></label>} />
    {error && <div className="inline-alert warning"><AlertCircle size={16} /> {error}</div>}
    <div className="stats-grid three-stats"><StatCard title="Documents listed" value={visible.length} note="Local demo records" icon={FileText} tone="blue" /><StatCard title="Manual review" value={visible.filter(d => d.status === 'Manual Review').length} note="Requires human review" icon={ShieldAlert} tone="amber" /><StatCard title="Sample processing results" value={visible.filter(d => d.status === 'Processed (sample)').length} note="Seeded sample data only" icon={FileCheck2} tone="green" /></div>
    <section className="panel table-panel"><div className="filter-toolbar"><div className="search-field"><Search size={16} /><input placeholder="Search filename or bid ID" value={query} onChange={e => setQuery(e.target.value)} /></div><select value={type} onChange={e => setType(e.target.value)} aria-label="Filter document type"><option>All</option>{types.map(t => <option key={t}>{t}</option>)}</select><select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter document status"><option>All</option><option>Queued</option><option>Processing (demo)</option><option>Processed (sample)</option><option>Manual Review</option><option>Failed (sample)</option></select><span className="results-count">{visible.length} files</span></div>
      <div className="table-scroll"><table><thead><tr><th>Document</th><th>Bid ID</th><th>Document type</th><th>Uploaded</th><th>Size</th><th>Processing</th><th>Classification</th><th></th></tr></thead><tbody>{visible.map(d => <tr key={d.id}><td><div className="document-cell"><span className="file-icon">{d.name.match(/\.(jpg|jpeg|png)$/i) ? <ImageIcon size={17} /> : <FileText size={17} />}</span><span><strong className="table-primary">{d.name}</strong><small className="table-sub">{d.id}</small></span></div></td><td>{d.bidId}</td><td>{d.type}</td><td>{new Date(d.uploadedAt + 'T00:00:00').toLocaleDateString('en-IN')}</td><td>{(d.size / 1024).toFixed(0)} KB</td><td><StatusBadge>{d.status}</StatusBadge></td><td><span className="muted">{d.classification}</span></td><td><button className="table-action" onClick={() => setSelected(d)}>Details</button></td></tr>)}</tbody></table></div>
      {visible.length === 0 && <div className="empty-state"><FileText size={28} /><strong>No documents found</strong><p>Try another filter or choose a local file to add its metadata to the demo.</p></div>}
    </section>
    {selected && <Modal title="Document details" onClose={() => setSelected(null)}><div className="document-detail-head"><span className="document-detail-icon"><FileText size={24} /></span><div><strong>{selected.name}</strong><small>{selected.id}</small></div></div><div className="details-list"><div><span>Linked bid</span><strong>{selected.bidId}</strong></div><div><span>Document type</span><strong>{selected.type}</strong></div><div><span>File size</span><strong>{(selected.size / 1024).toFixed(1)} KB</strong></div><div><span>File date</span><strong>{selected.uploadedAt}</strong></div><div><span>Processing status</span><strong><StatusBadge>{selected.status}</StatusBadge></strong></div><div><span>OCR status</span><strong>{selected.ocrStatus}</strong></div><div><span>Classification</span><strong>{selected.classification}</strong></div></div><div className="inline-alert warning"><AlertCircle size={16} /><span>Document content was not uploaded or inspected. Sample extracted fields are not inferred for arbitrary files.</span></div><button className="button button-secondary button-full" onClick={() => setSelected(null)}>Close details</button></Modal>}
  </div>;
}
