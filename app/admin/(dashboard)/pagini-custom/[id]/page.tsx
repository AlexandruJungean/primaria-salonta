'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Save, Trash2, Plus, ChevronUp, ChevronDown, ArrowLeft,
  Type, AlignLeft, ImageIcon, FileText, LinkIcon, Minus, Upload, X,
  FileBox,
} from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminButton, AdminConfirmDialog, toast } from '@/components/admin';
import { AdminImageUpload } from '@/components/admin/ui/admin-image-upload';
import { IconPicker } from '@/components/admin/icon-picker';
import { adminFetch } from '@/lib/api-client';
import Link from 'next/link';

// ── Block types ──

interface HeadingBlock {
  id: string;
  type: 'heading';
  level: 'h2' | 'h3';
  text: string;
}

interface TextBlock {
  id: string;
  type: 'text';
  content: string;
}

interface ImageItem {
  url: string;
  alt: string;
  caption: string;
}

interface ImageBlock {
  id: string;
  type: 'image';
  images: ImageItem[];
  columns: 1 | 2 | 3 | 4 | 5;
  maxHeight: string;
  // legacy single-image fields (migrated on load)
  url?: string;
  alt?: string;
  caption?: string;
  layout?: string;
}

interface DocumentItem {
  title: string;
  url: string;
  file_name: string;
  file_size: number;
}

interface DocumentsBlock {
  id: string;
  type: 'documents';
  title: string;
  items: DocumentItem[];
}

interface DocumentDetailBlock {
  id: string;
  type: 'document_detail';
  title: string;
  description: string;
  attachments: DocumentItem[];
  links: { title: string; url: string }[];
}

interface LinkItem {
  title: string;
  url: string;
  description: string;
}

interface LinksBlock {
  id: string;
  type: 'links';
  title: string;
  items: LinkItem[];
}

interface SeparatorBlock {
  id: string;
  type: 'separator';
}

type ContentBlock = HeadingBlock | TextBlock | ImageBlock | DocumentsBlock | DocumentDetailBlock | LinksBlock | SeparatorBlock;

// ── Nav page metadata ──

interface NavPageData {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  is_custom: boolean;
  page_id: string;
  section_id: string;
  show_in_cetateni: boolean;
  show_in_firme: boolean;
  show_in_primarie: boolean;
  show_in_turist: boolean;
  nav_sections?: { slug: string; title: string };
}

const NAV_GROUPS = [
  { key: 'show_in_cetateni' as const, label: 'Cetățeni' },
  { key: 'show_in_firme' as const, label: 'Firme' },
  { key: 'show_in_primarie' as const, label: 'Primărie' },
  { key: 'show_in_turist' as const, label: 'Turist' },
];

const BLOCK_TYPES = [
  { type: 'heading', label: 'Titlu', icon: Type },
  { type: 'text', label: 'Text', icon: AlignLeft },
  { type: 'image', label: 'Imagini', icon: ImageIcon },
  { type: 'documents', label: 'Lista documente', icon: FileText },
  { type: 'document_detail', label: 'Document cu atașamente', icon: FileBox },
  { type: 'links', label: 'Link-uri', icon: LinkIcon },
  { type: 'separator', label: 'Separator', icon: Minus },
] as const;

function generateId() {
  return crypto.randomUUID();
}

