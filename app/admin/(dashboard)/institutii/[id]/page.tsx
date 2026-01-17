'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Save, ArrowLeft, Trash2, Plus, X, Upload, GripVertical,
  Image as ImageIcon, Type, AlignLeft, List, Phone, Mail, User,
  Clock, MapPin, Globe, Facebook, Building, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

// Types
interface ContentSection {
  id: string;
  type: 'heading' | 'text' | 'image' | 'list';
  title?: string;
  content?: string;
  image_url?: string;
  caption?: string;
  items?: Array<{ text: string }>;
}

interface ContactPerson {
  id: string;
  name: string;
  role?: string;
  phone?: string;
  email?: string;
}

interface InfoCard {
  id: string;
  icon: string;
  label?: string;
  value: string;
}

interface InstitutionFormData {
  name: string;
  slug: string;
  category: string;
  short_description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  facebook: string;
  working_hours: string;
  director_name: string;
  director_title: string;
  fiscal_code: string;
  icon: string;
  image_url: string;
  published: boolean;
  show_in_citizens: boolean;
  show_in_tourists: boolean;
  display_order: number;
  content: ContentSection[];
  contacts: ContactPerson[];
  info_cards: InfoCard[];
}

const initialFormData: InstitutionFormData = {
  name: '',
  slug: '',
  category: 'institutii',
  short_description: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  facebook: '',
  working_hours: '',
  director_name: '',
  director_title: 'Manager',
  fiscal_code: '',
  icon: 'building',
  image_url: '',
  published: true,
  show_in_citizens: true,
  show_in_tourists: false,
  display_order: 0,
  content: [],
  contacts: [],
  info_cards: [],
};

const CATEGORIES = [
  { value: 'institutii', label: 'Instituții Subordonate' },
  { value: 'educatie', label: 'Educație' },
  { value: 'sanatate', label: 'Sănătate' },
  { value: 'sport', label: 'Sport' },
  { value: 'cultura', label: 'Cultură' },
  { value: 'social', label: 'Social' },
  { value: 'altele', label: 'Altele' },
];

const ICONS = [
  { value: 'building', label: 'Clădire' },
  { value: 'bookOpen', label: 'Carte (Educație)' },
  { value: 'heart', label: 'Inimă (Sănătate)' },
  { value: 'landmark', label: 'Monument (Cultură)' },
  { value: 'users', label: 'Persoane (Social)' },
  { value: 'waves', label: 'Apă' },
  { value: 'leaf', label: 'Natură' },
];

