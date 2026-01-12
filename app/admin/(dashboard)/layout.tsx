'use client';

import { useAdminAuth, AdminSidebar, AdminHeader, AdminToastContainer } from '@/components/admin';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-slate-600 mt-4 text-lg">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useAdminAuth
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader
          userName={user.fullName}
          userRole={user.role}
          onLogout={logout}
        />
        
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <AdminToastContainer />
    </div>
  );
}
