import { FileText, ExternalLink } from 'lucide-react';
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

interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  alt: string;
  caption: string;
  layout: 'full' | 'contained';
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

type ContentBlock = HeadingBlock | TextBlock | ImageBlock | DocumentsBlock | LinksBlock | SeparatorBlock;

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
      if (!block.url) return null;
      return (
        <figure className={`my-8 not-prose ${block.layout === 'contained' ? 'max-w-2xl mx-auto' : ''}`}>
          <ClickableImage
            src={block.url}
            alt={block.alt || 'Imagine'}
            aspectRatio="video"
            className="rounded-xl"
            sizes={block.layout === 'full' ? '100vw' : '(max-width: 768px) 100vw, 672px'}
            caption={block.caption || undefined}
          />
        </figure>
      );

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

function formatSize(bytes: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
