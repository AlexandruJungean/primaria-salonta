'use client';

import { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ImageGallery } from '@/components/ui/image-gallery';

interface UpdateImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

interface ProjectUpdate {
  id: string;
  update_date: string;
  month_label: string;
  content: string | null;
  progress_percentage: number | null;
  images?: UpdateImage[];
}

interface ProjectUpdatesAccordionProps {
  updates: ProjectUpdate[];
  title: string;
}

export function ProjectUpdatesAccordion({ updates, title }: ProjectUpdatesAccordionProps) {
  const [expandedUpdates, setExpandedUpdates] = useState<Set<string>>(new Set([updates[0]?.id])); // First one open by default

  const toggleUpdate = (id: string) => {
    setExpandedUpdates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (!updates || updates.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {updates.map((update) => {
            const isExpanded = expandedUpdates.has(update.id);
            const hasImages = update.images && update.images.length > 0;
            
            return (
              <div 
                key={update.id} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Header - Clickable */}
                <button
                  onClick={() => toggleUpdate(update.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="font-semibold text-gray-900">{update.month_label}</span>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "w-5 h-5 text-gray-500 transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {/* Content - Expandable */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {/* Content text */}
                    {update.content && (
                      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                        {update.content.split('\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-3 last:mb-0">{paragraph}</p>
                        ))}
                      </div>
                    )}

                    {/* Images */}
                    {hasImages && (
                      <div className="mt-4">
                        <ImageGallery 
                          images={update.images!.map(img => ({
                            id: img.id,
                            image_url: img.image_url,
                            alt_text: img.alt_text,
                            caption: null
                          }))} 
                          columns={3} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
