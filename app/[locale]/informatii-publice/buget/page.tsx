import { getTranslations } from 'next-intl/server';
import { Wallet, Download, FileText, Calendar, FolderOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('buget') };
}

// Types for budget documents
interface BudgetDocument {
  title: string;
  pdfUrl: string;
}

interface BudgetSection {
  id: string;
  title: string;
  date?: string;
  documents: BudgetDocument[];
}

interface YearBudget {
  year: number;
  sections: BudgetSection[];
}

// Mock data - will be replaced with database fetch
const BUDGET_DATA: YearBudget[] = [
  {
    year: 2025,
    sections: [
      {
        id: 'ct-exec-2024',
        title: 'Aprobare cont execuție + Situația financiară decembrie 2024',
        documents: [
          { title: 'HCLMS nr. 93 din 29.05.2025', pdfUrl: '#' },
          { title: 'Anexe 1_12_ct exec_dec 2024', pdfUrl: '#' },
          { title: 'Anexe 13_25_sit financiara_dec 2024', pdfUrl: '#' },
        ],
      },
      {
        id: 'rectificare-2025-06',
        title: 'Rectificare buget',
        date: '02.06.2025',
        documents: [
          { title: '02', pdfUrl: '#' },
          { title: '10', pdfUrl: '#' },
          { title: 'dezv', pdfUrl: '#' },
          { title: 'funct', pdfUrl: '#' },
        ],
      },
      {
        id: 'buget-initial-2025',
        title: 'Buget inițial, 2025',
        documents: [
          { title: '02', pdfUrl: '#' },
          { title: '10', pdfUrl: '#' },
          { title: 'dezv 02', pdfUrl: '#' },
          { title: 'dezv 10', pdfUrl: '#' },
          { title: 'funct 02', pdfUrl: '#' },
          { title: 'funct 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q1-2025',
        title: 'Situația financiară încheiată pe trim. I, 2025',
        documents: [
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
    ],
  },
  {
    year: 2024,
    sections: [
      {
        id: 'sit-fin-q4-2024',
        title: 'Situația financiară încheiată pe trim. IV, 2024',
        documents: [
          { title: '22', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'buget-final-2024',
        title: 'Buget final, 2024',
        documents: [
          { title: '02', pdfUrl: '#' },
          { title: 'dezv', pdfUrl: '#' },
          { title: 'funct', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q3-2024',
        title: 'Situația financiară încheiată pe trim. III, 2024',
        documents: [
          { title: '40b', pdfUrl: '#' },
          { title: 'balanta primarie', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q2-2024',
        title: 'Situația financiară încheiată pe trim. II, 2024',
        documents: [
          { title: '40b', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q1-2024',
        title: 'Situația financiară încheiată pe trim. I, 2024',
        documents: [
          { title: '40b', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'rectificare-2024-04',
        title: 'Rectificare buget',
        date: '05.04.2024',
        documents: [
          { title: '02', pdfUrl: '#' },
          { title: 'dezv 02', pdfUrl: '#' },
          { title: 'funct 02', pdfUrl: '#' },
        ],
      },
      {
        id: 'ct-exec-2023',
        title: 'HCLMS nr. 56/2024 – privind aprobarea contului de execuție și a situației financiare la 31.12.2023',
        documents: [],
      },
      {
        id: 'buget-initial-2024',
        title: 'Buget inițial, 2024',
        documents: [
          { title: '02', pdfUrl: '#' },
          { title: '10', pdfUrl: '#' },
          { title: 'dezv 02', pdfUrl: '#' },
          { title: 'dezv 10', pdfUrl: '#' },
          { title: 'formular 14', pdfUrl: '#' },
          { title: 'funct 02', pdfUrl: '#' },
          { title: 'funct 10', pdfUrl: '#' },
        ],
      },
    ],
  },
  {
    year: 2023,
    sections: [
      {
        id: 'sit-fin-q4-2023',
        title: 'Situația financiară încheiată pe trim. IV, 2023',
        documents: [
          { title: '22', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest speciala', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'buget-final-2023',
        title: 'Buget final, 2023',
        documents: [
          { title: '02', pdfUrl: '#' },
          { title: '10', pdfUrl: '#' },
          { title: 'dezv 02', pdfUrl: '#' },
          { title: 'dezv 10', pdfUrl: '#' },
          { title: 'funct 02', pdfUrl: '#' },
          { title: 'funct 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q3-2023',
        title: 'Situația financiară încheiată pe trim. III, 2023',
        documents: [
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q2-2023',
        title: 'Situația financiară încheiată pe trim. II, 2023',
        documents: [
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q1-2023',
        title: 'Situația financiară încheiată pe trim. I, 2023',
        documents: [
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest speciala', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'ct-exec-2022',
        title: 'Hotărârea nr. 64/2023 privind aprobarea contului de execuție bugetară pe anul 2022 și a situației financiare întocmite la data de 31.12.2022 al Mun. Salonta',
        documents: [],
      },
      {
        id: 'buget-initial-2023',
        title: 'Buget inițial 2023',
        documents: [
          { title: '02', pdfUrl: '#' },
          { title: '10', pdfUrl: '#' },
          { title: 'dezv 02', pdfUrl: '#' },
          { title: 'dezv 10', pdfUrl: '#' },
          { title: 'funct 02', pdfUrl: '#' },
          { title: 'funct 10', pdfUrl: '#' },
        ],
      },
    ],
  },
  {
    year: 2022,
    sections: [
      {
        id: 'sit-fin-q4-2022',
        title: 'Situația financiară încheiată pe trim. IV, 2022',
        documents: [
          { title: '19.02', pdfUrl: '#' },
          { title: '19.10', pdfUrl: '#' },
          { title: '22', pdfUrl: '#' },
          { title: '27', pdfUrl: '#' },
          { title: '34', pdfUrl: '#' },
          { title: '35a-', pdfUrl: '#' },
          { title: '35a+', pdfUrl: '#' },
          { title: '35b-', pdfUrl: '#' },
          { title: '35b+', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'buget-final-2022',
        title: 'Buget final 2022',
        documents: [
          { title: '02', pdfUrl: '#' },
          { title: '02_F1103_Buget_individual_2022_11_24_A2.0.130-1', pdfUrl: '#' },
          { title: '02_F1103_Buget_individual_2022_11_24_A2.0.130-1_semnat', pdfUrl: '#' },
          { title: '02_F1103_Buget_individual_2022_12_21_A2.0.131', pdfUrl: '#' },
          { title: '02_F1103_Buget_individual_2022_12_21_A2.0.131_semnat', pdfUrl: '#' },
          { title: '10', pdfUrl: '#' },
          { title: 'dezv 02', pdfUrl: '#' },
          { title: 'dezv 10', pdfUrl: '#' },
          { title: 'funct 02', pdfUrl: '#' },
          { title: 'funct 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q3-2022',
        title: 'Situația financiară încheiată pe trim. III, 2022',
        documents: [
          { title: '19 02', pdfUrl: '#' },
          { title: '27', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'ct-exec-2021',
        title: 'Contul de executie pentru anul 2021',
        documents: [],
      },
      {
        id: 'sit-fin-q2-2022',
        title: 'Situația financiară încheiată pe trim. II, 2022',
        documents: [
          { title: '19 02', pdfUrl: '#' },
          { title: '27', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q1-2022',
        title: 'Situația financiară încheiată pe trim. I, 2022',
        documents: [
          { title: '19 02', pdfUrl: '#' },
          { title: '27', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: 'Bilant 31.03.2022', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'buget-initial-2022',
        title: 'Buget inițial pentru anul 2022',
        documents: [
          { title: '02', pdfUrl: '#' },
          { title: '02_F1103_Buget_individual_2022_02_08_A2.0.122', pdfUrl: '#' },
          { title: '02_F1103_Buget_individual_2022_02_08_A2.0.122_INITIAL_SEMNAT', pdfUrl: '#' },
          { title: '10', pdfUrl: '#' },
          { title: 'dezv 02', pdfUrl: '#' },
          { title: 'dezv 10', pdfUrl: '#' },
          { title: 'funct 02', pdfUrl: '#' },
          { title: 'funct 10', pdfUrl: '#' },
        ],
      },
    ],
  },
  {
    year: 2021,
    sections: [
      {
        id: 'sit-fin-q4-2021',
        title: 'Situația financiară încheiată pe trim. IV, 2021',
        documents: [
          { title: '19 10', pdfUrl: '#' },
          { title: '22', pdfUrl: '#' },
          { title: '27', pdfUrl: '#' },
          { title: '34', pdfUrl: '#' },
          { title: '35a-', pdfUrl: '#' },
          { title: '35a+', pdfUrl: '#' },
          { title: '35b-', pdfUrl: '#' },
          { title: '35b+', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: '190 2', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q3-2021',
        title: 'Situația financiară încheiată pe trim. III, 2021',
        documents: [
          { title: '19.02', pdfUrl: '#' },
          { title: '19.10', pdfUrl: '#' },
          { title: '27 titl 58', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q2-2021',
        title: 'Situația financiară încheiată pe trim. II, 2021',
        documents: [
          { title: '19 02', pdfUrl: '#' },
          { title: '27', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q1-2021',
        title: 'Situația financiară încheiată pe trim. I, 2021',
        documents: [
          { title: '19.02', pdfUrl: '#' },
          { title: '27', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'buget-initial-2021',
        title: 'Buget inițial pentru anul 2021',
        documents: [
          { title: '02', pdfUrl: '#' },
          { title: '10', pdfUrl: '#' },
          { title: 'dezv 02', pdfUrl: '#' },
          { title: 'dezv 10', pdfUrl: '#' },
          { title: 'funct 02', pdfUrl: '#' },
          { title: 'funct 10', pdfUrl: '#' },
        ],
      },
    ],
  },
  {
    year: 2020,
    sections: [
      {
        id: 'ct-exec-2020',
        title: 'Contul de execuție pentru anul 2020',
        documents: [
          { title: 'CT EXEC_sursa A_pe anul 2020', pdfUrl: '#' },
          { title: 'CT EXEC_sursa E_pe anul 2020', pdfUrl: '#' },
          { title: 'HCLMS_APROBARE CT EXEC_pe anul 2020', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q4-2020',
        title: 'Situația financiară încheiată pe trim. IV, 2020',
        documents: [
          { title: '19.02', pdfUrl: '#' },
          { title: '19.10', pdfUrl: '#' },
          { title: '22', pdfUrl: '#' },
          { title: '27', pdfUrl: '#' },
          { title: '34', pdfUrl: '#' },
          { title: '35a-', pdfUrl: '#' },
          { title: '35a+', pdfUrl: '#' },
          { title: '35b-', pdfUrl: '#' },
          { title: '35b+', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q3-2020',
        title: 'Situația financiară încheiată pe trim. III, 2020',
        documents: [
          { title: '19.02', pdfUrl: '#' },
          { title: '19.10', pdfUrl: '#' },
          { title: '27', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest sepc', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
      {
        id: 'sit-fin-q2-2020',
        title: 'Situația financiară încheiată pe trim. II, 2020',
        documents: [
          { title: '19.02', pdfUrl: '#' },
          { title: '19.10', pdfUrl: '#' },
          { title: '27', pdfUrl: '#' },
          { title: '40b', pdfUrl: '#' },
          { title: 'bilant', pdfUrl: '#' },
          { title: 'ct de rez patrim', pdfUrl: '#' },
          { title: 'dezv plati 02', pdfUrl: '#' },
          { title: 'dezv plati 10', pdfUrl: '#' },
          { title: 'dezv venit 02', pdfUrl: '#' },
          { title: 'dezv venit 10', pdfUrl: '#' },
          { title: 'disp cu dest spec', pdfUrl: '#' },
          { title: 'flux de trezo', pdfUrl: '#' },
          { title: 'flux la banci', pdfUrl: '#' },
          { title: 'funct plati 02', pdfUrl: '#' },
          { title: 'funct plati 10', pdfUrl: '#' },
          { title: 'funct venit 02', pdfUrl: '#' },
          { title: 'funct venit 10', pdfUrl: '#' },
          { title: 'plati 02', pdfUrl: '#' },
          { title: 'plati 10', pdfUrl: '#' },
          { title: 'trezo', pdfUrl: '#' },
          { title: 'venit 02', pdfUrl: '#' },
          { title: 'venit 10', pdfUrl: '#' },
        ],
      },
    ],
  },
  {
    year: 2019,
    sections: [
      {
        id: 'ct-exec-2019',
        title: 'Contul de execuție pentru anul 2019',
        documents: [
          { title: 'CT EXEC_sursa A_pe anul 2019', pdfUrl: '#' },
          { title: 'CT EXEC_sursa E_pe anul 2019', pdfUrl: '#' },
          { title: 'HCLMS_APROBARE CT EXEC_pe anul 2019', pdfUrl: '#' },
        ],
      },
    ],
  },
  {
    year: 2018,
    sections: [
      {
        id: 'ct-exec-2018',
        title: 'Contul de execuție pentru anul 2018',
        documents: [
          { title: 'CT EXEC _sursa A_ pe anul 2018', pdfUrl: '#' },
          { title: 'CT EXEC_sursa E_pe anul 2018', pdfUrl: '#' },
          { title: 'HCLMS APROBARE CT EXEC pe anul 2018', pdfUrl: '#' },
        ],
      },
    ],
  },
];

function DocumentGrid({ documents }: { documents: BudgetDocument[] }) {
  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {documents.map((doc, idx) => (
        <a
          key={idx}
          href={doc.pdfUrl}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors"
        >
          <Download className="w-4 h-4 text-primary-600" />
          <span className="text-gray-700">{doc.title}</span>
        </a>
      ))}
    </div>
  );
}

function BudgetSectionCard({ section }: { section: BudgetSection }) {
  return (
    <Card hover className="mb-3">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-gray-900">{section.title}</h3>
              {section.date && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {section.date}
                </span>
              )}
            </div>
            {section.documents.length > 0 && (
              <DocumentGrid documents={section.documents} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function BugetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'bugetPage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('buget') }
      ]} />
      <PageHeader titleKey="buget" icon="wallet" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-primary-50 border-primary-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Wallet className="w-8 h-8 text-primary-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-primary-800 text-sm">
                      {tPage('infoText')}
                    </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

            {/* Budget by Year */}
            {BUDGET_DATA.map((yearData) => (
              <div key={yearData.year} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{yearData.year}</h2>
                  <span className="text-sm text-gray-500">
                    ({yearData.sections.length} {tPage('sections')})
                  </span>
                </div>

                <div className="space-y-3">
                  {yearData.sections.map((section) => (
                    <BudgetSectionCard key={section.id} section={section} />
              ))}
            </div>
              </div>
            ))}

            {/* Info Note */}
            <Card className="mt-8 bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{tPage('noteTitle')}</h3>
                    <p className="text-gray-600 text-sm">
                      {tPage('noteText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
