'use client';

import { useEffect, useState, useCallback } from 'react';
import { Calendar, Mail, Phone, MapPin, User, Eye, FileText } from 'lucide-react';
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

// Interfață conform structurii din baza de date
interface Petition {
  id: string;
  registration_number: string | null;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  subject: string;
  content: string;
  status: 'inregistrata' | 'in_lucru' | 'solutionata' | 'respinsa';
  response: string | null;
  responded_at: string | null;
  deadline: string | null;
  ip_address: string | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const STATUS_LABELS: Record<string, string> = {
  inregistrata: 'Înregistrată',
  in_lucru: 'În lucru',
  solutionata: 'Rezolvată',
  respinsa: 'Respinsă',
};

export default function PetitiiPage() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPetition, setSelectedPetition] = useState<Petition | null>(null);

  const loadPetitions = useCallback(async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await supabase
        .from('petitions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setPetitions(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading petitions:', error);
      toast.error('Eroare', 'Nu s-au putut încărca petițiile.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadPetitions();
  }, [loadPetitions]);

  const updateStatus = async (petition: Petition, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('petitions')
        .update({ status: newStatus })
        .eq('id', petition.id);
      
      if (error) throw error;
      
      toast.success('Status actualizat', `Petiția a fost marcată ca "${STATUS_LABELS[newStatus]}"`);
      loadPetitions();
    } catch (error) {
      console.error('Error updating petition:', error);
      toast.error('Eroare', 'Nu s-a putut actualiza statusul.');
    }
  };

  const handleView = (item: Petition) => {
    setSelectedPetition(item);
    // Marchează ca "în lucru" dacă e înregistrată
    if (item.status === 'inregistrata') {
      updateStatus(item, 'in_lucru');
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
      label: 'Solicitant',
      render: (item: Petition) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{item.name || 'Necunoscut'}</p>
            <p className="text-sm text-slate-500">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subiect',
      render: (item: Petition) => (
        <div>
          <p className="font-medium text-slate-900 line-clamp-1">{item.subject}</p>
          <p className="text-sm text-slate-500 line-clamp-1">{item.content?.substring(0, 80)}...</p>
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Data',
      className: 'w-40',
      render: (item: Petition) => (
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
      render: (item: Petition) => {
        const statusMap: Record<string, 'pending' | 'in_progress' | 'completed' | 'cancelled'> = {
          inregistrata: 'pending',
          in_lucru: 'in_progress',
          solutionata: 'completed',
          respinsa: 'cancelled',
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
        title="Petiții Online"
        description={`${totalCount} petiții primite prin formularul online`}
        breadcrumbs={[
          { label: 'Mesaje Primite' },
          { label: 'Petiții Online' },
        ]}
      />

      <AdminTable
        data={petitions}
        columns={columns}
        loading={loading}
        onView={handleView}
        emptyMessage="Nu există petiții primite."
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
      {selectedPetition && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedPetition.subject}</h3>
                  <p className="text-slate-500">de la {selectedPetition.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPetition(null)}
                className="p-2 hover:bg-slate-100 rounded-lg text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <User className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-500">Nume</p>
                    <p className="font-medium">{selectedPetition.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium">{selectedPetition.email}</p>
                  </div>
                </div>
                {selectedPetition.phone && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Phone className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Telefon</p>
                      <p className="font-medium">{selectedPetition.phone}</p>
                    </div>
                  </div>
                )}
                {selectedPetition.address && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Adresă</p>
                      <p className="font-medium">{selectedPetition.address}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-500">Data primirii</p>
                    <p className="font-medium">{formatDate(selectedPetition.created_at)}</p>
                  </div>
                </div>
                {selectedPetition.registration_number && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600">Nr. Înregistrare</p>
                      <p className="font-medium text-blue-900">{selectedPetition.registration_number}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Conținut Petiție</h4>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="whitespace-pre-wrap text-slate-700">{selectedPetition.content}</p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Actualizează Status</h4>
                <div className="flex flex-wrap gap-2">
                  {(['inregistrata', 'in_lucru', 'solutionata', 'respinsa'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateStatus(selectedPetition, status);
                        setSelectedPetition({ ...selectedPetition, status });
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedPetition.status === status
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
                  onClick={() => setSelectedPetition(null)}
                >
                  Închide
                </AdminButton>
                <AdminButton
                  icon={Mail}
                  onClick={() => window.open(`mailto:${selectedPetition.email}?subject=Re: ${encodeURIComponent(selectedPetition.subject)}`, '_blank')}
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
