import type { Tender } from '../types';

// Local adapter examples: replace with API calls when the FastAPI backend is available.
export async function listDemoTenders(items: Tender[]): Promise<Tender[]> {
  return Promise.resolve(items.map(item => ({ ...item, requiredDocuments: [...item.requiredDocuments] })));
}
export async function createDemoTender(tender: Tender): Promise<Tender> {
  return Promise.resolve({ ...tender, requiredDocuments: [...tender.requiredDocuments] });
}
