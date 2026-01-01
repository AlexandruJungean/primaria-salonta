'use client';

import { useState } from 'react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Form {
  title: string;
  url: string;
}

interface FormCategory {
  id: string;
  titleKey: string;
  icon: string;
  forms: Form[];
}

interface CategorySectionProps {
  category: FormCategory;
  defaultOpen?: boolean;
}

function CategorySection({ category, defaultOpen = false }: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const tf = useTranslations('formularePage');

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden ${isOpen ? 'bg-gray-50' : 'bg-white'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors ${isOpen ? 'bg-white border-b border-gray-200' : ''}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <h2 className="text-lg font-semibold text-gray-900">
            {tf(`categories.${category.titleKey}`)}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {category.forms.length} {tf('forms')}
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
          {category.forms.map((form, index) => (
            <div 
              key={index}
              className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">{form.title}</span>
              </div>
              <Link
                href={form.url}
                className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded text-xs font-medium shrink-0"
              >
                <Download className="w-3 h-3" />
                PDF
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Form categories with their forms - all documents come from database
const FORM_CATEGORIES: FormCategory[] = [
  {
    id: 'achizitii',
    titleKey: 'achizitiiPublice',
    icon: '📋',
    forms: [
      { title: 'Formulare-achiziții-publice-directe', url: '#' },
      { title: 'Formulare-achiziții-publice-cerere-de-oferte', url: '#' },
    ]
  },
  {
    id: 'asistenta',
    titleKey: 'asistentaSociala',
    icon: '🤝',
    forms: [
      { title: 'Cerere pentru acordarea indemnizației de creștere a copilului', url: '#' },
      { title: 'Cerere pentru încadrarea copilului cu dizabilități în grad de handicap', url: '#' },
      { title: 'Cerere asistent personal', url: '#' },
      { title: 'Cerere pentru acordarea ajutorului pentru încălzirea locuinței', url: '#' },
      { title: 'Cerere pt. ajutor de urgență', url: '#' },
      { title: 'Adeverință asistent personal', url: '#' },
      { title: 'Adeverință ajutor social', url: '#' },
      { title: 'Cerere cantină socială', url: '#' },
      { title: 'Dosar rovinietă', url: '#' },
    ]
  },
  {
    id: 'constructii',
    titleKey: 'autorizariConstructii',
    icon: '🏗️',
    forms: [
      { title: 'Cerere prelungire CU', url: '#' },
      { title: 'Model panou', url: '#' },
      { title: 'Comunicare începere lucrări', url: '#' },
      { title: 'Comunicare ISC privind începere lucrări', url: '#' },
      { title: 'Cerere prelungirea valabilității AC', url: '#' },
      { title: 'Comunicare încheiere lucrări', url: '#' },
      { title: 'Comunicare ISC încheiere lucrări', url: '#' },
      { title: 'Cerere regularizare', url: '#' },
      { title: 'Invitație recepție', url: '#' },
      { title: 'Proces-verbal de recepție parțială', url: '#' },
      { title: 'Proces-verbal de recepție la terminarea lucrărilor', url: '#' },
      { title: 'Proces-verbal de recepție finală', url: '#' },
      { title: 'Cerere certificat de atestare a edificării', url: '#' },
      { title: 'Cerere radiere construcție', url: '#' },
      { title: 'Taxe pentru eliberarea certificatelor, avizelor și autorizațiilor', url: '#' },
    ]
  },
  {
    id: 'agricol',
    titleKey: 'birouAgricol',
    icon: '🌾',
    forms: [
      { title: 'Declarație înscriere în Registrul agricol 2020-2024', url: '#' },
      { title: 'Acte necesare pentru înscrierea contractului de arendă sau de comodat în R.A.', url: '#' },
      { title: 'Cerere pt. registrul agricol', url: '#' },
      { title: 'Rentă viageră – cerere', url: '#' },
      { title: 'Rentă viageră – anexa 2', url: '#' },
      { title: 'Rentă viageră – anexa 3', url: '#' },
      { title: 'Rentă viageră – anexa 6', url: '#' },
      { title: 'Cerere sterilizare câini', url: '#' },
    ]
  },
  {
    id: 'centrulzi',
    titleKey: 'centrulZi',
    icon: '👴',
    forms: [
      { title: 'Cerere de admitere', url: '#' },
    ]
  },
  {
    id: 'dezvoltare',
    titleKey: 'dezvoltareUrbana',
    icon: '🏙️',
    forms: [
      { title: 'Cerere comerț ocazional stradal', url: '#' },
      { title: 'Cerere închiriere teren sezonier', url: '#' },
      { title: 'Cerere închiriere teren Târg Crăciun', url: '#' },
      { title: 'Cerere Ordin Prefect', url: '#' },
      { title: 'Cerere prelungire contract de închiriere spațiu', url: '#' },
      { title: 'Cerere prelungire contract de închiriere ANL', url: '#' },
      { title: 'Cerere recalculare chirie locuință ANL', url: '#' },
      { title: 'Cerere schimb locuință ANL și locuință socială', url: '#' },
      { title: 'Cerere transcriere contract ANL ca urmare a decesului titularului', url: '#' },
      { title: 'Cerere acceptare locuință ANL', url: '#' },
      { title: 'Cerere înscriere pe lista de priorități ANL', url: '#' },
      { title: 'Cerere scutire chirie în baza certificatului de handicap', url: '#' },
      { title: 'Cerere înscriere pe lista de priorități la locuințe sociale', url: '#' },
      { title: 'Cerere acceptare locuință socială', url: '#' },
      { title: 'Cerere prelungire contract locuință socială', url: '#' },
      { title: 'Cerere închiriere teren', url: '#' },
      { title: 'Cerere prelungire contract de închiriere teren', url: '#' },
      { title: 'Cerere schimbare titular contract de închiriere', url: '#' },
      { title: 'Autorizație de transport', url: '#' },
      { title: 'Atribuirea în folosință gratuită a unui teren pentru construirea de locuință', url: '#' },
      { title: 'Adeverință de spațiu pentru depozitarea caroseriei autoturismului', url: '#' },
      { title: 'Aviz de săpătură', url: '#' },
      { title: 'Cerere privind sprijinul acordat tinerilor pentru construirea unei locuințe proprietate personală', url: '#' },
      { title: 'Cerere pentru emitere aviz/acord administrator drum/străzi', url: '#' },
    ]
  },
  {
    id: 'diverse',
    titleKey: 'diverse',
    icon: '📁',
    forms: [
      { title: 'Formular de înscriere în Registrul de Evidență a sistemelor individuale adecvate pentru colectarea apelor uzate al Municipiului Salonta', url: '#' },
      { title: 'Formular înscriere Registru SIA pentru epurare', url: '#' },
      { title: 'Cerere pentru compostor PVC', url: '#' },
      { title: 'Circulația anumitor documente oficiale între statele membre UE', url: '#' },
      { title: 'Cerere 50 ani de căsătorie (RO)', url: '#' },
      { title: 'Cerere 50 ani de căsătorie (HU)', url: '#' },
    ]
  },
  {
    id: 'evidenta',
    titleKey: 'evidentaPopulatiei',
    icon: '🪪',
    forms: [
      { title: 'Cerere pentru eliberarea actului de identitate', url: '#' },
      { title: 'Cerere pentru înscrierea în actul de identitate a mențiunii privind stabilirea reședinței', url: '#' },
      { title: 'Cerere pentru eliberarea actului de identitate ca urmare a schimbării domiciliului din străinătate în România', url: '#' },
      { title: 'Cerere pentru eliberarea actului de identitate cetățenilor români cu domiciliul în străinătate și reședința în România', url: '#' },
    ]
  },
  {
    id: 'impozite',
    titleKey: 'impoziteTaxe',
    icon: '💰',
    forms: [
      { title: 'Împuternicire', url: '#' },
      { title: 'PF Anexă la Declarație clădiri', url: '#' },
      { title: 'PF Anexă la Declarație teren', url: '#' },
      { title: 'PF Cerere adeverință', url: '#' },
      { title: 'PF Cerere certificat fiscal', url: '#' },
      { title: 'PF Cerere scutire', url: '#' },
      { title: 'PF Cerere transcriere clădiri vânzător', url: '#' },
      { title: 'PF Cerere transcriere clădiri', url: '#' },
      { title: 'PF Cerere transcriere teren vânzător', url: '#' },
      { title: 'PF Cerere transcriere teren', url: '#' },
      { title: 'PF Declarație clădiri', url: '#' },
      { title: 'PF Declarație teren', url: '#' },
      { title: 'PF PJ Declarație de scoatere din evidență a mijloacelor de transport', url: '#' },
      { title: 'PF+PJ Cerere compensare', url: '#' },
      { title: 'PF+PJ Cerere restituire', url: '#' },
      { title: 'PF+PJ Declarație autovehicule peste 12t', url: '#' },
      { title: 'PF+PJ Declarație autovehicule', url: '#' },
      { title: 'PF+PJ Declarație bărci', url: '#' },
      { title: 'PJ Anexă la Declarație clădiri', url: '#' },
      { title: 'PJ Anexă la Declarație teren', url: '#' },
      { title: 'PJ Anexa2-Cerere eliberare', url: '#' },
      { title: 'PJ Anexa3-Cerere orar funcționare', url: '#' },
      { title: 'PJ Anexa5-Declarație pe proprie răspundere', url: '#' },
      { title: 'PJ Cerere certificat fiscal', url: '#' },
      { title: 'PJ Cerere înregistrare vânzare a abonamentelor și a biletelor de intrare la spectacole', url: '#' },
      { title: 'PJ Declarație clădiri', url: '#' },
      { title: 'PJ Declarație taxă afișaj', url: '#' },
      { title: 'PJ Declarație taxă reclamă', url: '#' },
      { title: 'PJ Impozit spectacole', url: '#' },
    ]
  },
  {
    id: 'protectie',
    titleKey: 'protectieCivila',
    icon: '🛡️',
    forms: [
      { title: 'Cerere privind acordarea sumei forfetare prevăzute din Ordonanța de urgență a Guvernului nr. 15 din 2022', url: '#' },
    ]
  },
  {
    id: 'resurse',
    titleKey: 'resurseUmane',
    icon: '👥',
    forms: [
      { title: 'Formular înscriere concurs funcții publice', url: '#' },
      { title: 'Formular înscriere funcții contractuale', url: '#' },
      { title: 'Model adeverință concurs', url: '#' },
    ]
  },
  {
    id: 'starecivila',
    titleKey: 'stareCivila',
    icon: '📜',
    forms: [
      { title: 'Cerere adeverință înhumare', url: '#' },
      { title: 'Cerere de rectificare acte de stare civilă', url: '#' },
      { title: 'Cerere de transcriere', url: '#' },
      { title: 'Cerere eliberare certificate', url: '#' },
      { title: 'Cerere înregistrare tardivă a nașterii', url: '#' },
      { title: 'Cerere înscriere divorț din străinătate', url: '#' },
      { title: 'Cerere ortografiere nume', url: '#' },
      { title: 'Cerere schimbare nume din străinătate', url: '#' },
      { title: 'Cerere schimbare nume în Monitorul Oficial', url: '#' },
      { title: 'Cerere schimbare nume pe cale administrativă', url: '#' },
      { title: 'Cerere universală', url: '#' },
      { title: 'Declarație de căsătorie', url: '#' },
      { title: 'Declarație deces naționalitate', url: '#' },
      { title: 'Declarație domiciliul copilului', url: '#' },
      { title: 'Declarație naționalitate la naștere', url: '#' },
      { title: 'Declarație pe proprie răspundere căsătorie', url: '#' },
      { title: 'Declarație recunoaștere și purtare nume', url: '#' },
      { title: 'Dosar căsătorie 1', url: '#' },
      { title: 'Dosar căsătorie 2', url: '#' },
      { title: 'Publicație de căsătorie', url: '#' },
      { title: 'Solicitare oficiere căsătorie în limba maghiară', url: '#' },
    ]
  },
  {
    id: 'urbanism',
    titleKey: 'urbanismAmenajare',
    icon: '🗺️',
    forms: [
      { title: 'Cerere adeverință schimbare denumire stradă', url: '#' },
      { title: 'Cerere certificat nomenclatură stradală și adresă', url: '#' },
      { title: 'Cerere adeverință radiere autovehicul', url: '#' },
      { title: 'Cerere adeverință intravilan sau extravilan', url: '#' },
      { title: 'Cerere afișare anunț consultarea populației intenția elaborare PUZ', url: '#' },
      { title: 'Cerere afișare anunț consultarea populației elaborare PUD sau PUZ', url: '#' },
      { title: 'Cerere pentru promovarea în ședința CLMS a PUD sau PUZ', url: '#' },
    ]
  },
  {
    id: 'transparenta',
    titleKey: 'transparenta',
    icon: '🔍',
    forms: [
      { title: 'Cerere informații de interes public', url: '#' },
      { title: 'Reclamație privind transparența', url: '#' },
    ]
  },
];

export function FormulareCollapsibleCategories() {
  return (
    <div className="space-y-4">
      {FORM_CATEGORIES.map((category, index) => (
        <CategorySection
          key={category.id}
          category={category}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}

