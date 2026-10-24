import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { demoUsers, initialAudit, initialBids, initialDocuments, initialNotifications, initialTenders } from '../data/mockData';
import type { AuditEntry, Bid, DocumentRecord, NotificationItem, Tender, User, UserRole } from '../types';

interface AppContextValue {
  user: User | null;
  tenders: Tender[];
  bids: Bid[];
  documents: DocumentRecord[];
  notifications: NotificationItem[];
  audit: AuditEntry[];
  login: (role: UserRole) => void;
  logout: () => void;
  addTender: (tender: Tender) => void;
  addBid: (bid: Bid) => void;
  updateBid: (id: string, updates: Partial<Bid>) => void;
  addDocument: (document: DocumentRecord) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAudit: (action: string, entityType: string, reference: string, description: string) => void;
}
const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const role = sessionStorage.getItem('bidsure-demo-role') as UserRole | null;
    return role === 'bidder' || role === 'officer' ? demoUsers[role] : null;
  });
  const [tenders, setTenders] = useState(initialTenders);
  const [bids, setBids] = useState(initialBids);
  const [documents, setDocuments] = useState(initialDocuments);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [audit, setAudit] = useState(initialAudit);

  const login = (role: UserRole) => {
    sessionStorage.setItem('bidsure-demo-role', role);
    setUser(demoUsers[role]);
  };
  const logout = () => {
    sessionStorage.removeItem('bidsure-demo-role');
    setUser(null);
  };
  const addAudit = (action: string, entityType: string, reference: string, description: string) => {
    setAudit(prev => [{
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      user: user?.name ?? 'Demo User',
      role: user?.role === 'officer' ? 'Procurement Officer' : 'Bidder',
      action, entityType, reference, description
    }, ...prev]);
  };
  const value = useMemo<AppContextValue>(() => ({
    user, tenders, bids, documents, notifications, audit, login, logout,
    addTender: tender => { setTenders(prev => [tender, ...prev]); addAudit('TENDER_CREATED', 'Tender', tender.id, 'Tender created in local demo state.'); },
    addBid: bid => { setBids(prev => [bid, ...prev]); addAudit('BID_SUBMITTED', 'Bid', bid.id, 'Simulated frontend bid submission.'); },
    updateBid: (id, updates) => { setBids(prev => prev.map(bid => bid.id === id ? { ...bid, ...updates } : bid)); addAudit('BID_UPDATED', 'Bid', id, 'Bid status changed in local demo state.'); },
    addDocument: document => { setDocuments(prev => [document, ...prev]); addAudit('DOCUMENT_ADDED', 'Document', document.id, 'File metadata added to local demo state; file bytes were not uploaded.'); },
    markNotificationRead: id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)),
    markAllNotificationsRead: () => setNotifications(prev => prev.map(n => ({ ...n, read: true }))),
    addAudit
  }), [user, tenders, bids, documents, notifications, audit]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
