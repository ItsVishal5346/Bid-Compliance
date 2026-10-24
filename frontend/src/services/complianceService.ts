import { initialChecks } from '../data/mockData';
import type { ComplianceCheck, ComplianceStatus } from '../types';

// These fixed outcomes are explicitly seeded demo data; no OCR, AI model or live verification is run.
export function getSeededComplianceChecks(): ComplianceCheck[] {
  return initialChecks.map(check => ({ ...check }));
}
export async function getDemoComplianceChecks(): Promise<ComplianceCheck[]> {
  return Promise.resolve(getSeededComplianceChecks());
}
export function countDemoStatuses(checks: ComplianceCheck[]): Record<ComplianceStatus, number> {
  return {
    PASS: checks.filter(check => check.status === 'PASS').length,
    FAIL: checks.filter(check => check.status === 'FAIL').length,
    'PENDING REVIEW': checks.filter(check => check.status === 'PENDING REVIEW').length,
    'NOT APPLICABLE': checks.filter(check => check.status === 'NOT APPLICABLE').length
  };
}
