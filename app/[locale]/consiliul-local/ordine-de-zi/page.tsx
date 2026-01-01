'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Calendar, Download, Video, ExternalLink, ChevronDown, ChevronUp, Clock, Key } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

// Mock data - will be replaced with database content
const SESSIONS = [
  {
    id: '2025-12-30',
    date: '30 decembrie 2025',
    time: '10:00',
    convocationUrl: '#',
    zoomUrl: 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09&omn=81621638037',
    meetingId: '931 751 3142',
    passcode: 'r0mb8r',
  },
  {
    id: '2025-12-15',
    date: '15 decembrie 2025',
    time: '15:00',
    convocationUrl: '#',
    zoomUrl: 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09&omn=82201768025',
    meetingId: '931 751 3142',
    passcode: 'r0mb8r',
  },
  {
    id: '2025-11-27',
    date: '27 noiembrie 2025',
    time: '15:00',
    convocationUrl: '#',
    zoomUrl: 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09&omn=85176517240',
    meetingId: '931 751 3142',
    passcode: 'r0mb8r',
  },
  {
    id: '2025-10-30',
    date: '30 octombrie 2025',
    time: '15:00',
    convocationUrl: '#',
    zoomUrl: 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09&omn=88640378992',
    meetingId: '931 751 3142',
    passcode: 'r0mb8r',
  },
  {
    id: '2025-09-30',
    date: '30 septembrie 2025',
    time: '15:00',
    convocationUrl: '#',
    zoomUrl: 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09&omn=81436950488',
    meetingId: '931 751 3142',
    passcode: 'r0mb8r',
  },
  {
    id: '2025-09-25',
    date: '25 septembrie 2025',
    time: '15:00',
    convocationUrl: '#',
    zoomUrl: 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09&omn=84182415635',
    meetingId: '931 751 3142',
    passcode: 'r0mb8r',
  },
  {
    id: '2025-08-27',
    date: '27 august 2025',
    time: '15:00',
    convocationUrl: '#',
    zoomUrl: 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09&omn=88228441893',
    meetingId: '931 751 3142',
    passcode: 'r0mb8r',
  },
  {
    id: '2025-07-31',
    date: '31 iulie 2025',
    time: '15:00',
    convocationUrl: '#',
    zoomUrl: 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09&omn=87993869077',
    meetingId: '931 751 3142',
    passcode: 'r0mb8r',
  },
  {
    id: '2025-07-02',
    date: '2 iulie 2025',
    time: '15:00',
    convocationUrl: '#',
    zoomUrl: 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09&omn=88226879875',
    meetingId: '931 751 3142',
    passcode: 'r0mb8r',
  },
  {
    id: '2025-06-26',
    date: '26 iunie 2025',
    time: '15:00',
    convocationUrl: '#',
    zoomUrl: 'https://us06web.zoom.us/j/9317513142?pwd=YWNTZHlsRndMMzhpaTFuNzNyb25sQT09&omn=84073843069',
    meetingId: '931 751 3142',
    passcode: 'r0mb8r',
  },
];

function SessionCard({ session }: { session: typeof SESSIONS[0] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ts = useTranslations('sessionsPage');

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header - Always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-primary-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{session.date}</h3>
              <p className="text-sm text-gray-500">
                {ts('liveAt')} {session.time}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={session.convocationUrl}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              {ts('convocation')}
            </a>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="px-4 pb-4 pt-0 border-t border-gray-100">
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Video className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">{ts('liveStream')}</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800">
                    {ts('startTime')}: <strong>{session.time}</strong>
                  </span>
                </div>

                <div>
                  <p className="text-sm text-blue-800 mb-1">Zoom Meeting:</p>
                  <a
                    href={session.zoomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 break-all"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    {session.zoomUrl}
                  </a>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-800">Meeting ID:</span>
                    <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-blue-900">
                      {session.meetingId}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">Passcode:</span>
                    <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-blue-900">
                      {session.passcode}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OrdineZiPage() {
  const t = useTranslations('navigation');
  const ts = useTranslations('sessionsPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('ordineZi') }
      ]} />
      <PageHeader titleKey="ordineZi" icon="clipboardList" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {ts('description')}
            </p>

            <div className="space-y-3">
              {SESSIONS.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
