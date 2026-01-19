'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Network,
  Loader2,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
  AlertCircle,
  Save,
  Info,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  AdminInput,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface SeipSection {
  id: string;
  page_key: string;
  content_key: string;
  content: string;
  sort_order: number;
  is_active: boolean;
  parsed?: {
    title: string;
    legalRef?: string;
    penalty?: string;
    description?: string;
    docs: string[];
    notes: string[];
  };
}

interface ContentItem {
  id: string;
  content_key: string;
  content: string;
}

interface Department {
  id: string;
  label: string;
  prefix: string;
  icon: React.ReactNode;
  sections: SeipSection[];
}

const DEPARTMENTS = [
  { 
    id: 'evidenta', 
    label: 'Compartimentul de Evidență', 
    prefix: 'evidenta_',
    description: 'Acte de identitate și evidența populației',
    icon: <Users className="w-5 h-5 text-blue-600" />,
    bgColor: 'bg-blue-100',
  },
  { 
    id: 'stare-civila', 
    label: 'Compartimentul de Stare Civilă', 
    prefix: 'stare-civila_',
    description: 'Certificate de naștere, căsătorie, deces',
    icon: <FileText className="w-5 h-5 text-emerald-600" />,
    bgColor: 'bg-emerald-100',
  },
];

const PAGE_KEY = 'seip';

