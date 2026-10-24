import type { ReactNode } from 'react';
export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="page-actions">{actions}</div>}</div>;
}
export function StatCard({ title, value, note, icon: Icon, tone = 'blue' }: { title: string; value: string | number; note: string; icon: React.ElementType; tone?: 'blue' | 'green' | 'amber' | 'red' }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19} /></div><div className="stat-copy"><span>{title}</span><strong>{value}</strong><small>{note}</small></div></article>;
}
