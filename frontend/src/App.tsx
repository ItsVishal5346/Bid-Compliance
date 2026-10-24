import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tenders from './pages/Tenders';
import Bids from './pages/Bids';
import SubmitBid from './pages/SubmitBid';
import Documents from './pages/Documents';
import Compliance from './pages/Compliance';
import Risk from './pages/Risk';
import Reports from './pages/Reports';
import Review from './pages/Review';
import AuditLog from './pages/AuditLog';
import Settings from './pages/Settings';
import Help from './pages/Help';
import type { ReactNode } from 'react';

function RequireAuth() {
  const { user } = useApp();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
function LoginRoute() {
  const { user } = useApp();
  return user ? <Navigate to="/" replace /> : <Login />;
}
function RoleGate({ role, children }: { role: 'bidder' | 'officer'; children: ReactNode }) {
  const { user } = useApp();
  return user?.role === role ? <>{children}</> : <Navigate to="/" replace />;
}
function NotFound() {
  return <div className="not-found"><h1>Page not found</h1><p>This route is not part of the BidSure AI demo workspace.</p><a className="button button-primary" href="/">Return to dashboard</a></div>;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginRoute />} />
    <Route element={<RequireAuth />}>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="tenders" element={<Tenders />} />
        <Route path="tenders/:id" element={<Tenders />} />
        <Route path="bids" element={<Bids />} />
        <Route path="submit-bid" element={<RoleGate role="bidder"><SubmitBid /></RoleGate>} />
        <Route path="documents" element={<Documents />} />
        <Route path="compliance" element={<RoleGate role="officer"><Compliance /></RoleGate>} />
        <Route path="risk" element={<RoleGate role="officer"><Risk /></RoleGate>} />
        <Route path="reports" element={<Reports />} />
        <Route path="review" element={<RoleGate role="officer"><Review /></RoleGate>} />
        <Route path="audit" element={<RoleGate role="officer"><AuditLog /></RoleGate>} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>;
}