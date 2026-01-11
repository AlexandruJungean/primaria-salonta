'use client';

import { useState } from 'react';
import { FileText, Info, Upload, Phone, Mail } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { CONTACT_INFO } from '@/lib/constants/contact';

const pageLabels = {
  ro: {
    breadcrumb1: 'Servicii Online',
    breadcrumb2: 'Petiții Online',
    definition: 'Prin PETIȚIE se înțelege cererea, reclamația, sesizarea sau propunerea formulată în scris ori prin poștă electronică, pe care un cetățean sau o organizație legal constituită o poate adresa autorităților și instituțiilor publice centrale și locale, serviciilor publice descentralizate ale ministerelor și ale celorlalte organe centrale, companiilor și societăților naționale, societăților comerciale de interes județean sau local, precum și regiilor autonome.',
    legalRef: '(art. 2 din Ordonanța Guvernului nr. 27/2002 privind reglementarea activității de soluționare a petițiilor, cu modificările ulterioare)',
    formTitle: 'Pentru depunerea unei petiții completați formularul următor:',
    tipPersoana: 'Tip persoană',
    persoanaFizica: 'Persoană fizică',
    persoanaJuridica: 'Persoană juridică',
    nume: 'Nume',
    prenume: 'Prenume',
    denumire: 'Denumire',
    reprezentant: 'Reprezentant legal',
    cui: 'CUI',
    email: 'E-mail',
    telefon: 'Telefon',
    adresaTitle: 'Adresă',
    tara: 'Țara',
    judet: 'Județ',
    localitate: 'Localitate',
    adresa: 'Adresă',
    mesaj: 'Mesaj',
    atasareFisier: 'Atașare fișier',
    trimite: 'Trimite',
  },
  hu: {
    breadcrumb1: 'Online Szolgáltatások',
    breadcrumb2: 'Online Beadványok',
    definition: 'A BEADVÁNY alatt írásban vagy elektronikus levélben megfogalmazott kérelmet, panaszt, bejelentést vagy javaslatot értünk, amelyet egy állampolgár vagy törvényesen létrehozott szervezet intézhet a központi és helyi közhatóságokhoz és közintézményekhez, a minisztériumok és más központi szervek decentralizált közszolgálataihoz, nemzeti társaságokhoz, megyei vagy helyi érdekű kereskedelmi társaságokhoz, valamint autonóm közigazgatási vállalatokhoz.',
    legalRef: '(a 27/2002. sz. Kormányrendelet 2. cikke a beadványok megoldásának szabályozásáról, a későbbi módosításokkal)',
    formTitle: 'Beadvány benyújtásához töltse ki az alábbi űrlapot:',
    tipPersoana: 'Személy típusa',
    persoanaFizica: 'Magánszemély',
    persoanaJuridica: 'Jogi személy',
    nume: 'Családnév',
    prenume: 'Keresztnév',
    denumire: 'Megnevezés',
    reprezentant: 'Jogi képviselő',
    cui: 'CUI',
    email: 'E-mail',
    telefon: 'Telefon',
    adresaTitle: 'Cím',
    tara: 'Ország',
    judet: 'Megye',
    localitate: 'Helység',
    adresa: 'Cím',
    mesaj: 'Üzenet',
    atasareFisier: 'Fájl csatolása',
    trimite: 'Küldés',
  },
  en: {
    breadcrumb1: 'Online Services',
    breadcrumb2: 'Online Petitions',
    definition: 'A PETITION means a request, complaint, report or proposal formulated in writing or by email, which a citizen or legally constituted organization may address to central and local public authorities and institutions, decentralized public services of ministries and other central bodies, national companies and societies, commercial companies of county or local interest, as well as autonomous administrations.',
    legalRef: '(art. 2 of Government Ordinance no. 27/2002 regarding the regulation of petition resolution activity, with subsequent amendments)',
    formTitle: 'To submit a petition, fill out the following form:',
    tipPersoana: 'Person type',
    persoanaFizica: 'Individual',
    persoanaJuridica: 'Legal entity',
    nume: 'Last name',
    prenume: 'First name',
    denumire: 'Company name',
    reprezentant: 'Legal representative',
    cui: 'CUI',
    email: 'E-mail',
    telefon: 'Phone',
    adresaTitle: 'Address',
    tara: 'Country',
    judet: 'County',
    localitate: 'City',
    adresa: 'Address',
    mesaj: 'Message',
    atasareFisier: 'Attach file',
    trimite: 'Submit',
  },
};

export default function PetitiiPage() {
  const [tipPersoana, setTipPersoana] = useState('fizica');
  
  // For now, default to Romanian - will be updated when we add proper locale handling
  const locale = 'ro';
  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.ro;

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <>
      <Breadcrumbs items={[
        { label: labels.breadcrumb1, href: '/servicii-online' },
        { label: labels.breadcrumb2 }
      ]} />
      <PageHeader titleKey="petitii" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Definition */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <p className="text-blue-800">{labels.definition}</p>
                    <p className="text-blue-600 text-sm italic mt-2">{labels.legalRef}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{labels.formTitle}</h2>
            
            <form className="space-y-6">
              {/* Tip persoană */}
              <div>
                <label className={labelClass}>{labels.tipPersoana}</label>
                <select 
                  value={tipPersoana}
                  onChange={(e) => setTipPersoana(e.target.value)}
                  className={inputClass}
                >
                  <option value="fizica">{labels.persoanaFizica}</option>
                  <option value="juridica">{labels.persoanaJuridica}</option>
                </select>
              </div>

              {/* Persoană fizică fields */}
              {tipPersoana === 'fizica' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{labels.nume}</label>
                    <input type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{labels.prenume}</label>
                    <input type="text" className={inputClass} />
                  </div>
                </div>
              )}

              {/* Persoană juridică fields */}
              {tipPersoana === 'juridica' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>{labels.denumire}</label>
                    <input type="text" className={inputClass} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{labels.reprezentant}</label>
                      <input type="text" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>{labels.cui}</label>
                      <input type="text" className={inputClass} />
                    </div>
                  </div>
                </div>
              )}

              {/* Email & Telefon */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{labels.email}</label>
                  <input type="email" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{labels.telefon}</label>
                  <input type="tel" className={inputClass} />
                </div>
              </div>

              {/* Adresă */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{labels.adresaTitle}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{labels.tara}</label>
                    <input type="text" className={inputClass} defaultValue="România" />
                  </div>
                  <div>
                    <label className={labelClass}>{labels.judet}</label>
                    <input type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{labels.localitate}</label>
                    <input type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{labels.adresa}</label>
                    <input type="text" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Mesaj */}
              <div>
                <label className={labelClass}>{labels.mesaj}</label>
                <textarea 
                  rows={6} 
                  className={inputClass}
                />
              </div>

              {/* Atașare fișier */}
              <div>
                <label className={labelClass}>{labels.atasareFisier}</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Alege fișier</span>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {labels.trimite}
                </button>
              </div>
            </form>

            {/* Contact Card */}
            <Card className="mt-8 bg-gray-50">
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <a
                    href={`tel:${CONTACT_INFO.phone.main.replace(/-/g, '')}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500">Telefon</p>
                      <p className="font-medium text-gray-900">{CONTACT_INFO.phone.main}</p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${CONTACT_INFO.email.primary}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500">E-mail</p>
                      <p className="font-medium text-gray-900">{CONTACT_INFO.email.primary}</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
