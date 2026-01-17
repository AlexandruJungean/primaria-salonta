'use client';

import { ExternalLink, Scale, Info } from 'lucide-react';
import {
  AdminPageHeader,
  AdminCard,
} from '@/components/admin';

// Current hardcoded legislation links from frontend
const LEGISLATION_LINKS = [
  { 
    title: 'Ordonanța de Urgență nr. 57/2019 - Codul Administrativ', 
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/215925',
    description: 'Codul administrativ al României',
    isPrimary: true,
  },
  { 
    title: 'Constituția României', 
    url: 'https://www.cdep.ro/pls/dic/site.page?id=339',
    description: 'Legea fundamentală a statului român',
  },
  { 
    title: 'Legea 52/2003 - Transparență decizională', 
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/41571',
    description: 'Privind transparența decizională în administrația publică',
  },
  { 
    title: 'Legea 544/2001 - Acces la informații publice', 
    url: 'https://legislatie.just.ro/Public/DetaliiDocument/31438',
    description: 'Privind liberul acces la informațiile de interes public',
  },
];

export default function LegislatiePage() {
  return (
    <div>
      <AdminPageHeader
        title="Legislație"
        description="Link-uri către actele normative relevante pentru administrația publică locală"
        breadcrumbs={[
          { label: 'Primăria', href: '/admin/primaria' },
          { label: 'Legislație' },
        ]}
      />

      <AdminCard className="mb-6 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900">Informații</h3>
            <p className="text-amber-800 mt-1">
              Pagina de legislație afișează link-uri către actele normative externe (legislatie.just.ro, cdep.ro). 
              Aceste link-uri sunt configurate în codul sursă al website-ului. Pentru modificări, 
              contactați echipa de dezvoltare.
            </p>
          </div>
        </div>
      </AdminCard>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Scale className="w-5 h-5" />
          Link-uri Afișate pe Website
        </h2>
        
        {LEGISLATION_LINKS.map((link, index) => (
          <AdminCard 
            key={index} 
            className={link.isPrimary ? 'bg-blue-50 border-blue-200' : ''}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${link.isPrimary ? 'bg-blue-600' : 'bg-slate-200'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Scale className={`w-6 h-6 ${link.isPrimary ? 'text-white' : 'text-slate-600'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{link.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{link.description}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Deschide link-ul
                </a>
              </div>
              {link.isPrimary && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  Principal
                </span>
              )}
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
