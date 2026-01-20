'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase, AdminProfile } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        // Check if user has admin profile
        const { data: profile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single<AdminProfile>();

        if (profileError || !profile) {
          await supabase.auth.signOut();
          throw new Error('Nu aveți permisiuni de administrator.');
        }

        if (!profile.is_active) {
          await supabase.auth.signOut();
          throw new Error('Contul dumneavoastră a fost dezactivat.');
        }

        // Update last login
        await supabase
          .from('admin_profiles')
          .update({ last_login: new Date().toISOString() } as Partial<AdminProfile>)
          .eq('id', data.user.id);

        // Log the login action
        try {
          await fetch('/api/admin/auth/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'login',
              userId: data.user.id,
              userEmail: data.user.email,
              userName: profile.full_name,
            }),
          });
        } catch (logError) {
          console.warn('Failed to log login action:', logError);
        }

        // Redirect to admin panel
        router.push('/admin');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la autentificare');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 decorative-cross-pattern" />
      
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2">
            <Image
              src="/logo/logo-transparent.webp"
              alt="Primăria Salonta"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Primăria Salonta</h1>
          <p className="text-slate-400 mt-1">Panou de Administrare</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Adresa de email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="admin@salonta.ro"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Parola
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Se autentifică...
                </span>
              ) : (
                'Autentificare'
              )}
            </button>
          </form>

          {/* Back to Website */}
          <div className="mt-6 text-center">
            <a
              href="/ro"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              ← Înapoi la website
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          © {new Date().getFullYear()} Primăria Municipiului Salonta
        </p>
      </div>
    </div>
  );
}

