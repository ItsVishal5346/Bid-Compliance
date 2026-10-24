import { BookOpen, FileCheck2, HelpCircle, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

const topics = [
  { title: 'How to submit a bid', text: 'Open Available Tenders, inspect the tender requirements, then choose Submit Bid. Complete the bidder details and document steps. Review missing required document types before confirming the local demo submission.' },
  { title: 'Supported document formats', text: 'The file chooser accepts PDF, JPG, JPEG and PNG up to 10 MB each. The browser stores file metadata for the prototype workflow; file bytes are not transmitted to a server.' },
  { title: 'How compliance statuses work', text: 'PASS indicates a seeded sample criterion outcome. FAIL indicates a seeded example failure. PENDING REVIEW means additional review is required and does not count as passing. NOT APPLICABLE means the criterion is outside the selected sample rule set.' },
  { title: 'Understanding compliance scores', text: 'Scores are illustrative demo fields only. A score does not guarantee eligibility, outweigh a mandatory failure, or replace a procurement officer’s judgment.' },
  { title: 'Why manual review may be required', text: 'Examples include unreadable or missing documents, uncertain extracted values, and validity questions. This prototype does not run OCR or an AI model, so arbitrary uploads are marked for manual review rather than having results invented.' },
  { title: 'Prototype limitations', text: 'Authentication, authorization, tender publishing, bid submission, processing, reports and officer decisions are simulated in the browser. There is no FastAPI backend, database, GeM integration, external notification or official procurement decision.' }
];
export default function Help() {
  return <div className="page-stack"><PageHeader eyebrow="SUPPORT CENTER" title="Help & documentation" description="A guide to the BidSure AI academic prototype and its simulated workflows." />
    <div className="help-banner"><span><BookOpen size={23} /></span><div><strong>Welcome to BidSure AI</strong><p>This interface demonstrates how tender documents, compliance checks, risk indicators and review decisions could be organized in a procurement workspace.</p></div></div>
    <div className="help-grid">{topics.map((item, i) => <section className="panel help-card" key={item.title}><span className="help-card-icon">{i === 0 ? <FileCheck2 size={18} /> : i === 1 ? <BookOpen size={18} /> : i === 2 ? <HelpCircle size={18} /> : i === 3 ? <ShieldAlert size={18} /> : <BookOpen size={18} />}</span><h2>{item.title}</h2><p>{item.text}</p></section>)}</div>
    <div className="prototype-note"><ShieldAlert size={17} /><span>BidSure AI is an academic prototype and is not affiliated with or endorsed by the Government of India or GeM. Do not enter confidential supplier information.</span></div>
  </div>;
}