export default function CustomPageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [navPage, setNavPage] = useState<NavPageData | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [showDeletePage, setShowDeletePage] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [deletedBlock, setDeletedBlock] = useState<{ block: ContentBlock; index: number } | null>(null);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Settings form state (synced from navPage)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('fileText');
  const [isActive, setIsActive] = useState(true);
  const [navGroups, setNavGroups] = useState({
    show_in_cetateni: false,
    show_in_firme: false,
    show_in_primarie: false,
    show_in_turist: false,
  });

  const loadData = useCallback(async () => {
    try {
      const [pageRes, navRes] = await Promise.all([
        adminFetch(`/api/admin/pages?id=${pageId}`),
        adminFetch(`/api/admin/navigation?page_id=${pageId}`),
      ]);

      if (!pageRes.ok) throw new Error('Failed to fetch page');
      const pageData = await pageRes.json();
      setBlocks(pageData.structured_data?.blocks || []);

      if (navRes.ok) {
        const navData = await navRes.json();
        setNavPage(navData);
        setTitle(navData.title);
        setDescription(navData.description || '');
        setIcon(navData.icon);
        setIsActive(navData.is_active);
        setNavGroups({
          show_in_cetateni: navData.show_in_cetateni,
          show_in_firme: navData.show_in_firme,
          show_in_primarie: navData.show_in_primarie,
          show_in_turist: navData.show_in_turist,
        });
      }
    } catch (error) {
      console.error('Error loading page:', error);
      toast.error('Eroare la încărcarea paginii');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveAll = async () => {
    setSaving(true);
    try {
      // Save page content (blocks)
      const pageRes = await adminFetch(`/api/admin/pages?id=${pageId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title,
          structured_data: { blocks },
        }),
      });
      if (!pageRes.ok) throw new Error('Failed to save page content');

      // Save nav_page metadata
      if (navPage) {
        const navRes = await adminFetch(`/api/admin/navigation?id=${navPage.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title,
            description,
            icon,
            is_active: isActive,
            ...navGroups,
          }),
        });
        if (!navRes.ok) throw new Error('Failed to save nav page');
      }

      toast.success('Salvat cu succes');
    } catch {
      toast.error('Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  const deletePage = async () => {
    if (!navPage) return;
    try {
      const response = await adminFetch(`/api/admin/navigation?id=${navPage.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Pagina a fost ștearsă');
      const sectionSlug = navPage.nav_sections?.slug;
      router.push(sectionSlug ? `/admin/${sectionSlug}` : '/admin');
    } catch {
      toast.error('Eroare la ștergerea paginii');
    }
  };

  // ── Block operations ──

  const addBlock = (type: ContentBlock['type']) => {
    const id = generateId();
    let block: ContentBlock;
    switch (type) {
      case 'heading':
        block = { id, type: 'heading', level: 'h2', text: '' };
        break;
      case 'text':
        block = { id, type: 'text', content: '' };
        break;
      case 'image':
        block = { id, type: 'image', images: [{ url: '', alt: '', caption: '' }], columns: 1, maxHeight: '' };
        break;
      case 'documents':
        block = { id, type: 'documents', title: '', items: [] };
        break;
      case 'document_detail':
        block = { id, type: 'document_detail', title: '', description: '', attachments: [], links: [] };
        break;
      case 'links':
        block = { id, type: 'links', title: '', items: [] };
        break;
      case 'separator':
        block = { id, type: 'separator' };
        break;
    }
    setBlocks(prev => [...prev, block]);
    setShowBlockMenu(false);
  };

  const updateBlock = (index: number, updated: Partial<ContentBlock>) => {
    setBlocks(prev => prev.map((b, i) => i === index ? { ...b, ...updated } as ContentBlock : b));
  };

  const removeBlock = (index: number) => {
    const removed = blocks[index];
    setBlocks(prev => prev.filter((_, i) => i !== index));
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setDeletedBlock({ block: removed, index });
    undoTimerRef.current = setTimeout(() => setDeletedBlock(null), 8000);
  };

  const undoRemoveBlock = () => {
    if (!deletedBlock) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setBlocks(prev => {
      const next = [...prev];
      next.splice(deletedBlock.index, 0, deletedBlock.block);
      return next;
    });
    setDeletedBlock(null);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const swap = direction === 'up' ? index - 1 : index + 1;
    if (swap < 0 || swap >= blocks.length) return;
    setBlocks(prev => {
      const next = [...prev];
      [next[index], next[swap]] = [next[swap], next[index]];
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const sectionSlug = navPage?.nav_sections?.slug;
  const sectionTitle = navPage?.nav_sections?.title;

  return (
    <div>
      <AdminPageHeader
        title={title || 'Pagină nouă'}
        breadcrumbs={[
          ...(sectionSlug && sectionTitle
            ? [{ label: sectionTitle, href: `/admin/${sectionSlug}` }]
            : []),
          { label: title || 'Pagină nouă' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {sectionSlug && (
              <Link href={`/admin/${sectionSlug}`}>
                <AdminButton variant="secondary" icon={ArrowLeft}>Înapoi</AdminButton>
              </Link>
            )}
            <AdminButton onClick={saveAll} disabled={saving} icon={Save}>
              {saving ? 'Se salvează...' : 'Salvează'}
            </AdminButton>
          </div>
        }
      />

      {/* Settings section */}
      <AdminCard className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Setări pagină</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex items-end gap-3">
            <IconPicker
              value={icon}
              onChange={setIcon}
              label="Icon"
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Titlu</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Titlul paginii"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Descriere (opțional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descriere scurtă pentru card..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Vizibilitate</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600">Pagina este activă</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Vizibil în meniul public</label>
            <div className="flex flex-wrap gap-4">
              {NAV_GROUPS.map(group => (
                <label key={group.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={navGroups[group.key]}
                    onChange={e => setNavGroups(prev => ({ ...prev, [group.key]: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">{group.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setShowDeletePage(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Șterge pagina
          </button>
        </div>
      </AdminCard>

      {/* Content blocks */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Conținut pagină</h2>

        <div className="space-y-3">
          {blocks.map((block, index) => (
            <AdminCard key={block.id}>
              <div className="flex gap-3">
                {/* Reorder + delete controls */}
                <div className="flex flex-col gap-0.5 pt-1">
                  <button
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-400 hover:text-slate-600"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-400 hover:text-slate-600"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeBlock(index)}
                    className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 mt-1"
                    title="Șterge bloc"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Block content */}
                <div className="flex-1">
                  <BlockEditor
                    block={block}
                    onChange={(updated) => updateBlock(index, updated)}
                  />
                </div>
              </div>
            </AdminCard>
          ))}
        </div>

        {blocks.length === 0 && !deletedBlock && (
          <AdminCard>
            <div className="text-center py-8 text-slate-500">
              Nu există conținut. Adaugă primul bloc.
            </div>
          </AdminCard>
        )}

        {deletedBlock && (
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg mt-3">
            <span className="text-sm text-amber-800">Bloc șters.</span>
            <button
              onClick={undoRemoveBlock}
              className="text-sm font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2"
            >
              Anulează
            </button>
          </div>
        )}
      </div>

      {/* Add block + save */}
      <div className="flex justify-between items-start">
        <BlockMenuDropdown
          show={showBlockMenu}
          onToggle={() => setShowBlockMenu(!showBlockMenu)}
          onClose={() => setShowBlockMenu(false)}
          onAdd={addBlock}
        />
        <AdminButton onClick={saveAll} disabled={saving} icon={Save}>
          {saving ? 'Se salvează...' : 'Salvează totul'}
        </AdminButton>
      </div>

      {/* Delete confirmation */}
      <AdminConfirmDialog
        isOpen={showDeletePage}
        onClose={() => setShowDeletePage(false)}
        onConfirm={deletePage}
        title="Șterge pagina personalizată?"
        message={`Ești sigur că vrei să ștergi pagina „${title}"? Tot conținutul va fi pierdut definitiv.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
      />
    </div>
  );
}

// ── Block editor sub-components ──

function BlockEditor({ block, onChange }: { block: ContentBlock; onChange: (updated: Partial<ContentBlock>) => void }) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlockEditor block={block} onChange={onChange} />;
    case 'text':
      return <TextBlockEditor block={block} onChange={onChange} />;
    case 'image': {
      const migrated = migrateImageBlock(block);
      return <ImageBlockEditor block={migrated} onChange={onChange} />;
    }
    case 'documents':
      return <DocumentsBlockEditor block={block} onChange={onChange} />;
    case 'document_detail':
      return <DocumentDetailBlockEditor block={block} onChange={onChange} />;
    case 'links':
      return <LinksBlockEditor block={block} onChange={onChange} />;
    case 'separator':
      return <SeparatorBlockEditor />;
  }
}

function migrateImageBlock(block: ImageBlock): ImageBlock {
  if (block.images && block.images.length > 0) return block;
  if (block.url) {
    return { ...block, images: [{ url: block.url, alt: block.alt || '', caption: block.caption || '' }], columns: 1, maxHeight: '' };
  }
  return { ...block, images: [], columns: block.columns || 1, maxHeight: block.maxHeight || '' };
}

function HeadingBlockEditor({ block, onChange }: { block: HeadingBlock; onChange: (u: Partial<HeadingBlock>) => void }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Type className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-500 uppercase">Titlu</span>
        <select
          value={block.level}
          onChange={e => onChange({ level: e.target.value as 'h2' | 'h3' })}
          className="ml-auto text-xs border border-slate-300 rounded px-2 py-1"
        >
          <option value="h2">H2 - Mare</option>
          <option value="h3">H3 - Mic</option>
        </select>
      </div>
      <input
        type="text"
        value={block.text}
        onChange={e => onChange({ text: e.target.value })}
        placeholder="Titlul secțiunii..."
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
      />
    </div>
  );
}

