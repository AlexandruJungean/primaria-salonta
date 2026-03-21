import { FileText, ExternalLink, LinkIcon } from 'lucide-react';
import { ClickableImage } from '@/components/ui/clickable-image';

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
  images?: ImageItem[];
  columns?: 1 | 2 | 3 | 4 | 5;
  maxHeight?: string;
  url?: string;
  alt?: string;
  caption?: string;
  layout?: 'full' | 'contained';
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

interface CustomPageRendererProps {
  blocks: ContentBlock[];
}

export function CustomPageRenderer({ blocks }: CustomPageRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Această pagină nu are conținut încă.
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return block.level === 'h2' ? (
        <h2 className="text-2xl font-bold text-primary-800 mb-4 mt-8 first:mt-0">{block.text}</h2>
      ) : (
        <h3 className="text-xl font-semibold text-primary-800 mb-3 mt-6 first:mt-0">{block.text}</h3>
      );

    case 'text':
      return (
        <p className="whitespace-pre-line text-gray-700 leading-relaxed mb-6">{block.content}</p>
      );

    case 'image':
      return <ImageBlockRenderer block={block} />;

    case 'documents':
      if (!block.items || block.items.length === 0) return null;
      return (
        <div className="my-8 not-prose">
          {block.title && (
            <h3 className="text-lg font-semibold text-primary-800 mb-3">{block.title}</h3>
          )}
          <div className="space-y-2">
            {block.items.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-700 truncate">
                    {item.title || item.file_name}
                  </p>
                  {item.file_size > 0 && (
                    <p className="text-xs text-gray-500">{formatSize(item.file_size)}</p>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      );

    case 'document_detail':
      return <DocumentDetailRenderer block={block} />;

    case 'links':
      if (!block.items || block.items.length === 0) return null;
      return (
        <div className="my-8 not-prose">
          {block.title && (
            <h3 className="text-lg font-semibold text-primary-800 mb-3">{block.title}</h3>
          )}
          <div className="grid md:grid-cols-2 gap-3">
            {block.items.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-colors group"
              >
                <ExternalLink className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      );

    case 'separator':
      return <hr className="my-8 border-gray-200" />;

    default:
      return null;
  }
}

function ImageBlockRenderer({ block }: { block: ImageBlock }) {
  const images = block.images && block.images.length > 0
    ? block.images
    : block.url ? [{ url: block.url, alt: block.alt || '', caption: block.caption || '' }] : [];

  if (images.length === 0 || !images.some(img => img.url)) return null;

  const columns = block.columns || 1;
  const maxHeight = block.maxHeight || undefined;
  const heightStyle = maxHeight ? { maxHeight, overflow: 'hidden' as const } : undefined;

  if (images.length === 1) {
    const img = images[0];
    if (!img.url) return null;
    const isContained = block.layout === 'contained' || columns > 1;
    return (
      <figure className={`my-8 not-prose ${isContained ? 'max-w-2xl mx-auto' : ''}`}>
        <div style={heightStyle} className="rounded-xl overflow-hidden">
          <ClickableImage
            src={img.url}
            alt={img.alt || 'Imagine'}
            aspectRatio="video"
            className="rounded-xl"
            sizes={isContained ? '(max-width: 768px) 100vw, 672px' : '100vw'}
            caption={img.caption || undefined}
          />
        </div>
      </figure>
    );
  }

  const gridColsMap: Record<number, string> = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 5: 'md:grid-cols-5' };
  const gridCols = gridColsMap[columns] || '';

  return (
    <div className={`my-8 not-prose grid gap-4 ${gridCols}`}>
      {images.map((img, idx) => {
        if (!img.url) return null;
        return (
          <figure key={idx}>
            <div style={heightStyle} className="rounded-xl overflow-hidden">
              <ClickableImage
                src={img.url}
                alt={img.alt || 'Imagine'}
                aspectRatio="video"
                className="rounded-xl"
                sizes={columns >= 4 ? '25vw' : columns === 3 ? '33vw' : columns === 2 ? '50vw' : '100vw'}
                caption={img.caption || undefined}
              />
            </div>
          </figure>
        );
      })}
    </div>
  );
}

function DocumentDetailRenderer({ block }: { block: DocumentDetailBlock }) {
  const hasAttachments = block.attachments && block.attachments.length > 0;
  const hasLinks = block.links && block.links.length > 0;
  if (!block.title && !hasAttachments && !hasLinks) return null;

  return (
    <div className="my-8 not-prose border border-gray-200 rounded-xl p-5">
      {block.title && (
        <h3 className="text-lg font-semibold text-primary-800 mb-1">{block.title}</h3>
      )}
      {block.description && (
        <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">{block.description}</p>
      )}

      {hasAttachments && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Fișiere atașate</p>
          <div className="space-y-1.5">
            {block.attachments.map((att, idx) => (
              <a
                key={idx}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <FileText className="w-4 h-4 text-primary-600 shrink-0" />
                <span className="text-sm font-medium text-gray-900 group-hover:text-primary-700 flex-1 truncate">
                  {att.title || att.file_name}
                </span>
                {att.file_size > 0 && (
                  <span className="text-xs text-gray-400">{formatSize(att.file_size)}</span>
                )}
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {hasLinks && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Link-uri asociate</p>
          <div className="space-y-1.5">
            {block.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary-50 transition-colors group"
              >
                <LinkIcon className="w-4 h-4 text-primary-600 shrink-0" />
                <span className="text-sm text-primary-700 group-hover:text-primary-800 font-medium">
                  {link.title || link.url}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-auto" />
              </a>
            ))}
          </div>
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
