import type { ReactNode } from 'react';

export function StatusBadge({ children, tone }: { children: ReactNode; tone?: 'success' | 'warning' | 'danger' | 'neutral' | 'info' }) {
  const value = String(children).toUpperCase();
  const autoTone = value === 'PASS' || value === 'APPROVED' ? 'success'
    : value === 'FAIL' || value === 'REJECTED' || value.includes('FAILED') ? 'danger'
    : value.includes('PENDING') || value.includes('REVIEW') || value.includes('CLARIFICATION') ? 'warning'
    : value === 'OPEN' || value === 'SUBMITTED' || value.includes('PROCESSING') ? 'info' : 'neutral';
  return <span className={`status-badge ${tone ?? autoTone}`}>{children}</span>;
}
