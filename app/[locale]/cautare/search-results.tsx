'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/components/ui/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Newspaper, 
  Calendar, 
  FileText, 
  Loader2,
  SearchX
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { MAIN_NAVIGATION } from '@/lib/constants/navigation';

interface SearchResult {
  type: 'news' | 'event' | 'page';
  id: string;
  title: string;
  description?: string;
  href: string;
  date?: string;
}

interface SearchResultsProps {
  query: string;
  locale: string;
}

// Static pages from navigation for search
function getNavigationPages(): SearchResult[] {
  const pagesMap = new Map<string, SearchResult>();
  
  MAIN_NAVIGATION.forEach(category => {
    // Add standalone items (like Evenimente, Stiri, etc.)
    if (category.standaloneItems) {
      category.standaloneItems.forEach(item => {
        if (item.href && !pagesMap.has(item.href)) {
          pagesMap.set(item.href, {
            type: 'page',
            id: item.id,
            title: item.id,
            href: item.href,
          });
        }
      });
    }
    
    // Add group pages
    if (category.groups) {
      category.groups.forEach(group => {
        // Add group page
        if (group.groupHref && !pagesMap.has(group.groupHref)) {
          pagesMap.set(group.groupHref, {
            type: 'page',
            id: group.groupId,
            title: group.groupId,
            href: group.groupHref,
          });
        }
        
        // Add items
        group.items.forEach(item => {
          if (item.href && !pagesMap.has(item.href)) {
            pagesMap.set(item.href, {
              type: 'page',
              id: item.id,
              title: item.id,
              href: item.href,
            });
          }
        });
      });
    }
  });
  
  return Array.from(pagesMap.values());
}

export function SearchResults({ query, locale }: SearchResultsProps) {
  const t = useTranslations('search');
  const tNav = useTranslations('navigation');
  const currentLocale = useLocale();
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!query);

  useEffect(() => {
    if (!query) return;
    
    const searchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`);
        const data = await response.json();
        
        // Also search navigation pages
        const navPages = getNavigationPages();
        const matchingPages = navPages.filter(page => {
          const translatedTitle = tNav(page.title).toLowerCase();
          return translatedTitle.includes(query.toLowerCase());
        }).map(page => ({
          ...page,
          title: tNav(page.title),
        }));
        
        setResults([...data.results, ...matchingPages]);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    searchContent();
  }, [query, locale, tNav]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setHasSearched(true);
    // Update URL with new query
    const url = new URL(window.location.href);
    url.searchParams.set('q', searchQuery);
    window.history.pushState({}, '', url);
    
    // Trigger search
    const searchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`);
        const data = await response.json();
        
        const navPages = getNavigationPages();
        const matchingPages = navPages.filter(page => {
          const translatedTitle = tNav(page.title).toLowerCase();
          return translatedTitle.includes(searchQuery.toLowerCase());
        }).map(page => ({
          ...page,
          title: tNav(page.title),
        }));
        
        setResults([...data.results, ...matchingPages]);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    searchContent();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'news': return Newspaper;
      case 'event': return Calendar;
      default: return FileText;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'news': return t('news');
      case 'event': return t('event');
      default: return t('page');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('placeholder')}
            className="w-full pl-12 pr-4 py-4 text-lg rounded-xl"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('searchButton')}
          </button>
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      )}

      {/* Results */}
      {!isLoading && hasSearched && (
        <>
          {results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                {t('found', { count: results.length })}
              </p>
              
              {results.map((result, index) => {
                const Icon = getIcon(result.type);
                return (
                  <Link key={`${result.type}-${result.id}-${index}`} href={result.href}>
                    <Card hover className="transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                            getTypeColor(result.type)
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn(
                                'text-xs font-medium px-2 py-0.5 rounded-full',
                                getTypeColor(result.type)
                              )}>
                                {getTypeLabel(result.type)}
                              </span>
                              {result.date && (
                                <span className="text-xs text-gray-500">{result.date}</span>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {result.title}
                            </h3>
                            {result.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {result.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <SearchX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('noResults')}
                </h3>
                <p className="text-gray-600">
                  {t('noResultsHint')}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Initial state - no search yet */}
      {!isLoading && !hasSearched && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('startSearch')}
            </h3>
            <p className="text-gray-600">
              {t('startSearchHint')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
