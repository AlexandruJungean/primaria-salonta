'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Save, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  toast,
} from '@/components/admin';

interface StaffMember {
  id: string;
  name: string;
  position_type: string;
  reception_hours: string | null;
  is_active: boolean;
  sort_order: number;
}

const POSITION_LABELS: Record<string, string> = {
  primar: 'Primar',
  viceprimar: 'Viceprimar',
  secretar: 'Secretar General',
  administrator: 'Administrator Public',
};

export default function AudientePage() {
  const [leadership, setLeadership] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedHours, setEditedHours] = useState<Record<string, string>>({});

  const loadLeadership = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select('id, name, position_type, reception_hours, is_active, sort_order')
        .in('position_type', ['primar', 'viceprimar', 'secretar', 'administrator'])
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      setLeadership(data || []);
      
      // Initialize edited hours with current values
      const hours: Record<string, string> = {};
      data?.forEach(member => {
        hours[member.id] = member.reception_hours || '';
      });
      setEditedHours(hours);
    } catch (error) {
      console.error('Error loading leadership:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele conducerii.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeadership();
  }, [loadLeadership]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update each member's reception hours
      for (const member of leadership) {
        const newHours = editedHours[member.id];
        if (newHours !== member.reception_hours) {
          const { error } = await supabase
            .from('staff_members')
            .update({ reception_hours: newHours || null })
            .eq('id', member.id);
          
          if (error) throw error;
        }
      }
      
      toast.success('Salvat', 'Programul de audiențe a fost actualizat.');
      loadLeadership();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Eroare', 'Nu s-a putut salva programul de audiențe.');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = leadership.some(
    member => editedHours[member.id] !== (member.reception_hours || '')
  );

  return (
    <div>
      <AdminPageHeader
        title="Program Audiențe"
        description="Gestionează programul de audiențe al conducerii primăriei"
        breadcrumbs={[
          { label: 'Primăria', href: '/admin/primaria' },
          { label: 'Audiențe' },
        ]}
        actions={
          <AdminButton 
            icon={Save} 
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            {saving ? 'Se salvează...' : 'Salvează Modificările'}
          </AdminButton>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : leadership.length === 0 ? (
        <AdminCard>
          <div className="text-center py-12 text-slate-500">
            <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p>Nu există membri în conducere. Adaugă mai întâi membrii din pagina Conducere.</p>
          </div>
        </AdminCard>
      ) : (
        <div className="space-y-4">
          {leadership.map((member) => (
            <AdminCard key={member.id}>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {POSITION_LABELS[member.position_type] || member.position_type}
                  </h3>
                  <p className="text-slate-600 mb-4">{member.name}</p>
                  
                  <div className="max-w-md">
                    <AdminInput
                      label="Program Audiențe"
                      placeholder="Ex: Marți: 10:00 - 12:00, Joi: 14:00 - 16:00"
                      value={editedHours[member.id] || ''}
                      onChange={(e) => setEditedHours(prev => ({
                        ...prev,
                        [member.id]: e.target.value,
                      }))}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Introdu zilele și orele pentru programul de audiențe
                    </p>
                  </div>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Info Box */}
      <AdminCard className="mt-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Despre Programul de Audiențe</h3>
            <p className="text-blue-800 mt-1">
              Programul de audiențe configurat aici va fi afișat pe pagina publică de audiențe 
              de pe website. Cetățenii pot consulta acest program pentru a ști când se pot înscrie la audiențe.
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
