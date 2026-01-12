'use client';

import { useEffect, useState, useCallback } from 'react';
import { Calendar, Mail, Phone, User, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminPagination,
  AdminStatusBadge,
  AdminButton,
  toast,
} from '@/components/admin';

// Interfață conform structurii din baza de date (DATABASE_STRUCTURE.md)
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  ip_address: string | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const STATUS_LABELS: Record<string, string> = {
  new: 'Nou',
  read: 'Citit',
  replied: 'Răspuns',
  archived: 'Arhivat',
};

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setMessages(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Eroare', 'Nu s-au putut încărca mesajele.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const updateStatus = async (message: ContactMessage, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', message.id);
      
      if (error) throw error;
      
      toast.success('Status actualizat', `Mesajul a fost marcat ca "${STATUS_LABELS[newStatus]}"`);
      loadMessages();
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Eroare', 'Nu s-a putut actualiza statusul.');
    }
  };

  const handleView = (item: ContactMessage) => {
    setSelectedMessage(item);
    if (item.status === 'new') {
      updateStatus(item, 'read');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Expeditor',
      render: (item: ContactMessage) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{item.name}</p>
            <p className="text-sm text-slate-500">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subiect',
      render: (item: ContactMessage) => (
        <div>
          <p className="font-medium text-slate-900 line-clamp-1">{item.subject}</p>
          <p className="text-sm text-slate-500 line-clamp-1">{item.message}</p>
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Data',
      className: 'w-40',
      render: (item: ContactMessage) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          {formatDate(item.created_at)}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-32',
      render: (item: ContactMessage) => {
        const statusMap: Record<string, 'pending' | 'active' | 'completed' | 'cancelled'> = {
          new: 'pending',
          read: 'active',
          replied: 'completed',
          archived: 'cancelled',
        };
        return (
          <div>
            <AdminStatusBadge status={statusMap[item.status] || 'pending'} />
            <p className="text-xs text-slate-500 mt-1">{STATUS_LABELS[item.status]}</p>
          </div>
        );
      },
    },
  ];

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <AdminPageHeader
        title="Mesaje Contact"
        description="Vizualizează mesajele primite prin formularul de contact"
        breadcrumbs={[
          { label: 'Mesaje Primite' },
          { label: 'Mesaje Contact' },
        ]}
      />

      <AdminTable
        data={messages}
        columns={columns}
        loading={loading}
        onView={handleView}
        emptyMessage="Nu există mesaje de contact."
      />

      {totalPages > 1 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedMessage.name}</h3>
                  <p className="text-slate-500">{selectedMessage.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium">{selectedMessage.email}</p>
                  </div>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Phone className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Telefon</p>
                      <p className="font-medium">{selectedMessage.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg col-span-2">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-500">Data primirii</p>
                    <p className="font-medium">{formatDate(selectedMessage.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Subiect</h4>
                <p className="text-lg text-slate-700">{selectedMessage.subject}</p>
              </div>

              {/* Message */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Mesaj</h4>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="whitespace-pre-wrap text-slate-700">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Actualizează Status</h4>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'read', 'replied', 'archived'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateStatus(selectedMessage, status);
                        setSelectedMessage({ ...selectedMessage, status });
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedMessage.status === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <AdminButton
                  variant="secondary"
                  onClick={() => setSelectedMessage(null)}
                >
                  Închide
                </AdminButton>
                <AdminButton
                  icon={Mail}
                  onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`, '_blank')}
                >
                  Răspunde prin Email
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
