'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, Loader2, Users, FileText } from 'lucide-react';

interface SectionData {
  title: string;
  legalRef?: string;
  penalty?: string;
  description?: string;
  docs: string[];
  notes: string[];
}

interface Section {
  id: string;
  content_key: string;
  sort_order: number;
  data: SectionData;
}

interface CollapsibleSectionProps {
  section: Section;
  defaultOpen?: boolean;
}

function CollapsibleSection({ section, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { data } = section;

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${isOpen ? 'bg-gray-50' : 'bg-white'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors text-left ${isOpen ? 'bg-white border-b border-gray-200' : ''}`}
      >
        <div>
          <h3 className="font-semibold text-gray-900">{data.title}</h3>
          {data.legalRef && (
            <p className="text-xs text-gray-500 mt-0.5">{data.legalRef}</p>
          )}
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 space-y-4">
          {/* Penalty */}
          {data.penalty && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="text-amber-800">{data.penalty}</span>
            </div>
          )}
          
          {/* Description */}
          {data.description && (
            <p className="text-sm text-gray-700">{data.description}</p>
          )}
          
          {/* Required Documents */}
          {data.docs.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm uppercase tracking-wide">Acte necesare:</h4>
              <ul className="space-y-1.5">
                {data.docs.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Notes */}
          {data.notes.length > 0 && data.notes.map((note, idx) => (
            <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <strong>Notă:</strong> {note}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface DepartmentProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  sections: Section[];
  defaultOpen?: boolean;
}

function Department({ title, description, icon, iconBg, sections, defaultOpen = false }: DepartmentProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-2 border-gray-200 rounded-xl overflow-hidden ${isOpen ? 'bg-white' : 'bg-gray-50'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 hidden sm:block">{sections.length} servicii</span>
          <ChevronDown 
            className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[20000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5 pt-0 space-y-3 border-t border-gray-200">
          {sections.map((section, idx) => (
            <CollapsibleSection 
              key={section.id} 
              section={section} 
              defaultOpen={idx === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SeipCollapsibleSections() {
  const [loading, setLoading] = useState(true);
  const [evidenta, setEvidenta] = useState<Section[]>([]);
  const [stareCivila, setStareCivila] = useState<Section[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/public/page-content?page_key=seip');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        // Parse and group sections
        const evidentaSections: Section[] = [];
        const stareCivilaSections: Section[] = [];
        
        data.forEach((item: { id: string; content_key: string; content: string; sort_order: number }) => {
          try {
            const parsed = JSON.parse(item.content);
            const section: Section = {
              id: item.id,
              content_key: item.content_key,
              sort_order: item.sort_order,
              data: {
                title: parsed.title || '',
                legalRef: parsed.legalRef,
                penalty: parsed.penalty,
                description: parsed.description,
                docs: parsed.docs || [],
                notes: parsed.notes || [],
              },
            };
            
            if (item.content_key.startsWith('evidenta_')) {
              evidentaSections.push(section);
            } else if (item.content_key.startsWith('stare-civila_')) {
              stareCivilaSections.push(section);
            }
          } catch {
            console.error('Error parsing section:', item.content_key);
          }
        });
        
        // Sort by sort_order
        evidentaSections.sort((a, b) => a.sort_order - b.sort_order);
        stareCivilaSections.sort((a, b) => a.sort_order - b.sort_order);
        
        setEvidenta(evidentaSections);
        setStareCivila(stareCivilaSections);
      } catch (error) {
        console.error('Error fetching SEIP data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // If no data from database, show a message
  if (evidenta.length === 0 && stareCivila.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Informațiile sunt în curs de actualizare.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {evidenta.length > 0 && (
        <Department
          title="1. Compartimentul de Evidență"
          description="Acte de identitate și evidența populației"
          icon={<Users className="w-7 h-7 text-blue-700" />}
          iconBg="bg-blue-100"
          sections={evidenta}
          defaultOpen={true}
        />
      )}

      {stareCivila.length > 0 && (
        <Department
          title="2. Compartimentul de Stare Civilă"
          description="Certificate de naștere, căsătorie, deces și alte acte"
          icon={<FileText className="w-7 h-7 text-emerald-700" />}
          iconBg="bg-emerald-100"
          sections={stareCivila}
        />
      )}
    </div>
  );
}
