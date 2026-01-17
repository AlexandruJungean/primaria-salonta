'use client';

import { ArrowRight, Euro, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import type { Program } from '@/lib/supabase/services/programs';

interface ProgramChildrenListProps {
  children: Program[];
  viewDetailsLabel: string;
  parentSlug: string;
}

export function ProgramChildrenList({ 
  children, 
  viewDetailsLabel,
  parentSlug 
}: ProgramChildrenListProps) {
  return (
    <div className="space-y-3">
      {children.map((child) => (
        <Link key={child.id} href={`/programe/${child.slug}`}>
          <Card className="hover:shadow-lg transition-all hover:border-primary-200 cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                  {child.program_type === 'program-regional' || child.program_type === 'proiecte-europene' ? (
                    <Euro className="w-6 h-6 text-primary-700" />
                  ) : (
                    <Building2 className="w-6 h-6 text-primary-700" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {child.smis_code && (
                    <span className="text-xs font-mono text-gray-500 mb-1 block">
                      SMIS {child.smis_code}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {child.title}
                  </h3>
                  {child.short_description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {child.short_description}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 shrink-0 mt-2" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