function TextBlockEditor({ block, onChange }: { block: TextBlock; onChange: (u: Partial<TextBlock>) => void }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <AlignLeft className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-500 uppercase">Text</span>
      </div>
      <textarea
        value={block.content}
        onChange={e => onChange({ content: e.target.value })}
        placeholder="Scrie conținutul aici..."
        rows={4}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

function ImageBlockEditor({ block, onChange }: { block: ImageBlock; onChange: (u: Partial<ImageBlock>) => void }) {
  const images = block.images || [];

  const updateImage = (idx: number, field: keyof ImageItem, value: string) => {
    const next = [...images];
    next[idx] = { ...next[idx], [field]: value };
    onChange({ images: next });
  };

  const addImage = () => {
    onChange({ images: [...images, { url: '', alt: '', caption: '' }] });
  };

  const removeImage = (idx: number) => {
    onChange({ images: images.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <ImageIcon className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-500 uppercase">Imagini</span>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1">
            <label className="text-xs text-slate-500">Coloane:</label>
            <select
              value={block.columns}
              onChange={e => onChange({ columns: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
              className="text-xs border border-slate-300 rounded px-2 py-1"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <label className="text-xs text-slate-500">Înălțime max:</label>
            <input
              type="text"
              value={block.maxHeight || ''}
              onChange={e => onChange({ maxHeight: e.target.value })}
              placeholder="ex: 300px"
              className="w-20 text-xs border border-slate-300 rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      <div className={`grid gap-3 ${images.length > 1 ? 'grid-cols-1 md:grid-cols-2' : ''}`}>
        {images.map((img, idx) => (
          <div key={idx} className="border border-slate-200 rounded-lg p-3 relative">
            {images.length > 1 && (
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-red-50 text-slate-400 hover:text-red-600 z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <AdminImageUpload
              label=""
              value={img.url}
              onChange={url => updateImage(idx, 'url', url)}
              category="altele"
              maxWidth={250}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="text"
                value={img.alt}
                onChange={e => updateImage(idx, 'alt', e.target.value)}
                placeholder="Text alternativ..."
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={img.caption}
                onChange={e => updateImage(idx, 'caption', e.target.value)}
                placeholder="Legendă..."
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addImage}
        className="mt-2 flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg border border-dashed border-slate-300"
      >
        <Plus className="w-4 h-4" /> Adaugă imagine
      </button>
    </div>
  );
}

function DocumentsBlockEditor({ block, onChange }: { block: DocumentsBlock; onChange: (u: Partial<DocumentsBlock>) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadDocument = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'altele');

      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const newItem: DocumentItem = {
        title: file.name.replace(/\.[^/.]+$/, ''),
        url: data.url,
        file_name: data.originalFilename || file.name,
        file_size: file.size,
      };
      onChange({ items: [...block.items, newItem] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Eroare la încărcare');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeItem = (idx: number) => {
    onChange({ items: block.items.filter((_, i) => i !== idx) });
  };

  const updateItem = (idx: number, field: keyof DocumentItem, value: string | number) => {
    const items = [...block.items];
    items[idx] = { ...items[idx], [field]: value };
    onChange({ items });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-500 uppercase">Documente</span>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-medium text-slate-500 mb-1">Titlu secțiune (opțional)</label>
        <input
          type="text"
          value={block.title}
          onChange={e => onChange({ title: e.target.value })}
          placeholder="ex: Documente atașate"
          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="space-y-2">
        {block.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={item.title}
              onChange={e => updateItem(idx, 'title', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Titlu document"
            />
            <span className="text-xs text-slate-400 shrink-0">{formatSize(item.file_size)}</span>
            <button
              onClick={() => removeItem(idx)}
              className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="mt-2 flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg border border-dashed border-slate-300 disabled:opacity-50"
      >
        <Upload className="w-4 h-4" />
        {uploading ? 'Se încarcă...' : 'Încarcă document'}
      </button>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.zip,.rar"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) uploadDocument(file);
        }}
      />
    </div>
  );
}

function DocumentDetailBlockEditor({ block, onChange }: { block: DocumentDetailBlock; onChange: (u: Partial<DocumentDetailBlock>) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadAttachment = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'altele');
      const response = await adminFetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const newItem: DocumentItem = {
        title: file.name.replace(/\.[^/.]+$/, ''),
        url: data.url,
        file_name: data.originalFilename || file.name,
        file_size: file.size,
      };
      onChange({ attachments: [...block.attachments, newItem] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Eroare la încărcare');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeAttachment = (idx: number) => {
    onChange({ attachments: block.attachments.filter((_, i) => i !== idx) });
  };

  const updateAttachment = (idx: number, title: string) => {
    const attachments = [...block.attachments];
    attachments[idx] = { ...attachments[idx], title };
    onChange({ attachments });
  };

  const addLink = () => {
    onChange({ links: [...block.links, { title: '', url: '' }] });
  };

  const removeLink = (idx: number) => {
    onChange({ links: block.links.filter((_, i) => i !== idx) });
  };

  const updateLink = (idx: number, field: 'title' | 'url', value: string) => {
    const links = [...block.links];
    links[idx] = { ...links[idx], [field]: value };
    onChange({ links });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <FileBox className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-500 uppercase">Document cu atașamente</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Titlu document</label>
          <input
            type="text"
            value={block.title}
            onChange={e => onChange({ title: e.target.value })}
            placeholder="ex: Hotărârea nr. 123/2026"
            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Descriere (opțional)</label>
          <textarea
            value={block.description}
            onChange={e => onChange({ description: e.target.value })}
            placeholder="Descriere sau rezumat..."
            rows={2}
            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Fișiere atașate</label>
          <div className="space-y-1.5">
            {block.attachments.map((att, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={att.title}
                  onChange={e => updateAttachment(idx, e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Titlu fișier"
                />
                <span className="text-xs text-slate-400 shrink-0">{formatSize(att.file_size)}</span>
                <button onClick={() => removeAttachment(idx)} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="mt-1.5 flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg border border-dashed border-slate-300 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Se încarcă...' : 'Încarcă fișier'}
          </button>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.zip,.rar"
            onChange={e => { const file = e.target.files?.[0]; if (file) uploadAttachment(file); }}
          />
        </div>

        {/* Links */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Link-uri asociate</label>
          <div className="space-y-1.5">
            {block.links.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={link.title}
                  onChange={e => updateLink(idx, 'title', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Titlu link"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={e => updateLink(idx, 'url', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
                <button onClick={() => removeLink(idx)} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addLink}
            className="mt-1.5 flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg border border-dashed border-slate-300"
          >
            <Plus className="w-4 h-4" /> Adaugă link
          </button>
        </div>
      </div>
    </div>
  );
}

function LinksBlockEditor({ block, onChange }: { block: LinksBlock; onChange: (u: Partial<LinksBlock>) => void }) {
  const addLink = () => {
    onChange({ items: [...block.items, { title: '', url: '', description: '' }] });
  };

  const removeLink = (idx: number) => {
    onChange({ items: block.items.filter((_, i) => i !== idx) });
  };

  const updateLink = (idx: number, field: keyof LinkItem, value: string) => {
    const items = [...block.items];
    items[idx] = { ...items[idx], [field]: value };
    onChange({ items });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <LinkIcon className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-500 uppercase">Link-uri</span>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-medium text-slate-500 mb-1">Titlu secțiune (opțional)</label>
        <input
          type="text"
          value={block.title}
          onChange={e => onChange({ title: e.target.value })}
          placeholder="ex: Resurse utile"
          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="space-y-2">
        {block.items.map((item, idx) => (
          <div key={idx} className="p-2 bg-slate-50 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={e => updateLink(idx, 'title', e.target.value)}
                  className="px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Titlu link"
                />
                <input
                  type="url"
                  value={item.url}
                  onChange={e => updateLink(idx, 'url', e.target.value)}
                  className="px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={e => updateLink(idx, 'description', e.target.value)}
                  className="px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 md:col-span-2"
                  placeholder="Descriere (opțional)"
                />
              </div>
              <button
                onClick={() => removeLink(idx)}
                className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 mt-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addLink}
        className="mt-2 flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg border border-dashed border-slate-300"
      >
        <Plus className="w-4 h-4" /> Adaugă link
      </button>
    </div>
  );
}

function SeparatorBlockEditor() {
  return (
    <div className="flex items-center gap-2">
      <Minus className="w-4 h-4 text-slate-400" />
      <span className="text-xs font-medium text-slate-500 uppercase">Separator</span>
      <div className="flex-1 border-t border-slate-300" />
    </div>
  );
}

function BlockMenuDropdown({ show, onToggle, onClose, onAdd }: {
  show: boolean;
  onToggle: () => void;
  onClose: () => void;
  onAdd: (type: ContentBlock['type']) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [show, onClose]);

  return (
    <div className="relative" ref={ref}>
      <AdminButton onClick={onToggle} variant="secondary" icon={Plus}>
        Adaugă bloc
      </AdminButton>
      {show && (
        <div className="absolute bottom-full left-0 mb-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 min-w-[220px]">
          {BLOCK_TYPES.map(({ type, label, icon: BlockIcon }) => (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <BlockIcon className="w-4 h-4 text-slate-400" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatSize(bytes: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
