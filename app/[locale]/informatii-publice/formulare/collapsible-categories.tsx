'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Download, FileText, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Document {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  subcategory: string | null;
}

interface CategoryConfig {
  id: string;
  titleKey: string;
  icon: string;
}

// Category configuration - icons and translation keys
const CATEGORY_CONFIG: CategoryConfig[] = [
  { id: 'achizitii_publice', titleKey: 'achizitiiPublice', icon: '📋' },
  { id: 'asistenta_sociala', titleKey: 'asistentaSociala', icon: '🤝' },
  { id: 'autorizari_constructii', titleKey: 'autorizariConstructii', icon: '🏗️' },
  { id: 'birou_agricol', titleKey: 'birouAgricol', icon: '🌾' },
  { id: 'centrul_zi', titleKey: 'centrulZi', icon: '👴' },
  { id: 'dezvoltare_urbana', titleKey: 'dezvoltareUrbana', icon: '🏙️' },
  { id: 'diverse', titleKey: 'diverse', icon: '📁' },
  { id: 'evidenta_populatiei', titleKey: 'evidentaPopulatiei', icon: '🪪' },
  { id: 'impozite_taxe', titleKey: 'impoziteTaxe', icon: '💰' },
  { id: 'protectie_civila', titleKey: 'protectieCivila', icon: '🛡️' },
  { id: 'resurse_umane', titleKey: 'resurseUmane', icon: '👥' },
  { id: 'stare_civila', titleKey: 'stareCivila', icon: '📜' },
  { id: 'urbanism', titleKey: 'urbanismAmenajare', icon: '🗺️' },
  { id: 'transparenta', titleKey: 'transparenta', icon: '🔍' },
];

interface CategorySectionProps {
  config: CategoryConfig;
  documents: Document[];
  defaultOpen?: boolean;
}

function CategorySection({ config, documents, defaultOpen = false }: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const tf = useTranslations('formularePage');

  if (documents.length === 0) return null;

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden ${isOpen ? 'bg-gray-50' : 'bg-white'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors ${isOpen ? 'bg-white border-b border-gray-200' : ''}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <h2 className="text-lg font-semibold text-gray-900">
            {tf(`categories.${config.titleKey}`)}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {documents.length} {tf('forms')}
          </span>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid gap-2 p-4">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">{doc.title}</span>
              </div>
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded text-xs font-medium shrink-0"
              >
                <Download className="w-3 h-3" />
                PDF
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormulareCollapsibleCategories() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const tf = useTranslations('formularePage');

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('/api/documents?category=formulare');
        if (response.ok) {
          const result = await response.json();
          setDocuments(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  // Group documents by subcategory
  const groupedDocuments = new Map<string, Document[]>();
  documents.forEach((doc) => {
    const subcategory = doc.subcategory || 'diverse';
    if (!groupedDocuments.has(subcategory)) {
      groupedDocuments.set(subcategory, []);
    }
    groupedDocuments.get(subcategory)!.push(doc);
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
        <p className="text-gray-500 mt-4">Se încarcă formularele...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">{tf('noForms')}</p>
      </div>
    );
  }

  // Get categories that have documents, maintaining the order from CATEGORY_CONFIG
  const categoriesWithDocs = CATEGORY_CONFIG.filter(config => 
    groupedDocuments.has(config.id) && groupedDocuments.get(config.id)!.length > 0
  );

  return (
    <div className="space-y-4">
      {categoriesWithDocs.map((config, index) => (
        <CategorySection
          key={config.id}
          config={config}
          documents={groupedDocuments.get(config.id) || []}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}
