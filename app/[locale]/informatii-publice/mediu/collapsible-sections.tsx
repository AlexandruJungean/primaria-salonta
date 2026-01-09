'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, Droplets, TreePine, Download, FileText, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Document {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  description?: string | null;
}

interface DocumentCardProps {
  doc: Document;
  downloadLabel: string;
}

function DocumentCard({ doc, downloadLabel }: DocumentCardProps) {
  // Determine file type from file_name
  const isExcel = doc.file_name?.toLowerCase().endsWith('.xls') || doc.file_name?.toLowerCase().endsWith('.xlsx');
  
  return (
    <Card hover>
      <CardContent className="flex items-center justify-between pt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{doc.title}</h3>
            {doc.description && (
              <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
            )}
          </div>
        </div>
        <a
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors shrink-0 ml-4"
        >
          <Download className="w-4 h-4 text-green-600" />
          {isExcel ? 'XLS' : downloadLabel}
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
  downloadLabel: string;
  defaultOpen?: boolean;
}

function CollapsibleSection({ icon, iconBg, title, description, documents, downloadLabel, defaultOpen = false }: CollapsibleSectionProps) {
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
          {documents.length > 0 ? (
            documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} downloadLabel={downloadLabel} />
            ))
          ) : (
            <p className="text-center py-4 text-gray-500 text-sm">Nu există documente disponibile.</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface MediuCollapsibleSectionsProps {
  salubrizareDocs: Document[];
  apaCanalDocs: Document[];
  spatiiVerziDocs: Document[];
}

export function MediuCollapsibleSections({ salubrizareDocs, apaCanalDocs, spatiiVerziDocs }: MediuCollapsibleSectionsProps) {
  const tPage = useTranslations('mediuPage');

  return (
    <div className="mb-8">
      <CollapsibleSection
        icon={<Trash2 className="w-6 h-6 text-amber-700" />}
        iconBg="bg-amber-100"
        title={tPage('salubrizareTitle')}
        description={tPage('salubrizareDesc')}
        documents={salubrizareDocs}
        downloadLabel="PDF"
        defaultOpen={true}
      />

      <CollapsibleSection
        icon={<Droplets className="w-6 h-6 text-blue-700" />}
        iconBg="bg-blue-100"
        title={tPage('apaCanalTitle')}
        description={tPage('apaCanalDesc')}
        documents={apaCanalDocs}
        downloadLabel="PDF"
      />

      <CollapsibleSection
        icon={<TreePine className="w-6 h-6 text-green-700" />}
        iconBg="bg-green-100"
        title={tPage('spatiiVerziTitle')}
        description={tPage('spatiiVerziDesc')}
        documents={spatiiVerziDocs}
        downloadLabel="PDF"
      />
    </div>
  );
}
