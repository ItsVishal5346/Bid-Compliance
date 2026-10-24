import type { Bid } from '../types';

export async function listDemoBids(items: Bid[]): Promise<Bid[]> {
  return Promise.resolve(items.map(item => ({ ...item })));
}
export async function submitDemoBid(bid: Bid): Promise<Bid> {
  return Promise.resolve({ ...bid });
}
