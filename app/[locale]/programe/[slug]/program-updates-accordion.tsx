'use client';

import { useState } from 'react';
import { ChevronDown, Calendar, ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import type { ProgramUpdate } from '@/lib/supabase/services/programs';

interface ProgramUpdatesAccordionProps {
  updates: ProgramUpdate[];
  title: string;
}

export function ProgramUpdatesAccordion({ updates, title }: ProgramUpdatesAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary-600" />
        {title}
      </h2>
      <div className="space-y-2">
        {updates.map((update, index) => (
          <Card key={update.id} className="overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{update.title}</h3>
                  <p className="text-sm text-gray-500">{formatDate(update.update_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {update.images && update.images.length > 0 && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {update.images.length}
                  </span>
                )}
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </button>
            
            {openIndex === index && (
              <CardContent className="pt-0 pb-4 px-4 border-t bg-gray-50">
                {update.content && (
                  <div 
                    className="prose prose-sm max-w-none mb-4"
                    dangerouslySetInnerHTML={{ __html: update.content.replace(/\n/g, '<br />') }}
                  />
                )}
                
                {update.images && update.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {update.images.map((image) => (
                      <a
                        key={image.id}
                        href={image.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-video relative rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all"
                      >
                        <Image
                          src={image.image_url}
                          alt={image.alt_text || image.caption || 'Imagine update'}
                          fill
                          className="object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
