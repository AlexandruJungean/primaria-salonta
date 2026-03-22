'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link } from '@/components/ui/link';
import { ChevronDown, ChevronRight, Newspaper, Video, Phone, Plus, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { MAIN_NAVIGATION, SECONDARY_NAVIGATION, getNavigationWithInstitutions, type NavSection } from '@/lib/constants/navigation';
import { useNavigationContext } from './navigation-context';

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [createGroupError, setCreateGroupError] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations('navigation');
  const router = useRouter();
  const { dynamicInstitutions, dynamicPrograms, navPages } = useNavigationContext();

  useEffect(() => {
    fetch('/api/admin/auth/session', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user && (data.user.role === 'super_admin' || data.user.role === 'admin')) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  const navPagesMenuData = useMemo(() => {
    const transform = (pages: typeof navPages.cetateni) =>
      pages.map(p => {
        const sec = p.nav_sections as { slug: string; title?: string; icon?: string; public_path?: string | null } | undefined;
        return {
          id: p.id,
          title: p.title,
          icon: p.icon,
          public_path: p.public_path,
          section_slug: sec?.slug || '',
          section_title: sec?.title,
          section_icon: sec?.icon,
          section_public_path: sec?.public_path,
        };
      });
    return {
      cetateni: transform(navPages.cetateni),
      firme: transform(navPages.firme),
      primarie: transform(navPages.primarie),
      turist: transform(navPages.turist),
    };
  }, [navPages]);

  const navigation = useMemo(() => 
    getNavigationWithInstitutions(dynamicInstitutions, dynamicPrograms, navPagesMenuData),
    [dynamicInstitutions, dynamicPrograms, navPagesMenuData]
  );

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setShowCreateGroup(false);
    }, 150);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const createGroup = useCallback(async () => {
    if (!newGroupTitle.trim()) return;
    setCreatingGroup(true);
    setCreateGroupError('');
    try {
      const response = await fetch('/api/admin/navigation?type=section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: newGroupTitle }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = JSON.stringify(err);
        setCreateGroupError(msg.includes('duplicate') || msg.includes('already exists') ? 'Un grup cu acest nume există deja.' : 'Eroare la creare.');
        return;
      }
      const result = await response.json();
      setShowCreateGroup(false);
      setNewGroupTitle('');
      setActiveMenu(null);
      router.push(result.data.admin_path);
    } catch { setCreateGroupError('Eroare la creare.'); }
    finally { setCreatingGroup(false); }
  }, [newGroupTitle, router]);

  const secondaryIcons: Record<string, typeof Newspaper> = {
    stiri: Newspaper,
    camereWeb: Video,
    contact: Phone,
  };

  const getColumnCount = () => 4;

  const getAdminPathForGroup = (group: { groupId: string; groupHref?: string }) => {
    if (group.groupHref) {
      const slug = group.groupHref.replace(/^\//, '');
      if (slug.startsWith('sectiuni/')) return `/admin/${slug}`;
      return `/admin/${slug}`;
    }
    return `/admin/${group.groupId}`;
  };

  return (
    <nav className="flex items-center">
      {navigation.map((section) => {
        const hasContent =
          (section.groups && section.groups.length > 0) ||
          (section.standaloneItems && section.standaloneItems.length > 0);
        const columnCount = getColumnCount();

        return (
          <div
            key={section.id}
            className="relative"
            onMouseEnter={() => hasContent && handleMouseEnter(section.id)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                activeMenu === section.id
                  ? 'bg-primary-50 text-primary-900'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {t(section.id)}
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  activeMenu === section.id && 'rotate-180'
                )}
              />
            </button>

            {hasContent && activeMenu === section.id && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                onMouseEnter={() => handleMouseEnter(section.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className={cn(
                    'bg-white rounded-xl shadow-2xl border border-gray-200 p-5 animate-in fade-in slide-in-from-top-2 duration-200',
                    columnCount === 4 && 'min-w-[900px] max-w-[1100px]',
                    columnCount === 3 && 'min-w-[720px] max-w-[900px]',
                    columnCount === 2 && 'min-w-[520px] max-w-[640px]'
                  )}
                >
                  {/* Groups */}
                  {section.groups && section.groups.length > 0 && (
                    <div
                      className={cn(
                        'grid gap-6',
                        columnCount === 4 && 'grid-cols-4',
                        columnCount === 3 && 'grid-cols-3',
                        columnCount === 2 && 'grid-cols-2'
                      )}
                    >
                      {section.groups.map((group) => {
                        const GroupIcon = group.groupIcon;
                        const groupTitle = group.groupLabel || t(group.groupId);
                        const hasTitle = groupTitle && groupTitle.trim() !== '';
                        const adminPath = getAdminPathForGroup(group);
                        return (
                          <div key={group.groupId} className={cn("space-y-2", !hasTitle && "pt-10")}>
                            {hasTitle && (
                              group.groupHref ? (
                              <Link
                                href={group.groupHref}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-primary-50 transition-colors group"
                              >
                                {GroupIcon && (
                                  <GroupIcon className="w-4 h-4 text-primary-600" />
                                )}
                                <span className="text-sm font-semibold text-gray-900 group-hover:text-primary-700">
                                    {groupTitle}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-600 ml-auto" />
                              </Link>
                            ) : (
                              <div className="flex items-center gap-2 px-2 py-1.5">
                                {GroupIcon && (
                                  <GroupIcon className="w-4 h-4 text-primary-600" />
                                )}
                                <span className="text-sm font-semibold text-gray-900">
                                    {groupTitle}
                                </span>
                              </div>
                              )
                            )}

                            <div className={cn(
                              "space-y-0.5",
                              hasTitle ? "pl-1 border-l-2 border-gray-100 ml-2" : "pl-0 ml-0"
                            )}>
                              {group.items.map((item) => {
                                const ItemIcon = item.icon;
                                const itemLabel = item.label || t(item.id);
                                return (
                                  <Link
                                    key={item.id + item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors group"
                                  >
                                    {ItemIcon && (
                                      <ItemIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0" />
                                    )}
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                      {itemLabel}
                                    </span>
                                  </Link>
                                );
                              })}

                              {/* Admin: + Add page to this group */}
                              {isAdmin && (
                                <Link
                                  href={adminPath}
                                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors group mt-1"
                                >
                                  <Plus className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-600 shrink-0" />
                                  <span className="text-xs text-blue-400 group-hover:text-blue-600">
                                    Adaugă
                                  </span>
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Admin: Create Group card */}
                      {isAdmin && (
                        <div className="space-y-2">
                          {showCreateGroup ? (
                            <div className="p-3 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/50 space-y-2">
                              <p className="text-xs font-semibold text-blue-700 uppercase">Grup nou</p>
                              <input
                                type="text"
                                value={newGroupTitle}
                                onChange={e => setNewGroupTitle(e.target.value)}
                                placeholder="Nume grup..."
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                autoFocus
                                onKeyDown={e => { if (e.key === 'Enter') createGroup(); if (e.key === 'Escape') setShowCreateGroup(false); }}
                              />
                              {createGroupError && <p className="text-[10px] text-red-600">{createGroupError}</p>}
                              <div className="flex justify-end gap-1">
                                <button onClick={() => setShowCreateGroup(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                                  <X className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={createGroup}
                                  disabled={creatingGroup || !newGroupTitle.trim()}
                                  className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-100 disabled:opacity-50"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowCreateGroup(true)}
                              className="w-full flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                            >
                              <Plus className="w-5 h-5 text-gray-400" />
                              <span className="text-xs text-gray-400 font-medium">Creează grup</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Standalone Items */}
                  {((section.standaloneItems && section.standaloneItems.length > 0) || isAdmin) && (
                    <>
                      {section.groups && section.groups.length > 0 && (
                        <div className="border-t border-gray-100 my-4" />
                      )}

                      <div
                        className={cn(
                          'grid gap-x-6 gap-y-1',
                          (section.standaloneItems?.length || 0) >= 3 ? 'grid-cols-3' : 
                          (section.standaloneItems?.length || 0) >= 1 ? 'grid-cols-2' : 'grid-cols-1'
                        )}
                      >
                        {section.standaloneItems?.map((item) => {
                          const ItemIcon = item.icon;
                          const itemLabel = item.label || t(item.id);
                          return (
                            <Link
                              key={item.id + item.href}
                              href={item.href}
                              className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              {ItemIcon && (
                                <ItemIcon className="w-4 h-4 text-primary-600 group-hover:text-primary-700 shrink-0" />
                              )}
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                                {itemLabel}
                              </span>
                            </Link>
                          );
                        })}

                        {/* Admin: + Add page to standalone (altele) */}
                        {isAdmin && (
                          <Link
                            href="/admin/altele"
                            className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors group"
                          >
                            <Plus className="w-4 h-4 text-blue-400 group-hover:text-blue-600 shrink-0" />
                            <span className="text-xs text-blue-400 group-hover:text-blue-600 font-medium">
                              Adaugă
                            </span>
                          </Link>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Divider */}
      <div className="h-5 w-px bg-gray-300 mx-3" />

      {/* Secondary Navigation */}
      {SECONDARY_NAVIGATION.map((item) => {
        const Icon = secondaryIcons[item.id];
        return (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors whitespace-nowrap"
          >
            {Icon && <Icon className="w-4 h-4" />}
            {t(item.id)}
          </Link>
        );
      })}
    </nav>
  );
}
