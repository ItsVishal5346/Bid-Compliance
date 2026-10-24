export type UserRole = 'bidder' | 'officer';
export type ComplianceStatus = 'PASS' | 'FAIL' | 'PENDING REVIEW' | 'NOT APPLICABLE';
export type BidStatus = 'Submitted' | 'Under Review' | 'Clarification Required' | 'Approved' | 'Rejected';
export type DocumentStatus = 'Queued' | 'Processing (demo)' | 'Processed (sample)' | 'Manual Review' | 'Failed (sample)';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
}
export interface Tender {
  id: string;
  title: string;
  department: string;
  deadline: string;
  status: 'Open' | 'Closing Soon' | 'Closed' | 'Draft';
  requiredDocuments: string[];
  description: string;
  minTurnover: number;
  bidCount: number;
}
export interface Bid {
  id: string;
  tenderId: string;
  tenderTitle: string;
  bidder: string;
  submittedAt: string;
  documents: number;
  complianceScore: number;
  status: BidStatus;
  mandatoryFailures: number;
  pendingChecks: number;
  reviewRemarks?: string;
}
export interface DocumentRecord {
  id: string;
  name: string;
  bidId: string;
  type: string;
  uploadedAt: string;
  size: number;
  status: DocumentStatus;
  classification: string;
  ocrStatus: string;
}
export interface ComplianceCheck {
  id: string;
  criterion: string;
  requirement: string;
  document: string;
  actual: string;
  expected: string;
  status: ComplianceStatus;
  evidence: string;
  explanation: string;
}
export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  path: string;
}
export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entityType: string;
  reference: string;
  description: string;
}
