import type { Bid, Tender } from '../types';

// This adapter is deliberately local. Replace these functions with fetch() calls
// to a FastAPI service when a backend exists; no network requests are made now.
export const mockApi = {
  async listTenders(items: Tender[]) { return Promise.resolve(items); },
  async listBids(items: Bid[]) { return Promise.resolve(items); },
  async saveTender(tender: Tender) { return Promise.resolve({ ...tender }); },
  async submitBid(bid: Bid) { return Promise.resolve({ ...bid }); }
};