const INFO_CARD_ICONS = [
  { value: 'mapPin', label: 'Locație' },
  { value: 'phone', label: 'Telefon' },
  { value: 'mail', label: 'Email' },
  { value: 'globe', label: 'Website' },
  { value: 'clock', label: 'Program' },
  { value: 'user', label: 'Persoană' },
  { value: 'building', label: 'Clădire' },
];

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export default function InstitutieEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const primaryImageRef = useRef<HTMLInputElement>(null);
  const sectionImageRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<InstitutionFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingSectionImage, setUploadingSectionImage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof InstitutionFormData, string>>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const loadInstitution = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/institutions?id=${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load');
      }
      const data = await response.json();

      if (data) {
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          category: data.category || 'institutii',
          short_description: data.short_description || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          facebook: data.facebook || '',
          working_hours: data.working_hours || '',
          director_name: data.director_name || '',
          director_title: data.director_title || 'Manager',
          fiscal_code: data.fiscal_code || '',
          icon: data.icon || 'building',
          image_url: data.image_url || '',
          published: data.published ?? true,
          show_in_citizens: data.show_in_citizens ?? true,
          show_in_tourists: data.show_in_tourists ?? false,
          display_order: data.display_order || data.sort_order || 0,
          content: (data.content || []).map((s: ContentSection) => ({ ...s, id: s.id || generateId() })),
          contacts: (data.contacts || []).map((c: ContactPerson) => ({ ...c, id: (c as ContactPerson).id || generateId() })),
          info_cards: (data.info_cards || []).map((ic: InfoCard) => ({ ...ic, id: (ic as InfoCard).id || generateId() })),
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Nu s-au putut încărca datele';
      console.error('Error loading institution:', error);
      toast.error('Eroare', errorMessage);
      router.push('/admin/institutii');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadInstitution();
  }, [loadInstitution]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 100);
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, name: value, slug: isNew ? generateSlug(value) : prev.slug }));
  };

  const handleChange = (field: keyof InstitutionFormData, value: string | boolean | number | ContentSection[] | ContactPerson[] | InfoCard[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InstitutionFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Numele este obligatoriu';
    if (!formData.slug.trim()) newErrors.slug = 'Slug-ul este obligatoriu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Verifică formularul', 'Completează câmpurile obligatorii.');
      return;
    }

    setSaving(true);
    try {
      const institutionData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        category: formData.category,
        short_description: formData.short_description.trim() || null,
        address: formData.address.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        website: formData.website.trim() || null,
        facebook: formData.facebook.trim() || null,
        working_hours: formData.working_hours.trim() || null,
        director_name: formData.director_name.trim() || null,
        director_title: formData.director_title.trim() || null,
        fiscal_code: formData.fiscal_code.trim() || null,
        icon: formData.icon,
        image_url: formData.image_url || null,
        published: formData.published,
        show_in_citizens: formData.show_in_citizens,
        show_in_tourists: formData.show_in_tourists,
        display_order: formData.display_order,
        content: formData.content,
        contacts: formData.contacts,
        info_cards: formData.info_cards,
      };

      let response: Response;
      if (isNew) {
        response = await adminFetch('/api/admin/institutions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(institutionData),
        });
      } else {
        response = await adminFetch(`/api/admin/institutions?id=${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(institutionData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      await response.json();
      toast.success(isNew ? 'Instituție adăugată' : 'Date salvate', 'Datele au fost salvate!');
      
      // Redirect to list page after save
      router.push('/admin/institutii');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Nu s-au putut salva datele';
      console.error('Error saving institution:', error);
      toast.error('Eroare la salvare', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/institutions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete');
      }

      toast.success('Șters', 'Instituția a fost ștearsă.');
      router.push('/admin/institutii');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Nu s-a putut șterge';
      console.error('Error deleting:', error);
      toast.error('Eroare', errorMessage);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Primary Image Upload
  const handleUploadPrimaryImage = async (file: File) => {
    if (isNew) {
      toast.error('Eroare', 'Salvează instituția înainte de a încărca imagini.');
      return;
    }

    setUploadingPrimary(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('institution_id', id);
      uploadFormData.append('is_primary', 'true');

      const response = await adminFetch('/api/admin/institutions/images', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      setFormData(prev => ({ ...prev, image_url: result.url }));
      toast.success('Imagine încărcată', 'Imaginea principală a fost actualizată.');
    } catch (error) {
      console.error('Error uploading primary image:', error);
      toast.error('Eroare', 'Nu s-a putut încărca imaginea.');
    } finally {
      setUploadingPrimary(false);
    }
  };

  const handleDeletePrimaryImage = async () => {
    try {
      const response = await adminFetch(
        `/api/admin/institutions/images?isPrimary=true&institutionId=${id}&imageUrl=${encodeURIComponent(formData.image_url)}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Delete failed');
      
      setFormData(prev => ({ ...prev, image_url: '' }));
      toast.success('Șters', 'Imaginea principală a fost ștearsă.');
    } catch (error) {
      console.error('Error deleting primary image:', error);
      toast.error('Eroare', 'Nu s-a putut șterge imaginea.');
    }
  };

  // Content Sections Management
  const addSection = (type: ContentSection['type']) => {
    const newSection: ContentSection = {
      id: generateId(),
      type,
      title: '',
      content: type === 'text' ? '' : undefined,
      image_url: type === 'image' ? '' : undefined,
      items: type === 'list' ? [{ text: '' }] : undefined,
    };
    setFormData(prev => ({ ...prev, content: [...prev.content, newSection] }));
    setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
  };

  const updateSection = (sectionId: string, updates: Partial<ContentSection>) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.map(s => s.id === sectionId ? { ...s, ...updates } : s),
    }));
  };

  const removeSection = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter(s => s.id !== sectionId),
    }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.content.length) return;
    
    const newContent = [...formData.content];
    [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const handleUploadSectionImage = async (sectionId: string, file: File) => {
    if (isNew) {
      toast.error('Eroare', 'Salvează instituția înainte de a încărca imagini.');
      return;
    }

    setUploadingSectionImage(sectionId);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('institution_id', id);

      const response = await adminFetch('/api/admin/institutions/images', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      updateSection(sectionId, { image_url: result.url });
      toast.success('Imagine încărcată', 'Imaginea a fost adăugată în secțiune.');
    } catch (error) {
      console.error('Error uploading section image:', error);
      toast.error('Eroare', 'Nu s-a putut încărca imaginea.');
    } finally {
      setUploadingSectionImage(null);
      if (sectionImageRef.current) sectionImageRef.current.value = '';
    }
  };

  // Contacts Management
  const addContact = () => {
    const newContact: ContactPerson = {
      id: generateId(),
      name: '',
      role: '',
      phone: '',
      email: '',
    };
    setFormData(prev => ({ ...prev, contacts: [...prev.contacts, newContact] }));
  };

  const updateContact = (contactId: string, updates: Partial<ContactPerson>) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map(c => c.id === contactId ? { ...c, ...updates } : c),
    }));
  };

  const removeContact = (contactId: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter(c => c.id !== contactId),
    }));
  };

  // Info Cards Management
  const addInfoCard = () => {
    const newCard: InfoCard = {
      id: generateId(),
      icon: 'building',
      label: '',
      value: '',
    };
    setFormData(prev => ({ ...prev, info_cards: [...prev.info_cards, newCard] }));
  };

  const updateInfoCard = (cardId: string, updates: Partial<InfoCard>) => {
    setFormData(prev => ({
      ...prev,
      info_cards: prev.info_cards.map(ic => ic.id === cardId ? { ...ic, ...updates } : ic),
    }));
  };

  const removeInfoCard = (cardId: string) => {
    setFormData(prev => ({
      ...prev,
      info_cards: prev.info_cards.filter(ic => ic.id !== cardId),
    }));
  };

  // List items management
  const addListItem = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.map(s => 
        s.id === sectionId && s.type === 'list' 
          ? { ...s, items: [...(s.items || []), { text: '' }] }
          : s
      ),
    }));
  };

  const updateListItem = (sectionId: string, itemIndex: number, text: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.map(s => 
        s.id === sectionId && s.type === 'list'
          ? { ...s, items: s.items?.map((item, i) => i === itemIndex ? { text } : item) }
          : s
      ),
    }));
  };

  const removeListItem = (sectionId: string, itemIndex: number) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.map(s => 
        s.id === sectionId && s.type === 'list'
          ? { ...s, items: s.items?.filter((_, i) => i !== itemIndex) }
          : s
      ),
    }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const getSectionIcon = (type: ContentSection['type']) => {
    switch (type) {
      case 'heading': return Type;
      case 'text': return AlignLeft;
      case 'image': return ImageIcon;
      case 'list': return List;
      default: return AlignLeft;
    }
  };

  const getSectionLabel = (type: ContentSection['type']) => {
    switch (type) {
      case 'heading': return 'Titlu';
      case 'text': return 'Text';
      case 'image': return 'Imagine';
      case 'list': return 'Listă';
      default: return 'Secțiune';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Instituție' : 'Editează Instituția'}
        breadcrumbs={[
          { label: 'Instituții', href: '/admin/institutii' },
          { label: isNew ? 'Instituție Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/institutii')}>Înapoi</AdminButton>
            {!isNew && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <AdminCard title="Informații Generale">
            <div className="space-y-4">
              <AdminInput 
                label="Nume Instituție" 
                value={formData.name} 
                onChange={(e) => handleNameChange(e.target.value)} 
                required 
                error={errors.name} 
              />
              <AdminInput 
                label="Slug (URL)" 
                value={formData.slug} 
                onChange={(e) => handleChange('slug', e.target.value)} 
                required 
                error={errors.slug} 
              />
              <AdminTextarea 
                label="Descriere scurtă" 
                value={formData.short_description} 
                onChange={(e) => handleChange('short_description', e.target.value)} 
                rows={3}
                placeholder="O scurtă descriere care apare sub titlu"
              />
            </div>
          </AdminCard>

          {/* Contact Info */}
          <AdminCard title="Date de Contact">
            <div className="space-y-4">
              <AdminInput 
                label="Adresă" 
                value={formData.address} 
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Ex: Salonta, Piața Libertății nr. 1"
              />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput 
                  label="Telefon" 
                  value={formData.phone} 
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Ex: 0259-373.498"
                />
                <AdminInput 
                  label="Email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Ex: contact@institutie.ro"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AdminInput 
                  label="Website" 
                  value={formData.website} 
                  onChange={(e) => handleChange('website', e.target.value)} 
                  placeholder="https://..."
                />
                <AdminInput 
                  label="Facebook" 
                  value={formData.facebook} 
                  onChange={(e) => handleChange('facebook', e.target.value)} 
                  placeholder="https://facebook.com/..."
                />
              </div>
              <AdminTextarea 
                label="Program de lucru" 
                value={formData.working_hours} 
                onChange={(e) => handleChange('working_hours', e.target.value)} 
                rows={3}
                placeholder="Ex: Iarna: Marți-Vineri 8:00-16:00&#10;Sâmbătă-Duminică 10:00-14:00"
              />
              <AdminInput 
                label="Cod fiscal" 
                value={formData.fiscal_code} 
                onChange={(e) => handleChange('fiscal_code', e.target.value)}
                placeholder="Ex: RO12345678"
              />
            </div>
          </AdminCard>

          {/* Director Info */}
          <AdminCard title="Conducere">
            <div className="grid grid-cols-2 gap-4">
              <AdminInput 
                label="Nume Director/Manager" 
                value={formData.director_name} 
                onChange={(e) => handleChange('director_name', e.target.value)}
                placeholder="Ex: Gali Boglárka"
              />
              <AdminInput 
                label="Funcție" 
                value={formData.director_title} 
                onChange={(e) => handleChange('director_title', e.target.value)}
                placeholder="Ex: Manager, Director"
              />
            </div>
          </AdminCard>

          {/* Primary Image */}
          <AdminCard title="Imagine Principală">
            {formData.image_url ? (
              <div className="space-y-4">
                <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt="Imagine principală"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleDeletePrimaryImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : isNew ? (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <p className="text-amber-800">Salvează instituția pentru a putea încărca imagini.</p>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg text-center">
                <input
                  ref={primaryImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadPrimaryImage(file);
                  }}
                  className="hidden"
                />
                <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-3">Încarcă imaginea principală</p>
                <AdminButton
                  icon={Upload}
                  onClick={() => primaryImageRef.current?.click()}
                  loading={uploadingPrimary}
                >
                  Selectează Imagine
                </AdminButton>
              </div>
            )}
          </AdminCard>

          {/* Dynamic Content Sections */}
          <AdminCard title="Conținut">
            {formData.content.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <AlignLeft className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Nu există secțiuni de conținut.</p>
                <p className="text-sm mt-1">Folosește butoanele de mai jos pentru a adăuga secțiuni.</p>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {formData.content.map((section, index) => {
                  const SectionIcon = getSectionIcon(section.type);
                  const isExpanded = expandedSections[section.id] !== false;

                  return (
                    <div 
                      key={section.id} 
                      className="border border-slate-200 rounded-lg overflow-hidden"
                    >
                      {/* Section Header */}
                      <div 
                        className="flex items-center gap-3 p-3 bg-slate-50 cursor-pointer"
                        onClick={() => toggleSection(section.id)}
                      >
                        <GripVertical className="w-4 h-4 text-slate-400" />
                        <SectionIcon className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-700">
                          {getSectionLabel(section.type)}
                          {section.title && `: ${section.title}`}
                        </span>
                        <div className="flex-1" />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }}
                            disabled={index === 0}
                            className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }}
                            disabled={index === formData.content.length - 1}
                            className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                            className="p-1 hover:bg-red-100 text-red-500 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Section Content */}
                      {isExpanded && (
                        <div className="p-4 space-y-3">
                          {section.type === 'heading' && (
                            <AdminInput
                              label="Titlu secțiune"
                              value={section.title || ''}
                              onChange={(e) => updateSection(section.id, { title: e.target.value })}
                              placeholder="Titlul secțiunii"
                            />
                          )}

                          {section.type === 'text' && (
                            <>
                              <AdminInput
                                label="Titlu (opțional)"
                                value={section.title || ''}
                                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                placeholder="Titlu pentru această secțiune"
                              />
                              <AdminTextarea
                                label="Conținut"
                                value={section.content || ''}
                                onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                rows={6}
                                placeholder="Textul secțiunii..."
                              />
                            </>
                          )}

                          {section.type === 'image' && (
                            <>
                              <AdminInput
                                label="Titlu imagine (opțional)"
                                value={section.title || ''}
                                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                placeholder="Titlu pentru imagine"
                              />
                              {section.image_url ? (
                                <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                                  <img
                                    src={section.image_url}
                                    alt={section.title || 'Section image'}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    onClick={() => updateSection(section.id, { image_url: '' })}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : isNew ? (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center text-sm">
                                  <p className="text-amber-800">Salvează instituția pentru a încărca imagini.</p>
                                </div>
                              ) : (
                                <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleUploadSectionImage(section.id, file);
                                    }}
                                    className="hidden"
                                    id={`section-image-${section.id}`}
                                  />
                                  <label 
                                    htmlFor={`section-image-${section.id}`}
                                    className="cursor-pointer"
                                  >
                                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <p className="text-slate-600 text-sm mb-2">Încarcă imagine</p>
                                    <AdminButton
                                      size="sm"
                                      icon={Upload}
                                      loading={uploadingSectionImage === section.id}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(`section-image-${section.id}`)?.click();
                                      }}
                                    >
                                      Selectează
                                    </AdminButton>
                                  </label>
                                </div>
                              )}
                              <AdminInput
                                label="Descriere imagine (opțional)"
                                value={section.caption || ''}
                                onChange={(e) => updateSection(section.id, { caption: e.target.value })}
                                placeholder="Descrierea imaginii"
                              />
                            </>
                          )}

                          {section.type === 'list' && (
                            <>
                              <AdminInput
                                label="Titlu listă (opțional)"
                                value={section.title || ''}
                                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                placeholder="Titlu pentru această listă"
                              />
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Elemente listă</label>
                                {section.items?.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={item.text}
                                      onChange={(e) => updateListItem(section.id, itemIndex, e.target.value)}
                                      placeholder={`Element ${itemIndex + 1}`}
                                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                      onClick={() => removeListItem(section.id, itemIndex)}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                                <AdminButton
                                  size="sm"
                                  variant="ghost"
                                  icon={Plus}
                                  onClick={() => addListItem(section.id)}
                                >
                                  Adaugă element
                                </AdminButton>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add section buttons - at the bottom */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-500 mr-2 self-center">Adaugă secțiune:</span>
              <AdminButton size="sm" variant="secondary" icon={Type} onClick={() => addSection('heading')}>
                Titlu
              </AdminButton>
              <AdminButton size="sm" variant="secondary" icon={AlignLeft} onClick={() => addSection('text')}>
                Text
              </AdminButton>
              <AdminButton size="sm" variant="secondary" icon={ImageIcon} onClick={() => addSection('image')}>
                Imagine
              </AdminButton>
              <AdminButton size="sm" variant="secondary" icon={List} onClick={() => addSection('list')}>
                Listă
              </AdminButton>
            </div>
          </AdminCard>

          {/* Additional Contacts */}
          <AdminCard 
            title="Persoane de Contact Adiționale"
            actions={
              <AdminButton size="sm" variant="secondary" icon={Plus} onClick={addContact}>
                Adaugă Contact
              </AdminButton>
            }
          >
            {formData.contacts.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <User className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>Nu există contacte adiționale.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.contacts.map((contact) => (
                  <div key={contact.id} className="p-4 bg-slate-50 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        <AdminInput
                          label="Nume"
                          value={contact.name}
                          onChange={(e) => updateContact(contact.id, { name: e.target.value })}
                          placeholder="Nume complet"
                        />
                        <AdminInput
                          label="Funcție"
                          value={contact.role || ''}
                          onChange={(e) => updateContact(contact.id, { role: e.target.value })}
                          placeholder="Ex: Secretar, Contabil"
                        />
                        <AdminInput
                          label="Telefon"
                          value={contact.phone || ''}
                          onChange={(e) => updateContact(contact.id, { phone: e.target.value })}
                          placeholder="Număr telefon"
                        />
                        <AdminInput
                          label="Email"
                          value={contact.email || ''}
                          onChange={(e) => updateContact(contact.id, { email: e.target.value })}
                          placeholder="Adresă email"
                        />
                      </div>
                      <button
                        onClick={() => removeContact(contact.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg ml-3"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>

          {/* Info Cards */}
          <AdminCard 
            title="Carduri Informații (afișare în partea de sus)"
            actions={
              <AdminButton size="sm" variant="secondary" icon={Plus} onClick={addInfoCard}>
                Adaugă Card
              </AdminButton>
            }
          >
            {formData.info_cards.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <Building className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>Nu există carduri informații adiționale.</p>
                <p className="text-sm mt-1">Adresa, telefonul și email-ul principal apar automat.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.info_cards.map((card) => (
                  <div key={card.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex gap-3">
                      <div className="grid grid-cols-3 gap-3 flex-1">
                        <AdminSelect
                          label="Icon"
                          value={card.icon}
                          onChange={(e) => updateInfoCard(card.id, { icon: e.target.value })}
                          options={INFO_CARD_ICONS}
                        />
                        <AdminInput
                          label="Etichetă (opțional)"
                          value={card.label || ''}
                          onChange={(e) => updateInfoCard(card.id, { label: e.target.value })}
                          placeholder="Ex: Capacitate"
                        />
                        <AdminInput
                          label="Valoare"
                          value={card.value}
                          onChange={(e) => updateInfoCard(card.id, { value: e.target.value })}
                          placeholder="Ex: 500 locuri"
                        />
                      </div>
                      <button
                        onClick={() => removeInfoCard(card.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg self-end"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          <AdminCard title="Publicare">
            <div className="space-y-4">
              <AdminSelect 
                label="Icon" 
                value={formData.icon} 
                onChange={(e) => handleChange('icon', e.target.value)} 
                options={ICONS} 
              />
              <AdminInput 
                label="Ordine afișare" 
                type="number" 
                value={formData.display_order.toString()} 
                onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)} 
              />
              
              {[
                { field: 'published' as const, label: 'Publicată', desc: 'Vizibilă pe website' },
                { field: 'show_in_citizens' as const, label: 'Pentru Cetățeni', desc: 'Afișează în meniul Cetățeni' },
                { field: 'show_in_tourists' as const, label: 'Pentru Turiști', desc: 'Afișează în meniul Turiști' },
              ].map(({ field, label, desc }) => (
                <div key={field} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{label}</p>
                    <p className="text-sm text-slate-500">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData[field] as boolean} 
                      onChange={(e) => handleChange(field, e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
              
              <AdminButton 
                size="lg" 
                icon={Save} 
                onClick={handleSave} 
                loading={saving} 
                className="w-full"
              >
                {isNew ? 'Salvează' : 'Salvează Modificările'}
              </AdminButton>
            </div>
          </AdminCard>

          {isNew && (
            <AdminCard className="bg-blue-50 border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Notă:</strong> După ce salvezi instituția, vei putea adăuga imagini și secțiuni de conținut cu imagini.
              </p>
            </AdminCard>
          )}
        </div>
      </div>

      <AdminConfirmDialog 
        isOpen={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)} 
        onConfirm={handleDelete} 
        title="Șterge Instituția?" 
        message={`Ștergi "${formData.name}"? Această acțiune nu poate fi anulată.`} 
        confirmLabel="Da, șterge" 
        cancelLabel="Anulează" 
        loading={deleting} 
      />
    </div>
  );
}
