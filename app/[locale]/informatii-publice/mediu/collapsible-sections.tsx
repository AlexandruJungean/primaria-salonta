'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, Droplets, TreePine, Download, FileText, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Types
interface Document {
  id: number;
  title: string;
  pdfUrl: string;
}

// Mock data - will be replaced with database fetch
const SALUBRIZARE_DOCS: Document[] = [
  { id: 1, title: 'Rezultatele colectării selective a deșeurilor în anul 2023', pdfUrl: '#' },
  { id: 2, title: 'Program ridicare deșeuri 2024 – AVE Bihor SRL', pdfUrl: '#' },
  { id: 3, title: 'HCLMS nr. 109 din 30.05.2024 – Regulamentul privind gestionarea deșeurilor rezultate din activitatea medicală în Mun. Salonta', pdfUrl: '#' },
  { id: 4, title: 'Contract de delegare prin concesiune a gestiunii Serviciului de salubrizare din zona 3 Bihor (Lot 3) – nr. 105 din 03.02.2020', pdfUrl: '#' },
  { id: 5, title: 'HCLMS nr. 99 din 30.04.2024 privind aprobarea actualizării și republicării a Regulamentului de stabilire și aplicare a taxei speciale de salubrizare', pdfUrl: '#' },
];

const APA_CANAL_DOCS: Document[] = [
  { id: 1, title: 'Buletin analiză apă: str. Arany János', pdfUrl: '#' },
  { id: 2, title: 'Buletin analiză apă: str. Kulin', pdfUrl: '#' },
  { id: 3, title: 'Buletin analiză apă: str. Petőfi Sándor', pdfUrl: '#' },
  { id: 4, title: 'Buletin analiză apă: str. Andrei Mureșan', pdfUrl: '#' },
  { id: 5, title: 'Buletin analiză apă: str. Tincii', pdfUrl: '#' },
];

const SPATII_VERZI_DOCS: Document[] = [
  { id: 1, title: 'Registrul local al spațiilor verzi (HCLMS nr. 212/30.10.2025)', pdfUrl: '#' },
];

function DocumentCard({ doc }: { doc: Document }) {
  return (
    <Card hover>
      <CardContent className="flex items-center justify-between pt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{doc.title}</h3>
          </div>
        </div>
        <a
          href={doc.pdfUrl}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors shrink-0 ml-4"
        >
          <Download className="w-4 h-4 text-green-600" />
          PDF
        </a>
      </CardContent>
    </Card>
  );
}

interface CollapsibleSectionProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  documents: Document[];
  defaultOpen?: boolean;
}

function CollapsibleSection({ icon, iconBg, title, description, documents, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`mb-4 border border-gray-200 rounded-xl overflow-hidden ${isOpen ? 'bg-gray-50' : 'bg-white'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors ${isOpen ? 'bg-white border-b border-gray-200' : ''}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
            {icon}
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{documents.length} documente</span>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-3 p-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MediuCollapsibleSections() {
  const tPage = useTranslations('mediuPage');

  return (
    <div className="mb-8">
      <CollapsibleSection
        icon={<Trash2 className="w-6 h-6 text-amber-700" />}
        iconBg="bg-amber-100"
        title={tPage('salubrizareTitle')}
        description={tPage('salubrizareDesc')}
        documents={SALUBRIZARE_DOCS}
        defaultOpen={true}
      />

      <CollapsibleSection
        icon={<Droplets className="w-6 h-6 text-blue-700" />}
        iconBg="bg-blue-100"
        title={tPage('apaCanalTitle')}
        description={tPage('apaCanalDesc')}
        documents={APA_CANAL_DOCS}
      />

      <CollapsibleSection
        icon={<TreePine className="w-6 h-6 text-green-700" />}
        iconBg="bg-green-100"
        title={tPage('spatiiVerziTitle')}
        description={tPage('spatiiVerziDesc')}
        documents={SPATII_VERZI_DOCS}
      />
    </div>
  );
}

