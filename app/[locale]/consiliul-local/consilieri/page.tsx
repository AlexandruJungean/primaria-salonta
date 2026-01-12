import { getTranslations, getMessages } from 'next-intl/server';
import { Users, User, FileText, Download, ClipboardList } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { getCouncilMembers, getDocumentsByCategory } from '@/lib/supabase/services';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { translateContentArray } from '@/lib/google-translate/cache';

interface ConsilieriPageMessages {
  consilieriPage: {
    introduction: string;
    councilorsTitle: string;
    responsibilitiesTitle: string;
    responsibilities: string[];
  };
}

const PARTY_COLORS: Record<string, string> = {
  'UDMR': 'bg-green-600',
  'PSD': 'bg-red-600',
  'PNL': 'bg-yellow-500',
  'USR': 'bg-blue-600',
  'PMP': 'bg-purple-600',
  'AUR': 'bg-amber-600',
  'Independent': 'bg-gray-500',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'consilieri',
    locale: locale as Locale,
    path: '/consiliul-local/consilieri',
  });
}

export default async function ConsilieriPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('navigation');
  const tc = await getTranslations('consilieriPage');
  const messages = await getMessages() as ConsilieriPageMessages;
  const responsibilities = messages.consilieriPage?.responsibilities || [];

  // Fetch council members from database
  const councilMembersData = await getCouncilMembers();
  
  // Fetch documents for this page (consilieri_locali category)
  const documentsData = await getDocumentsByCategory('consilieri_locali');

  // Translate document content based on locale (NOT person names - they are proper nouns)
  const councilMembers = councilMembersData;
  const documents = await translateContentArray(
    documentsData, 
    ['title', 'description'], 
    locale as 'ro' | 'hu' | 'en'
  );

  // Group members by party
  const membersByParty = councilMembers.reduce((acc, member) => {
    const party = member.party || 'Independent';
    if (!acc[party]) {
      acc[party] = [];
    }
    acc[party].push(member);
    return acc;
  }, {} as Record<string, typeof councilMembers>);

  // Sort parties by number of members (descending)
  const sortedParties = Object.entries(membersByParty)
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('consilieriLocali') }
      ]} />
      <PageHeader titleKey="consilieriLocali" icon="users" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">

            {/* Documents */}
            {documents.length > 0 && (
              <div className="space-y-3 mb-8">
                {documents.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-4 gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-primary-700" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 text-sm leading-snug block">
                              {doc.title}
                            </span>
                            {doc.description && (
                              <span className="text-xs text-gray-500 mt-1 block">
                                {doc.description}
                              </span>
                            )}
                          </div>
                        </div>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-medium shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Introduction Text */}
            <Card className="mb-6 bg-gray-50">
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  {tc('introduction')}
                </p>
              </CardContent>
            </Card>

            {/* Councilors by Party */}
            {councilMembers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Nu există informații despre consilieri momentan.</p>
              </div>
            ) : (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-600" />
                    {tc('councilorsTitle')}
                  </h2>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sortedParties.map(([party, members]) => (
                      <div key={party} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-4 h-4 rounded ${PARTY_COLORS[party] || 'bg-gray-400'}`}></div>
                          <h3 className="font-bold text-gray-900">{party}</h3>
                          <span className="text-xs text-gray-500">({members.length})</span>
                        </div>
                        <ul className="space-y-1.5">
                          {members.map((member) => (
                            <li key={member.id} className="flex items-center gap-2 text-sm text-gray-700">
                              <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              {member.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Responsibilities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary-600" />
                  {tc('responsibilitiesTitle')}
                </h2>
                
                <ol className="space-y-3 text-sm text-gray-600 list-decimal list-outside ml-5">
                  {responsibilities.map((item, index) => (
                    <li key={index} className="pl-2 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

          </div>
        </Container>
      </Section>
    </>
  );
}
