import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, FileCheck2, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';

export default function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState('officer@demo.local');
  const [password, setPassword] = useState('demo-password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const signIn = (role: UserRole) => {
    if (!email.trim() || !password.trim()) { setError('Enter a demo email and password to continue.'); return; }
    login(role);
  };
  return <main className="login-shell">
    <div className="login-aside">
      <div className="brand brand-light"><span className="brand-mark"><ShieldCheck size={23} /></span><span><strong>BidSure AI</strong><small>PROCUREMENT INTELLIGENCE</small></span></div>
      <div className="login-pitch"><span className="eyebrow"><Sparkles size={14} /> COMPLIANCE WORKSPACE</span><h1>More clarity.<br /><em>Better decisions.</em></h1><p>A unified demonstration workspace for bid document review, compliance checks, and decision traceability.</p>
        <div className="pitch-points"><span><ShieldCheck size={18} /> Criterion-wise verification</span><span><FileCheck2 size={18} /> Structured evidence review</span><span><ArrowRight size={18} /> Transparent decision workflow</span></div>
      </div>
      <div className="login-footer">Academic Prototype · Not affiliated with or endorsed by GeM</div>
    </div>
    <div className="login-main"><div className="login-card">
      <div className="mobile-brand brand"><span className="brand-mark"><ShieldCheck size={22} /></span><strong>BidSure AI</strong></div>
      <span className="eyebrow">WELCOME BACK</span><h2>Sign in to your workspace</h2><p className="muted">Use a demo role to explore the prototype.</p>
      <form onSubmit={e => { e.preventDefault(); signIn(email.toLowerCase().includes('bidder') ? 'bidder' : 'officer'); }}>
        <label>Email address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@organization.com" required />
        <label>Password</label><div className="password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required /><button type="button" className="icon-button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        {error && <p className="form-error">{error}</p>}
        <button className="button button-primary button-full" type="submit">Sign in <ArrowRight size={17} /></button>
      </form>
      <div className="divider-label"><span />OR EXPLORE WITH A DEMO ROLE<span /></div>
      <button className="demo-role" onClick={() => { setEmail('bidder@demo.local'); setError(''); login('bidder'); }}><span className="role-icon"><FileCheck2 size={19} /></span><span><strong>Continue as Bidder / Vendor</strong><small>Submit bids and manage documents</small></span><ArrowRight size={17} /></button>
      <button className="demo-role" onClick={() => { setEmail('officer@demo.local'); setError(''); login('officer'); }}><span className="role-icon navy"><ShieldCheck size={19} /></span><span><strong>Continue as Procurement Officer</strong><small>Review compliance and record decisions</small></span><ArrowRight size={17} /></button>
      <p className="prototype-note">Demo only: sign-in is simulated in this browser. Do not use real credentials or confidential documents.</p>
    </div></div>
  </main>;
}
