'use client';

import { useState } from 'react';
import { Archive, ChevronDown, ChevronUp, Download, FileText, Paperclip, ScrollText } from 'lucide-react';
import type { DocumentWithAnnexes } from '@/lib/types/database';

interface ArchiveSectionProps {
  documents: DocumentWithAnnexes[];
  labels: {
    archiveTitle: string;
    documentsLabel: string;
    annexes: string;
  };
}

export function ArchiveSection({ documents, labels }: ArchiveSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to get file extension label
  const getDownloadLabel = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'doc' || ext === 'docx') return 'DOC';
    return 'PDF';
  };

  if (documents.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
            <Archive className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900">{labels.archiveTitle}</h2>
            <span className="text-sm text-gray-500">({documents.length} {labels.documentsLabel})</span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-4 space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="rounded-lg border bg-gray-50 border-gray-200">
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start gap-3 p-4 hover:bg-gray-100 transition-colors group rounded-t-lg ${doc.annexes.length === 0 ? 'rounded-b-lg' : ''}`}
              >
                <ScrollText className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <span className="flex-1 text-gray-600 group-hover:text-gray-900">
                  {doc.title}
                </span>
                <span className="text-xs text-gray-400 group-hover:text-gray-600 shrink-0 mt-0.5 flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {getDownloadLabel(doc.file_name)}
                </span>
              </a>
              
              {/* Annexes */}
              {doc.annexes.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-100/50 px-4 py-2 rounded-b-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">
                      {labels.annexes} ({doc.annexes.length})
                    </span>
                  </div>
                  <div className="space-y-1 ml-6">
                    {doc.annexes.map((annex) => (
                      <a
                        key={annex.id}
                        href={annex.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 py-1.5 px-2 rounded text-sm hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors group"
                      >
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{annex.title}</span>
                        <span className="text-xs text-gray-400 group-hover:text-current flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {getDownloadLabel(annex.file_name)}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
