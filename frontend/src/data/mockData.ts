import type { AuditEntry, Bid, ComplianceCheck, DocumentRecord, NotificationItem, Tender, User } from '../types';

export const demoUsers: Record<'bidder' | 'officer', User> = {
  bidder: { id: 'USR-101', name: 'Aarav Sharma', email: 'bidder@demo.local', role: 'bidder', organization: 'Sharma Industrial Supplies' },
  officer: { id: 'USR-001', name: 'Ananya Deshmukh', email: 'officer@demo.local', role: 'officer', organization: 'Procurement Review Office' }
};

export const initialTenders: Tender[] = [
  { id: 'GEM/2026/B/7102841', title: 'Supply of Network Switches and Accessories', department: 'Department of Information Technology', deadline: '2026-11-18', status: 'Open', requiredDocuments: ['PAN Card', 'GST Registration', 'Turnover Certificate', 'Technical Declaration'], description: 'Supply, delivery and warranty support for managed network switches and related accessories.', minTurnover: 2500000, bidCount: 12 },
  { id: 'GEM/2026/B/7102796', title: 'Office Workstations and Ergonomic Chairs', department: 'General Administration Department', deadline: '2026-11-02', status: 'Closing Soon', requiredDocuments: ['PAN Card', 'GST Registration', 'Experience Certificate'], description: 'Supply and installation of office workstations with ergonomic seating.', minTurnover: 1500000, bidCount: 8 },
  { id: 'GEM/2026/B/7102551', title: 'Annual Facility Maintenance Services', department: 'Public Works Department', deadline: '2026-10-19', status: 'Closed', requiredDocuments: ['PAN Card', 'GST Registration', 'EPF Certificate', 'Experience Certificate'], description: 'Annual preventive and corrective maintenance for designated facilities.', minTurnover: 5000000, bidCount: 17 },
  { id: 'GEM/2026/B/7102980', title: 'Laboratory Testing Equipment', department: 'Department of Higher Education', deadline: '2026-11-28', status: 'Open', requiredDocuments: ['PAN Card', 'GST Registration', 'Turnover Certificate', 'Technical Declaration'], description: 'Supply and commissioning of laboratory testing equipment for public institutions.', minTurnover: 4000000, bidCount: 4 }
];

export const initialBids: Bid[] = [
  { id: 'BID-2026-0184', tenderId: 'GEM/2026/B/7102841', tenderTitle: 'Supply of Network Switches and Accessories', bidder: 'Sharma Industrial Supplies', submittedAt: '2026-10-22T11:35:00+05:30', documents: 4, complianceScore: 86, status: 'Under Review', mandatoryFailures: 1, pendingChecks: 1 },
  { id: 'BID-2026-0183', tenderId: 'GEM/2026/B/7102796', tenderTitle: 'Office Workstations and Ergonomic Chairs', bidder: 'Western Office Systems', submittedAt: '2026-10-22T10:10:00+05:30', documents: 3, complianceScore: 100, status: 'Submitted', mandatoryFailures: 0, pendingChecks: 0 },
  { id: 'BID-2026-0179', tenderId: 'GEM/2026/B/7102841', tenderTitle: 'Supply of Network Switches and Accessories', bidder: 'Apex Network Solutions', submittedAt: '2026-10-21T15:42:00+05:30', documents: 3, complianceScore: 62, status: 'Clarification Required', mandatoryFailures: 2, pendingChecks: 1 },
  { id: 'BID-2026-0175', tenderId: 'GEM/2026/B/7102551', tenderTitle: 'Annual Facility Maintenance Services', bidder: 'Clearview Facility Group', submittedAt: '2026-10-20T12:05:00+05:30', documents: 4, complianceScore: 74, status: 'Rejected', mandatoryFailures: 2, pendingChecks: 0 }
];

