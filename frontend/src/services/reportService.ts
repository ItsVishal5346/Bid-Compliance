import type { Bid } from '../types';

export function buildDemoReportCsv(bids: Bid[]): string {
  const header = ['Report ID', 'Bid ID', 'Tender', 'Bidder', 'Assessment Date', 'Status', 'Demo Score', 'Mandatory Failures', 'Pending Checks'];
  const rows = bids.map((bid, index) => {
    const values = [
      'RPT-DEMO-' + String(index + 1).padStart(4, '0'),
      bid.id,
      bid.tenderTitle,
      bid.bidder,
      new Date(bid.submittedAt).toLocaleDateString('en-IN'),
      bid.status,
      bid.complianceScore || 'Not assessed',
      bid.mandatoryFailures,
      bid.pendingChecks
    ];
    return values.map(value => '"' + String(value).replace(/"/g, '""') + '"').join(',');
  });
  return [header.join(','), ...rows].join('\n');
}
export function downloadDemoReportCsv(bids: Bid[]) {
  const blob = new Blob([buildDemoReportCsv(bids)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bidsure-demo-reports.csv';
  link.click();
  URL.revokeObjectURL(url);
}
