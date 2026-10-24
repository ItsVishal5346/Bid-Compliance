import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Bell, BookOpen, ChevronDown, ClipboardCheck, ClipboardList, FileCheck2, FileText, Gauge, HelpCircle, LayoutDashboard, LogOut, Menu, Search, Settings, ShieldAlert, ShieldCheck, Users, X, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const officerLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tenders', label: 'Tenders', icon: ClipboardList },
  { to: '/bids', label: 'Bid Submissions', icon: FileText },
  { to: '/documents', label: 'Documents', icon: FileCheck2 },
  { to: '/compliance', label: 'Compliance Verification', icon: ClipboardCheck },
  { to: '/risk', label: 'Risk Assessment', icon: ShieldAlert },
  { to: '/reports', label: 'Reports', icon: Activity },
  { to: '/review', label: 'Review & Decisions', icon: Users },
  { to: '/audit', label: 'Audit Log', icon: Gauge }
];
const bidderLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tenders', label: 'Available Tenders', icon: ClipboardList },
  { to: '/bids', label: 'My Bid Submissions', icon: FileText },
  { to: '/submit-bid', label: 'Submit a Bid', icon: FileCheck2 },
  { to: '/documents', label: 'My Documents', icon: ClipboardCheck },
  { to: '/reports', label: 'Verification Reports', icon: Activity }
];
const titles: Record<string, string> = {
  '/': 'Dashboard', '/tenders': 'Tender Management', '/bids': 'Bid Submissions', '/submit-bid': 'Submit a Bid',
  '/documents': 'Document Management', '/compliance': 'Compliance Verification', '/risk': 'Risk Assessment',
  '/reports': 'Verification Reports', '/review': 'Review & Decisions', '/audit': 'Audit Log',
  '/settings': 'Settings', '/help': 'Help & Documentation'
};

export default function Layout() {
  const { user, notifications, markNotificationRead, markAllNotificationsRead, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const links = user?.role === 'officer' ? officerLinks : bidderLinks;
  const unread = notifications.filter(n => !n.read).length;
  const title = titles[location.pathname] ?? (location.pathname.startsWith('/tenders/') ? 'Tender Details' : 'Workspace');

  const doLogout = () => { logout(); navigate('/login'); };
  return <div className="app-shell">
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><span className="brand-mark"><ShieldCheck size={23} /></span><span><strong>BidSure AI</strong><small>PROCUREMENT INTELLIGENCE</small></span><button className="mobile-close icon-button" onClick={() => setMobileOpen(false)} aria-label="Close sidebar"><X size={18} /></button></div>
      <div className="workspace-tag"><span className="workspace-dot" /> DEMO WORKSPACE <span className="workspace-version">v1.0</span></div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        <span className="nav-caption">WORKSPACE</span>
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Review & Decisions' && <span className="nav-counter">3</span>}</NavLink>)}
        <span className="nav-caption nav-caption-spaced">PREFERENCES</span>
        <NavLink to="/settings" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Settings size={18} /><span>Settings</span></NavLink>
        <NavLink to="/help" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><HelpCircle size={18} /><span>Help & Documentation</span></NavLink>
      </nav>
      <div className="sidebar-bottom"><div className="secure-panel"><div className="secure-panel-icon"><ShieldCheck size={18} /></div><strong>Prototype environment</strong><p>All workflows use fictional demo data. No external procurement actions are performed.</p><button onClick={() => navigate('/help')}>Learn about the demo <span>→</span></button></div><div className="sidebar-user"><span className="avatar">{user?.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span><span className="sidebar-user-text"><strong>{user?.name}</strong><small>{user?.role === 'officer' ? 'Procurement Officer' : 'Bidder / Vendor'}</small></span><button className="icon-button" onClick={doLogout} title="Sign out" aria-label="Sign out"><LogOut size={17} /></button></div></div>
    </aside>
    <div className="main-wrap">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{title}</strong></div></div>
        <div className="topbar-actions"><div className="top-search"><Search size={16} /><input aria-label="Search this page" placeholder="Search workspace..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && search.trim()) navigate('/tenders'); }} /></div><div className="popover-wrap"><button className="header-icon icon-button" aria-label="Notifications" onClick={() => { setNoticeOpen(v => !v); setProfileOpen(false); }}><Bell size={19} />{unread > 0 && <span className="notification-dot" />}</button>
          {noticeOpen && <div className="notification-popover"><div className="popover-heading"><strong>Notifications</strong><button onClick={markAllNotificationsRead}><CheckCheck size={14} /> Mark all read</button></div>{notifications.map(n => <button key={n.id} className={`notification-item ${n.read ? '' : 'unread'}`} onClick={() => { markNotificationRead(n.id); navigate(n.path); setNoticeOpen(false); }}><span className="notification-bullet" /><span><strong>{n.title}</strong><small>{n.description}</small><em>{n.time}</em></span></button>)}{notifications.length === 0 && <p className="empty-note">You’re all caught up.</p>}</div>}
        </div><div className="popover-wrap"><button className="profile-trigger" onClick={() => { setProfileOpen(v => !v); setNoticeOpen(false); }}><span className="avatar avatar-blue">{user?.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span><span className="profile-trigger-text"><strong>{user?.name}</strong><small>{user?.role === 'officer' ? 'Procurement Officer' : 'Bidder / Vendor'}</small></span><ChevronDown size={15} /></button>{profileOpen && <div className="profile-popover"><div className="profile-popover-top"><strong>{user?.name}</strong><small>{user?.email}</small></div><button onClick={() => { navigate('/settings'); setProfileOpen(false); }}><Settings size={15} /> Account settings</button><button onClick={doLogout}><LogOut size={15} /> Sign out</button></div>}</div></div>
      </header>
      <main className="page-content"><Outlet /></main>
      <footer className="app-footer"><span>© 2026 BidSure AI <b>·</b> Academic Prototype</span><span>Mock data only <b>·</b> Not an official GeM system</span></footer>
    </div>
  </div>;
}
