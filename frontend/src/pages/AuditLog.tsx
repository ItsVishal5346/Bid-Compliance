import { useMemo, useState } from 'react';
import { Activity, Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { useApp } from '../context/AppContext';
import type { AuditEntry } from '../types';

export default function AuditLog() {
  const { audit } = useApp();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All');
  const [selected, setSelected] = useState<AuditEntry | null>(null);
  const roles = Array.from(new Set(audit.map(a => a.role)));
  const filtered = useMemo(() => audit.filter(a => (role === 'All' || a.role === role) && (!query || [a.id, a.user, a.action, a.reference, a.description].some(v => v.toLowerCase().includes(query.toLowerCase())))), [audit, role, query]);
  return <div className="page-stack"><PageHeader eyebrow="TRACEABILITY" title="Audit log" description="Browse the activity feed maintained in local prototype state. This is not an immutable or security-grade audit trail." actions={<span className="demo-chip"><span /> LOCAL DEMO LOG</span>} />
    <div className="report-disclaimer"><Activity size={19} /><div><strong>Prototype activity history</strong><p>Events are stored in React state while this page remains open. Refreshing the app resets data to its seeded starting values.</p></div></div>
    <section className="panel table-panel"><div className="filter-toolbar"><div className="search-field"><Search size={16} /><input placeholder="Search user, action, entity or reference" value={query} onChange={e => setQuery(e.target.value)} /></div><select value={role} onChange={e => setRole(e.target.value)} aria-label="Filter by role"><option>All</option>{roles.map(r => <option key={r}>{r}</option>)}</select><span className="results-count">{filtered.length} events</span></div>
      <div className="table-scroll"><table><thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Entity type</th><th>Reference</th><th></th></tr></thead><tbody>{filtered.map(a => <tr key={a.id}><td>{a.timestamp}</td><td><strong className="table-primary">{a.user}</strong></td><td>{a.role}</td><td><span className="audit-action">{a.action}</span></td><td>{a.entityType}</td><td>{a.reference}</td><td><button className="table-action" onClick={() => setSelected(a)}>Details</button></td></tr>)}</tbody></table></div>{filtered.length === 0 && <div className="empty-state"><Search size={25} /><strong>No matching events</strong><p>Try a different query.</p></div>}
    </section>
    {selected && <Modal title="Audit event details" onClose={() => setSelected(null)}><div className="details-list"><div><span>Event ID</span><strong>{selected.id}</strong></div><div><span>Timestamp</span><strong>{selected.timestamp}</strong></div><div><span>User / role</span><strong>{selected.user} · {selected.role}</strong></div><div><span>Action</span><strong>{selected.action}</strong></div><div><span>Entity</span><strong>{selected.entityType} · {selected.reference}</strong></div></div><div className="explanation-box"><strong>Description</strong><p>{selected.description}</p></div><button className="button button-secondary button-full" onClick={() => setSelected(null)}>Close</button></Modal>}
  </div>;
}
