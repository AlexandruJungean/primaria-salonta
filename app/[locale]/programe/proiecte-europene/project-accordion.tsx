'use client';

import { useState } from 'react';
import { Download, Euro, Globe, Facebook, Instagram, ExternalLink, ChevronDown, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  title: string;
  file_url: string;
  file_name?: string;
}

interface Project {
  id: string;
  slug: string;
  project_code: string | null;
  title: string;
  description: string | null;
  status: string;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  program_url: string | null;
  documents: Document[];
  statusColor: string;
  statusLabel: string;
}

interface ProjectAccordionProps {
  projects: Project[];
  showDocsLabel: string;
}

export function ProjectAccordion({ projects, showDocsLabel }: ProjectAccordionProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const getFileExtension = (url: string) => {
    const ext = url.split('.').pop()?.toUpperCase() || 'FILE';
    return ext.length > 4 ? 'FILE' : ext;
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const isExpanded = expandedProjects.has(project.id);
        const hasDocuments = project.documents.length > 0;
        const hasLinks = project.website_url || project.facebook_url || project.instagram_url || project.program_url;

        return (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader 
              className={cn(
                "pb-3 cursor-pointer transition-colors",
                hasDocuments && "hover:bg-gray-50"
              )}
              onClick={() => hasDocuments && toggleProject(project.id)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                  <Euro className="w-6 h-6 text-primary-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${project.statusColor}`}>
                      {project.statusLabel}
                    </span>
                    {project.project_code && (
                      <span className="text-xs font-mono text-gray-500">
                        {project.project_code}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base font-semibold text-gray-900 leading-snug">
                    {project.title}
                  </CardTitle>
                  
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                  )}

                  {/* External links */}
                  {hasLinks && (
                    <div className="flex flex-wrap gap-3 mt-3" onClick={e => e.stopPropagation()}>
                      {project.website_url && (
                        <a
                          href={project.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                        </a>
                      )}
                      {project.facebook_url && (
                        <a
                          href={project.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </a>
                      )}
                      {project.instagram_url && (
                        <a
                          href={project.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-pink-600 hover:text-pink-800"
                        >
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </a>
                      )}
                      {project.program_url && (
                        <a
                          href={project.program_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Program
                        </a>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Expand button */}
                {hasDocuments && (
                  <button
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProject(project.id);
                    }}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">{project.documents.length}</span>
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )} 
                    />
                  </button>
                )}
              </div>
            </CardHeader>
            
            {/* Collapsible Documents Section */}
            {hasDocuments && (
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <CardContent className="pt-0 border-t bg-gray-50">
                  <div className="py-4 space-y-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Documente asociate ({project.documents.length})
                    </div>
                    {project.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors group"
                      >
                        <div className="w-8 h-8 rounded bg-primary-100 flex items-center justify-center shrink-0">
                          <Download className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="flex-1 text-sm text-gray-700 group-hover:text-primary-600">
                          {doc.title}
                        </span>
                        <span className="text-xs font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded">
                          {getFileExtension(doc.file_url)}
                        </span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
