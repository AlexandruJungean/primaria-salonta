import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Download, FileText, Info, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('formulare') };
}

// Form categories with their forms - all documents come from database
const FORM_CATEGORIES = [
  {
    id: 'achizitii',
    titleKey: 'achizitiiPublice',
    icon: '📋',
    color: 'blue',
    forms: [
      { title: 'Formulare-achiziții-publice-directe', url: '#' },
      { title: 'Formulare-achiziții-publice-cerere-de-oferte', url: '#' },
    ]
  },
  {
    id: 'asistenta',
    titleKey: 'asistentaSociala',
    icon: '❤️',
    color: 'rose',
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
    color: 'amber',
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
    color: 'green',
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
    color: 'purple',
    forms: [
      { title: 'Cerere de admitere', url: '#' },
    ]
  },
  {
    id: 'dezvoltare',
    titleKey: 'dezvoltareUrbana',
    icon: '🏙️',
    color: 'indigo',
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
    color: 'gray',
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
    color: 'cyan',
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
    color: 'emerald',
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
    color: 'orange',
    forms: [
      { title: 'Cerere privind acordarea sumei forfetare prevăzute din Ordonanța de urgență a Guvernului nr. 15 din 2022', url: '#' },
    ]
  },
  {
    id: 'resurse',
    titleKey: 'resurseUmane',
    icon: '👥',
    color: 'teal',
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
    color: 'pink',
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
    color: 'violet',
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
    color: 'slate',
    forms: [
      { title: 'Cerere informații de interes public', url: '#' },
      { title: 'Reclamație privind transparența', url: '#' },
    ]
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
};

export default function FormularePage() {
  const t = useTranslations('navigation');
  const tf = useTranslations('formularePage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('serviciiOnline'), href: '/servicii-online' },
        { label: t('formulare') }
      ]} />
      <PageHeader titleKey="formulare" icon="clipboardList" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            
            {/* Info card */}
            <Card className="mb-8 bg-primary-50 border-primary-200">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">{tf('intro')}</p>
                    <Link 
                      href="#" 
                      target="_blank"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {tf('metodologie')}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <div className="space-y-8">
              {FORM_CATEGORIES.map((category) => {
                const colors = COLOR_MAP[category.color] || COLOR_MAP.gray;
                return (
                  <div key={category.id}>
                    <div className={`flex items-center gap-3 mb-4 p-3 rounded-lg ${colors.bg} ${colors.border} border`}>
                      <span className="text-2xl">{category.icon}</span>
                      <h2 className={`text-lg font-semibold ${colors.text}`}>
                        {tf(`categories.${category.titleKey}`)}
                      </h2>
                      <span className={`ml-auto text-sm ${colors.text} opacity-75`}>
                        {category.forms.length} {tf('forms')}
                      </span>
                    </div>
                    <div className="grid gap-2">
                      {category.forms.map((form, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
                );
              })}
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
