'use client';

import { LogOut, User } from 'lucide-react';

interface AdminHeaderProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

export function AdminHeader({ userName, userRole, onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb area - can be extended */}
        <div>
          {/* Reserved for breadcrumbs */}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-base font-medium text-slate-900">{userName}</p>
              <p className="text-sm text-slate-500 capitalize">{userRole}</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-3 text-base font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Deconectare</span>
          </button>
        </div>
      </div>
    </header>
  );
}