export const initialDocuments: DocumentRecord[] = [
  { id: 'DOC-901', name: 'pan_card_sharma.pdf', bidId: 'BID-2026-0184', type: 'PAN Card', uploadedAt: '2026-10-22', size: 240 * 1024, status: 'Processed (sample)', classification: 'PAN document — sample classification', ocrStatus: 'Sample result only' },
  { id: 'DOC-902', name: 'gst_registration.pdf', bidId: 'BID-2026-0184', type: 'GST Registration', uploadedAt: '2026-10-22', size: 412 * 1024, status: 'Processed (sample)', classification: 'GST certificate — sample classification', ocrStatus: 'Sample result only' },
  { id: 'DOC-903', name: 'turnover_statement.pdf', bidId: 'BID-2026-0184', type: 'Turnover Certificate', uploadedAt: '2026-10-22', size: 603 * 1024, status: 'Manual Review', classification: 'Turnover certificate — manual review', ocrStatus: 'Not actually run' },
  { id: 'DOC-904', name: 'technical_declaration.pdf', bidId: 'BID-2026-0179', type: 'Technical Declaration', uploadedAt: '2026-10-21', size: 320 * 1024, status: 'Failed (sample)', classification: 'Document unreadable — seeded demo result', ocrStatus: 'Not actually run' }
];

export const initialChecks: ComplianceCheck[] = [
  { id: 'CHK-01', criterion: 'PAN document provided', requirement: 'PAN evidence must be present', document: 'pan_card_sharma.pdf', actual: 'Document listed', expected: 'Required document present', status: 'PASS', evidence: 'DOC-901', explanation: 'A seeded sample record indicates that a PAN document was provided. No live verification was performed.' },
  { id: 'CHK-02', criterion: 'GST registration information', requirement: 'Registration details should match bidder details', document: 'gst_registration.pdf', actual: 'Sample GSTIN: 27ABCDE1234F1Z5', expected: 'Format and details match declared profile', status: 'PASS', evidence: 'DOC-902', explanation: 'This is a fictional example value used to demonstrate a verification result.' },
  { id: 'CHK-03', criterion: 'Turnover threshold', requirement: 'Minimum turnover ₹25,00,000', document: 'turnover_statement.pdf', actual: 'Value requires officer confirmation', expected: 'Turnover ≥ ₹25,00,000', status: 'PENDING REVIEW', evidence: 'DOC-903', explanation: 'The sample record is flagged for manual review. Pending is not equivalent to passing.' },
  { id: 'CHK-04', criterion: 'Certificate validity', requirement: 'Required certificate must be valid on review date', document: 'turnover_statement.pdf', actual: 'Validity not confirmed', expected: 'Valid through assessment date', status: 'FAIL', evidence: 'DOC-903', explanation: 'A deliberately seeded failure demonstrates how mandatory concerns are displayed; it is not a real eligibility finding.' },
  { id: 'CHK-05', criterion: 'Technical declaration', requirement: 'Signed technical declaration must be included', document: 'technical_declaration.pdf', actual: 'Not found in sample bid', expected: 'Required document present', status: 'FAIL', evidence: 'DOC-904', explanation: 'Seeded example of a missing mandatory document. An officer must review the source evidence.' },
  { id: 'CHK-06', criterion: 'Supporting experience evidence', requirement: 'Experience evidence where applicable', document: '—', actual: 'Not required for this rule set', expected: 'N/A when criteria do not apply', status: 'NOT APPLICABLE', evidence: '—', explanation: 'This criterion is outside the selected demonstration rule set.' }
];

export const initialNotifications: NotificationItem[] = [
  { id: 'NTF-001', title: 'New bid submitted', description: 'BID-2026-0184 is ready for initial checks.', time: '12 min ago', read: false, path: '/bids' },
  { id: 'NTF-002', title: 'Manual review required', description: 'Turnover evidence needs officer attention.', time: '32 min ago', read: false, path: '/compliance' },
  { id: 'NTF-003', title: 'Sample report available', description: 'A verification summary can be exported.', time: 'Yesterday', read: true, path: '/reports' }
];

export const initialAudit: AuditEntry[] = [
  { id: 'AUD-1008', timestamp: '2026-10-22 11:36', user: 'Aarav Sharma', role: 'Bidder', action: 'BID_SUBMITTED', entityType: 'Bid', reference: 'BID-2026-0184', description: 'Bid submitted to the local demo state.' },
  { id: 'AUD-1007', timestamp: '2026-10-22 11:20', user: 'System Demo', role: 'Prototype', action: 'DOCUMENT_PROCESSED', entityType: 'Document', reference: 'DOC-902', description: 'Sample processing state displayed; no OCR service was called.' },
  { id: 'AUD-1006', timestamp: '2026-10-22 10:18', user: 'Ananya Deshmukh', role: 'Procurement Officer', action: 'REVIEW_OPENED', entityType: 'Bid', reference: 'BID-2026-0183', description: 'Opened bid for a simulated officer review.' }
];
