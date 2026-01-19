'use client';

import { LogOut, User, Menu } from 'lucide-react';

interface AdminHeaderProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
  onMenuToggle?: () => void;
}

export function AdminHeader({ userName, userRole, onLogout, onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Deschide meniul"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Spacer for desktop */}
        <div className="hidden lg:block" />

        {/* User Info */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User info - hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-3 px-3 lg:px-4 py-2 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm lg:text-base font-medium text-slate-900">{userName}</p>
              <p className="text-xs lg:text-sm text-slate-500 capitalize">{userRole}</p>
            </div>
          </div>
          
          {/* Logout button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Deconectare</span>
          </button>
        </div>
      </div>
    </header>
  );
}
