import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, Check, FileCheck2, FileText, UploadCloud, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../context/AppContext';
import type { DocumentRecord, Bid } from '../types';

type UploadEntry = { file: File; type: string };
const allowed = ['pdf', 'jpg', 'jpeg', 'png'];
const maxBytes = 10 * 1024 * 1024;

export default function SubmitBid() {
  const { user, tenders, addBid, addDocument } = useApp();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [tenderId, setTenderId] = useState(params.get('tenderId') ?? tenders.find(t => t.status !== 'Closed')?.id ?? '');
  const [organization, setOrganization] = useState(user?.organization ?? '');
  const [reference, setReference] = useState('VENDOR-REF-2026-01');
  const [registration, setRegistration] = useState('REG-DEMO-1048');
  const [email, setEmail] = useState(user?.email ?? '');
  const [turnover, setTurnover] = useState('3200000');
  const [uploads, setUploads] = useState<UploadEntry[]>([]);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState<Bid | null>(null);
  const selectedTender = useMemo(() => tenders.find(t => t.id === tenderId), [tenders, tenderId]);
  const missing = selectedTender?.requiredDocuments.filter(req => !uploads.some(u => u.type === req)) ?? [];

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: UploadEntry[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!allowed.includes(ext)) { setError(`${file.name}: unsupported file type. Use PDF, JPG, JPEG or PNG.`); continue; }
      if (file.size > maxBytes) { setError(`${file.name}: maximum file size is 10 MB.`); continue; }
      const normalized = file.name.toLowerCase();
      const match = selectedTender?.requiredDocuments.find(d => normalized.includes(d.toLowerCase().split(' ')[0]));
      next.push({ file, type: match ?? (selectedTender?.requiredDocuments.find(req => !uploads.some(u => u.type === req) && !next.some(u => u.type === req)) ?? 'Supporting Document') });
    }
    if (next.length) { setUploads(prev => [...prev, ...next]); setError(''); }
  };
  const goNext = () => {
    setError('');
    if (step === 0 && !selectedTender) { setError('Choose an open tender to continue.'); return; }
    if (step === 1 && (!organization.trim() || !reference.trim() || !registration.trim() || !email.includes('@'))) { setError('Complete all bidder fields with a valid contact email.'); return; }
    if (step === 2 && uploads.length === 0) { setError('Select at least one document, or go back and cancel the demo submission.'); return; }
    setStep(s => Math.min(3, s + 1));
  };
  const submit = () => {
    if (!selectedTender || !user) return;
    const absent = selectedTender.requiredDocuments.filter(req => !uploads.some(u => u.type === req));
    const bid: Bid = {
      id: `BID-DEMO-${String(Date.now()).slice(-6)}`, tenderId: selectedTender.id, tenderTitle: selectedTender.title,
      bidder: organization, submittedAt: new Date().toISOString(), documents: uploads.length,
      complianceScore: 0, status: 'Under Review', mandatoryFailures: absent.length, pendingChecks: selectedTender.requiredDocuments.length
    };
    addBid(bid);
    uploads.forEach((upload, i) => {
      const doc: DocumentRecord = {
        id: `DOC-DEMO-${String(Date.now()).slice(-5)}-${i + 1}`, name: upload.file.name, bidId: bid.id, type: upload.type,
        uploadedAt: new Date().toISOString().slice(0, 10), size: upload.file.size, status: 'Manual Review',
        classification: 'Not classified — manual review required', ocrStatus: 'Not run'
      };
      addDocument(doc);
    });
    setComplete(bid);
    setStep(4);
  };

  if (complete) return <div className="page-stack"><div className="success-screen"><span className="success-mark"><Check size={28} /></span><span className="eyebrow">DEMO SUBMISSION COMPLETE</span><h1>Bid reference created</h1><p>Your bid has been added to this browser’s local demo state. No files were transmitted and no request was sent to GeM.</p><div className="success-reference"><span>Demo bid ID</span><strong>{complete.id}</strong><span>Selected tender</span><strong>{complete.tenderTitle}</strong><span>Documents selected</span><strong>{complete.documents}</strong></div>{complete.mandatoryFailures > 0 && <div className="inline-alert warning"><AlertCircle size={17} /><span>{complete.mandatoryFailures} required document type(s) were not matched. Officer review is still required.</span></div>}<div className="page-actions centered-actions"><button className="button button-secondary" onClick={() => navigate('/bids')}>View submissions</button><button className="button button-primary" onClick={() => navigate('/')}>Return to dashboard</button></div></div></div>;

  const steps = ['Select tender', 'Bidder details', 'Upload documents', 'Review & submit'];
  return <div className="page-stack"><PageHeader eyebrow="BID WORKFLOW" title="Submit a bid" description="Complete each step to create a simulated frontend-only submission." actions={<span className="demo-chip"><span /> SIMULATED</span>} />
    <div className="stepper">{steps.map((label, i) => <div className={`stepper-item ${step === i ? 'current' : step > i ? 'completed' : ''}`} key={label}><span className="step-number">{step > i ? <Check size={15} /> : i + 1}</span><span>{label}</span></div>)}</div>
    <section className="panel workflow-panel">
      {step === 0 && <><div className="form-section-heading"><span>01</span><div><h2>Select tender</h2><p>Choose an open demo opportunity and review its core requirements.</p></div></div><label>Tender opportunity</label><select className="input-large" value={tenderId} onChange={e => setTenderId(e.target.value)}><option value="">Choose a tender</option>{tenders.filter(t => t.status !== 'Closed').map(t => <option value={t.id} key={t.id}>{t.title} — {t.id}</option>)}</select>{selectedTender && <div className="selected-tender-card"><div><span className="eyebrow">{selectedTender.id}</span><h3>{selectedTender.title}</h3><p>{selectedTender.description}</p></div><div className="tender-date"><span>Deadline</span><strong>{new Date(selectedTender.deadline + 'T00:00:00').toLocaleDateString('en-IN')}</strong></div><div className="field-span-two"><strong>Required document types</strong><div className="requirements-pills">{selectedTender.requiredDocuments.map(doc => <span key={doc}><FileCheck2 size={13} /> {doc}</span>)}</div></div></div>}</>}
      {step === 1 && <><div className="form-section-heading"><span>02</span><div><h2>Bidder details</h2><p>Use fictional or non-sensitive details for this academic prototype.</p></div></div><div className="form-grid"><div className="field-span-two"><label>Organization name</label><input value={organization} onChange={e => setOrganization(e.target.value)} /></div><div><label>Bidder reference</label><input value={reference} onChange={e => setReference(e.target.value)} /></div><div><label>Registration number</label><input value={registration} onChange={e => setRegistration(e.target.value)} /></div><div><label>Contact email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div><div><label>Annual turnover (₹)</label><input type="number" value={turnover} onChange={e => setTurnover(e.target.value)} /><small className="field-hint">Provided as a demo declaration only; no verification is performed.</small></div></div></>}
      {step === 2 && <><div className="form-section-heading"><span>03</span><div><h2>Upload documents</h2><p>Select local files. Files remain in this browser and are not sent to a server.</p></div></div><label className="upload-dropzone"><UploadCloud size={27} /><strong>Choose documents from your device</strong><span>PDF, JPG, JPEG, PNG · up to 10 MB per file</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={e => addFiles(e.target.files)} /></label>{uploads.length > 0 && <div className="upload-list">{uploads.map((u, i) => <div className="upload-row" key={`${u.file.name}-${i}`}><span className="file-icon"><FileText size={18} /></span><span className="upload-file-copy"><strong>{u.file.name}</strong><small>{(u.file.size / 1024).toFixed(0)} KB · Local file metadata only</small></span><select value={u.type} onChange={e => setUploads(prev => prev.map((v, index) => index === i ? { ...v, type: e.target.value } : v))} aria-label={`Document type for ${u.file.name}`}><option value="Supporting Document">Supporting Document</option>{(selectedTender?.requiredDocuments ?? []).map(doc => <option value={doc} key={doc}>{doc}</option>)}</select><button className="icon-button danger-icon" aria-label={`Remove ${u.file.name}`} onClick={() => setUploads(prev => prev.filter((_, index) => index !== i))}><X size={16} /></button></div>)}</div>}{selectedTender && <div className={`inline-alert ${missing.length ? 'warning' : 'success'}`}><AlertCircle size={17} /><span>{missing.length ? `Missing required types: ${missing.join(', ')}. You may continue, but manual review will be required.` : 'All required document types have been mapped to a selected file.'}</span></div>}</>}
      {step === 3 && <><div className="form-section-heading"><span>04</span><div><h2>Review submission</h2><p>Confirm the local demo data before creating the bid reference.</p></div></div><div className="review-summary-grid"><div className="summary-block"><span>Tender</span><strong>{selectedTender?.title}</strong><small>{selectedTender?.id}</small></div><div className="summary-block"><span>Organization</span><strong>{organization}</strong><small>{email}</small></div><div className="summary-block"><span>Selected documents</span><strong>{uploads.length}</strong><small>{uploads.map(u => u.type).join(', ')}</small></div><div className="summary-block"><span>Required types not matched</span><strong className={missing.length ? 'text-danger' : 'text-success'}>{missing.length}</strong><small>{missing.length ? missing.join(', ') : 'All required types mapped'}</small></div></div><div className="prototype-note"><AlertCircle size={16} /> This action creates only a local demo record. Documents receive a “Manual Review” status; no OCR or AI classification will be run.</div></>}
      {error && <div className="inline-alert danger"><AlertCircle size={16} /> {error}</div>}
      <div className="workflow-actions">{step > 0 && <button className="button button-secondary" onClick={() => { setError(''); setStep(s => s - 1); }}><ArrowLeft size={16} /> Back</button>}<span className="workflow-spacer" />{step < 3 ? <button className="button button-primary" onClick={goNext}>Continue <ArrowRight size={16} /></button> : <button className="button button-primary" onClick={submit}><Check size={16} /> Confirm demo submission</button>}</div>
    </section>
  </div>;
}