export default function SeipAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [expandedDept, setExpandedDept] = useState<string | null>('evidenta');
  const [deleteSection, setDeleteSection] = useState<SeipSection | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Intro card state
  const [introExpanded, setIntroExpanded] = useState(false);
  const [introTitle, setIntroTitle] = useState('');
  const [introDescription, setIntroDescription] = useState('');
  const [introLocation, setIntroLocation] = useState('');
  const [introIds, setIntroIds] = useState<{ title?: string; description?: string; location?: string }>({});
  const [savingIntro, setSavingIntro] = useState(false);

  const fetchSections = useCallback(async () => {
    try {
      const response = await adminFetch(`/api/admin/page-content?page_key=${PAGE_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data: (SeipSection | ContentItem)[] = await response.json();
      
      // Extract intro content
      const introTitleItem = data.find(item => item.content_key === 'intro_title');
      const introDescItem = data.find(item => item.content_key === 'intro_description');
      const introLocItem = data.find(item => item.content_key === 'intro_location');
      
      setIntroTitle((introTitleItem as ContentItem)?.content || '');
      setIntroDescription((introDescItem as ContentItem)?.content || '');
      setIntroLocation((introLocItem as ContentItem)?.content || '');
      setIntroIds({
        title: (introTitleItem as ContentItem)?.id,
        description: (introDescItem as ContentItem)?.id,
        location: (introLocItem as ContentItem)?.id,
      });
      
      // Parse content and group by department
      const depts: Department[] = DEPARTMENTS.map(dept => {
        const sections = (data as SeipSection[])
          .filter(item => item.content_key.startsWith(dept.prefix))
          .map(item => {
            let parsed;
            try {
              parsed = JSON.parse(item.content);
            } catch {
              parsed = { title: 'Eroare parsing', docs: [], notes: [] };
            }
            return { ...item, parsed };
          })
          .sort((a, b) => a.sort_order - b.sort_order);
        
        return {
          id: dept.id,
          label: dept.label,
          prefix: dept.prefix,
          icon: dept.icon,
          sections,
        };
      });
      
      setDepartments(depts);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Eroare', 'Nu s-au putut încărca secțiunile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Save or create intro content
  const saveIntroField = async (key: string, value: string, existingId?: string) => {
    if (existingId) {
      await adminFetch(`/api/admin/page-content?id=${existingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: value }),
      });
    } else {
      await adminFetch('/api/admin/page-content', {
        method: 'POST',
        body: JSON.stringify({
          page_key: PAGE_KEY,
          content_key: key,
          content: value,
          content_type: 'text',
          sort_order: 0,
        }),
      });
    }
  };

  const handleSaveIntro = async () => {
    setSavingIntro(true);
    try {
      await Promise.all([
        saveIntroField('intro_title', introTitle, introIds.title),
        saveIntroField('intro_description', introDescription, introIds.description),
        saveIntroField('intro_location', introLocation, introIds.location),
      ]);
      
      toast.success('Succes', 'Cardul intro a fost actualizat');
      fetchSections(); // Refresh to get new IDs if created
    } catch (error) {
      console.error('Error saving intro:', error);
      toast.error('Eroare', 'Nu s-a putut salva');
    } finally {
      setSavingIntro(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteSection) return;
    
    setDeleting(true);
    try {
      await adminFetch(`/api/admin/page-content?id=${deleteSection.id}`, {
        method: 'DELETE',
      });
      
      toast.success('Succes', 'Secțiunea a fost ștearsă');
      setDeleteSection(null);
      fetchSections();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge secțiunea');
    } finally {
      setDeleting(false);
    }
  };

  const totalSections = departments.reduce((acc, d) => acc + d.sections.length, 0);

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="SEIP"
          description="Gestionează secțiunile SEIP"
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'SEIP' },
          ]}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="SEIP"
        description={`${totalSections} secțiuni în ${departments.length} compartimente`}
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'SEIP' },
        ]}
        actions={
          <AdminButton
            icon={Plus}
            onClick={() => router.push('/admin/informatii-publice/seip/nou')}
          >
            Adaugă Secțiune
          </AdminButton>
        }
      />

      {/* Intro Card Editor */}
      <AdminCard className="mb-6 overflow-hidden">
        <button
          onClick={() => setIntroExpanded(!introExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Card Introductiv</h3>
              <p className="text-sm text-gray-500">Titlu, descriere și locație formularelor</p>
            </div>
          </div>
          {introExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {introExpanded && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            <AdminInput
              label="Titlu"
              value={introTitle}
              onChange={(e) => setIntroTitle(e.target.value)}
              placeholder="Serviciul Public Comunitar de Evidență Informatizată a Persoanei"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descriere</label>
              <textarea
                value={introDescription}
                onChange={(e) => setIntroDescription(e.target.value)}
                rows={3}
                placeholder="A fost înființat prin HCL nr.6/2005..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Locație formulare</label>
              <textarea
                value={introLocation}
                onChange={(e) => setIntroLocation(e.target.value)}
                rows={2}
                placeholder="Formularele și lista documentelor necesare..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end">
              <AdminButton
                icon={Save}
                onClick={handleSaveIntro}
                loading={savingIntro}
              >
                Salvează
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Network className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Compartimente și Secțiuni</p>
            <p className="text-blue-700">
              Mai jos poți gestiona secțiunile pentru cele 2 compartimente: Evidență și Stare Civilă.
            </p>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="space-y-4">
        {departments.map((dept) => {
          const deptConfig = DEPARTMENTS.find(d => d.id === dept.id);
          
          return (
            <AdminCard key={dept.id} className="overflow-hidden">
              {/* Department Header */}
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <button
                  onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  <div className={`w-12 h-12 rounded-lg ${deptConfig?.bgColor || 'bg-gray-100'} flex items-center justify-center`}>
                    {dept.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{dept.label}</h3>
                    <p className="text-sm text-gray-500">
                      {dept.sections.length} {dept.sections.length === 1 ? 'secțiune' : 'secțiuni'}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <AdminButton
                    size="sm"
                    variant="secondary"
                    icon={Plus}
                    onClick={() => router.push(`/admin/informatii-publice/seip/nou?dept=${dept.id}`)}
                  >
                    Adaugă
                  </AdminButton>
                  <button
                    onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    {expandedDept === dept.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sections List */}
              {expandedDept === dept.id && (
                <div className="border-t border-gray-200 divide-y divide-gray-100">
                  {dept.sections.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nu există secțiuni în acest compartiment</p>
                    </div>
                  ) : (
                    dept.sections.map((section) => (
                      <div key={section.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">
                              {section.parsed?.title || 'Fără titlu'}
                            </p>
                            {section.parsed?.legalRef && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {section.parsed.legalRef}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              {section.parsed?.penalty && (
                                <span className="flex items-center gap-1 text-amber-600">
                                  <AlertCircle className="w-3 h-3" />
                                  Sancțiune
                                </span>
                              )}
                              <span>{section.parsed?.docs.length || 0} acte necesare</span>
                              {(section.parsed?.notes.length || 0) > 0 && (
                                <span>{section.parsed?.notes.length} note</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <AdminButton
                              variant="secondary"
                              size="sm"
                              icon={Edit}
                              onClick={() => router.push(`/admin/informatii-publice/seip/${section.id}`)}
                            >
                              Editează
                            </AdminButton>
                            <button
                              onClick={() => setDeleteSection(section)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              title="Șterge"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </AdminCard>
          );
        })}
      </div>

      {/* Delete confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteSection}
        onClose={() => setDeleteSection(null)}
        onConfirm={handleDelete}
        title="Șterge Secțiune"
        message={`Ești sigur că vrei să ștergi secțiunea "${deleteSection?.parsed?.title}"?`}
        confirmLabel="Șterge"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
