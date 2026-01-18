'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Megaphone,
  Loader2,
  Calendar,
  FileText,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';
import { cn } from '@/lib/utils/cn';

interface AnnouncementDocument {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
}

interface Announcement {
  id: string;
  date: string;
  title: string;
  documents: AnnouncementDocument[];
}

export default function AnunturiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteAnnouncement, setDeleteAnnouncement] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/documents?category=anunturi&limit=500');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      const docs = result.data || [];
      
      // Group documents by description + date
      const groupedMap = new Map<string, Announcement>();
      
      docs.forEach((doc: { id: string; title: string; description: string; document_date: string; file_url: string; file_name: string }) => {
        const key = `${doc.description || doc.title}_${doc.document_date || ''}`;
        
        if (!groupedMap.has(key)) {
          groupedMap.set(key, {
            id: doc.id,
            date: doc.document_date || '',
            title: doc.description || doc.title,
            documents: [],
          });
        }
        
        groupedMap.get(key)!.documents.push({
          id: doc.id,
          title: doc.title,
          file_url: doc.file_url,
          file_name: doc.file_name,
        });
      });
      
      // Sort by date descending
      const sorted = Array.from(groupedMap.values()).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setAnnouncements(sorted);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Eroare', 'Nu s-au putut încărca anunțurile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleDelete = async () => {
    if (!deleteAnnouncement) return;
    
    setDeleting(true);
    try {
      // Delete all documents in this announcement
      for (const doc of deleteAnnouncement.documents) {
        await adminFetch(`/api/admin/documents?id=${doc.id}`, {
          method: 'DELETE',
        });
      }
      
      toast.success('Succes', 'Anunțul a fost șters');
      setDeleteAnnouncement(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Eroare', 'Nu s-a putut șterge anunțul');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="Anunțuri"
          description="Gestionează anunțurile publice"
          breadcrumbs={[
            { label: 'Informații Publice' },
            { label: 'Anunțuri' },
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
        title="Anunțuri"
        description="Gestionează anunțurile publice"
        breadcrumbs={[
          { label: 'Informații Publice' },
          { label: 'Anunțuri' },
        ]}
        actions={
          <AdminButton
            icon={Plus}
            onClick={() => router.push('/admin/informatii-publice/anunturi/nou')}
          >
            Adaugă Anunț
          </AdminButton>
        }
      />

      <AdminCard>
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Nu există anunțuri</p>
            <AdminButton
              icon={Plus}
              onClick={() => router.push('/admin/informatii-publice/anunturi/nou')}
            >
              Adaugă Primul Anunț
            </AdminButton>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="py-4">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5 text-primary-600" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate max-w-xl" title={announcement.title}>
                      {announcement.title.length > 100 ? `${announcement.title.substring(0, 100)}...` : announcement.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(announcement.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {announcement.documents.length} {announcement.documents.length === 1 ? 'document' : 'documente'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedId(expandedId === announcement.id ? null : announcement.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      {expandedId === announcement.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      icon={Edit}
                      onClick={() => router.push(`/admin/informatii-publice/anunturi/${announcement.id}`)}
                    >
                      Editează
                    </AdminButton>
                    <button
                      onClick={() => setDeleteAnnouncement(announcement)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Expanded documents list */}
                {expandedId === announcement.id && (
                  <div className="mt-4 ml-14 space-y-2">
                    {announcement.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={doc.title}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border border-gray-200',
                          'hover:bg-gray-50 hover:border-primary-300 transition-colors'
                        )}
                      >
                        <FileText className="w-5 h-5 text-primary-600 shrink-0" />
                        <span className="text-sm text-gray-700 truncate max-w-md">
                          {doc.title.length > 80 ? `${doc.title.substring(0, 80)}...` : doc.title}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto shrink-0">
                          {doc.file_name.split('.').pop()?.toUpperCase()}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      <AdminConfirmDialog
        isOpen={!!deleteAnnouncement}
        onClose={() => setDeleteAnnouncement(null)}
        onConfirm={handleDelete}
        title="Șterge Anunț"
        message={`Ești sigur că vrei să ștergi anunțul "${deleteAnnouncement?.title}"? Toate documentele atașate vor fi șterse.`}
        confirmLabel="Șterge"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
