/**
 * Database types for Supabase
 * Generated based on the schema in supabase/migrations/001_initial_schema.sql
 */

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          id: string;
          full_name: string;
          role: 'super_admin' | 'admin' | 'editor' | 'viewer';
          department: string | null;
          phone: string | null;
          avatar_url: string | null;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: 'super_admin' | 'admin' | 'editor' | 'viewer';
          department?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login?: string | null;
        };
        Update: Partial<Database['public']['Tables']['admin_profiles']['Insert']>;
      };
      
      council_sessions: {
        Row: {
          id: string;
          slug: string;
          session_date: string;
          session_type: 'ordinara' | 'extraordinara' | 'solemnă';
          title_ro: string;
          title_hu: string | null;
          title_en: string | null;
          description_ro: string | null;
          description_hu: string | null;
          description_en: string | null;
          location_ro: string;
          location_hu: string | null;
          location_en: string | null;
          start_time: string | null;
          end_time: string | null;
          attendance_count: number | null;
          source_url: string | null;
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          published: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          slug: string;
          session_date: string;
          title_ro: string;
          session_type?: 'ordinara' | 'extraordinara' | 'solemnă';
          title_hu?: string | null;
          title_en?: string | null;
          description_ro?: string | null;
          description_hu?: string | null;
          description_en?: string | null;
          location_ro?: string;
          location_hu?: string | null;
          location_en?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          attendance_count?: number | null;
          source_url?: string | null;
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          published?: boolean;
        };
        Update: Partial<Database['public']['Tables']['council_sessions']['Insert']>;
      };
      
      council_decisions: {
        Row: {
          id: string;
          slug: string;
          decision_number: number;
          decision_date: string;
          year: number;
          session_id: string | null;
          session_date: string | null;
          title_ro: string;
          title_hu: string | null;
          title_en: string | null;
          summary_ro: string | null;
          summary_hu: string | null;
          summary_en: string | null;
          category: string | null;
          status: 'in_vigoare' | 'abrogata' | 'modificata';
          published: boolean;
          source_url: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          slug: string;
          decision_number: number;
          decision_date: string;
          title_ro: string;
          session_id?: string | null;
          session_date?: string | null;
          title_hu?: string | null;
          title_en?: string | null;
          summary_ro?: string | null;
          summary_hu?: string | null;
          summary_en?: string | null;
          category?: string | null;
          status?: 'in_vigoare' | 'abrogata' | 'modificata';
          published?: boolean;
          source_url?: string | null;
        };
        Update: Partial<Database['public']['Tables']['council_decisions']['Insert']>;
      };
      
      news: {
        Row: {
          id: string;
          slug: string;
          category: 'anunturi' | 'stiri' | 'comunicate' | 'proiecte' | 'consiliu';
          title_ro: string;
          title_hu: string | null;
          title_en: string | null;
          excerpt_ro: string | null;
          excerpt_hu: string | null;
          excerpt_en: string | null;
          content_ro: string | null;
          content_hu: string | null;
          content_en: string | null;
          featured_image: string | null;
          published: boolean;
          published_at: string | null;
          featured: boolean;
          view_count: number;
          source_url: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          slug: string;
          category: 'anunturi' | 'stiri' | 'comunicate' | 'proiecte' | 'consiliu';
          title_ro: string;
          title_hu?: string | null;
          title_en?: string | null;
          excerpt_ro?: string | null;
          excerpt_hu?: string | null;
          excerpt_en?: string | null;
          content_ro?: string | null;
          content_hu?: string | null;
          content_en?: string | null;
          featured_image?: string | null;
          published?: boolean;
          published_at?: string | null;
          featured?: boolean;
          source_url?: string | null;
        };
        Update: Partial<Database['public']['Tables']['news']['Insert']>;
      };
      
      events: {
        Row: {
          id: string;
          slug: string;
          event_type: 'cultural' | 'sportiv' | 'civic' | 'educational' | 'administrativ' | 'festival' | 'altele';
          start_date: string;
          end_date: string | null;
          start_time: string | null;
          end_time: string | null;
          is_all_day: boolean;
          location_ro: string | null;
          location_hu: string | null;
          location_en: string | null;
          location_address: string | null;
          location_lat: number | null;
          location_lng: number | null;
          title_ro: string;
          title_hu: string | null;
          title_en: string | null;
          description_ro: string | null;
          description_hu: string | null;
          description_en: string | null;
          program_ro: string | null;
          program_hu: string | null;
          program_en: string | null;
          featured_image: string | null;
          poster_image: string | null;
          published: boolean;
          featured: boolean;
          source_url: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          slug: string;
          start_date: string;
          title_ro: string;
          event_type?: 'cultural' | 'sportiv' | 'civic' | 'educational' | 'administrativ' | 'festival' | 'altele';
          end_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          is_all_day?: boolean;
          location_ro?: string | null;
          location_hu?: string | null;
          location_en?: string | null;
          location_address?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          title_hu?: string | null;
          title_en?: string | null;
          description_ro?: string | null;
          description_hu?: string | null;
          description_en?: string | null;
          program_ro?: string | null;
          program_hu?: string | null;
          program_en?: string | null;
          featured_image?: string | null;
          poster_image?: string | null;
          published?: boolean;
          featured?: boolean;
          source_url?: string | null;
        };
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      
      documents: {
        Row: {
          id: string;
          category: string;
          subcategory: string | null;
          file_url: string;
          file_name: string;
          file_size: number | null;
          mime_type: string;
          title_ro: string;
          title_hu: string | null;
          title_en: string | null;
          description_ro: string | null;
          description_hu: string | null;
          description_en: string | null;
          document_date: string | null;
          year: number | null;
          published: boolean;
          source_url: string | null;
          source_folder: string | null;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          category: string;
          file_url: string;
          file_name: string;
          title_ro: string;
          subcategory?: string | null;
          file_size?: number | null;
          mime_type?: string;
          title_hu?: string | null;
          title_en?: string | null;
          description_ro?: string | null;
          description_hu?: string | null;
          description_en?: string | null;
          document_date?: string | null;
          year?: number | null;
          published?: boolean;
          source_url?: string | null;
          source_folder?: string | null;
          parent_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
      
      programs: {
        Row: {
          id: string;
          slug: string;
          program_type: string;
          smis_code: string | null;
          project_code: string | null;
          title_ro: string;
          title_hu: string | null;
          title_en: string | null;
          description_ro: string | null;
          description_hu: string | null;
          description_en: string | null;
          total_value: number | null;
          eu_funding: number | null;
          local_funding: number | null;
          currency: string;
          start_date: string | null;
          end_date: string | null;
          status: 'planificat' | 'in_derulare' | 'finalizat' | 'suspendat' | 'anulat';
          progress_percentage: number;
          featured_image: string | null;
          published: boolean;
          source_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          program_type: string;
          title_ro: string;
          smis_code?: string | null;
          project_code?: string | null;
          title_hu?: string | null;
          title_en?: string | null;
          description_ro?: string | null;
          description_hu?: string | null;
          description_en?: string | null;
          total_value?: number | null;
          eu_funding?: number | null;
          local_funding?: number | null;
          currency?: string;
          start_date?: string | null;
          end_date?: string | null;
          status?: 'planificat' | 'in_derulare' | 'finalizat' | 'suspendat' | 'anulat';
          progress_percentage?: number;
          featured_image?: string | null;
          published?: boolean;
          source_url?: string | null;
        };
        Update: Partial<Database['public']['Tables']['programs']['Insert']>;
      };
      
      job_vacancies: {
        Row: {
          id: string;
          slug: string;
          position_ro: string;
          position_hu: string | null;
          position_en: string | null;
          department_ro: string | null;
          department_hu: string | null;
          department_en: string | null;
          requirements_ro: string | null;
          requirements_hu: string | null;
          requirements_en: string | null;
          description_ro: string | null;
          description_hu: string | null;
          description_en: string | null;
          application_deadline: string | null;
          exam_date: string | null;
          published_at: string | null;
          status: 'activ' | 'in_desfasurare' | 'finalizat' | 'anulat';
          contact_person: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          source_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          position_ro: string;
          position_hu?: string | null;
          position_en?: string | null;
          department_ro?: string | null;
          department_hu?: string | null;
          department_en?: string | null;
          requirements_ro?: string | null;
          requirements_hu?: string | null;
          requirements_en?: string | null;
          description_ro?: string | null;
          description_hu?: string | null;
          description_en?: string | null;
          application_deadline?: string | null;
          exam_date?: string | null;
          published_at?: string | null;
          status?: 'activ' | 'in_desfasurare' | 'finalizat' | 'anulat';
          contact_person?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          source_url?: string | null;
        };
        Update: Partial<Database['public']['Tables']['job_vacancies']['Insert']>;
      };
      
      reports: {
        Row: {
          id: string;
          slug: string;
          report_type: string;
          title_ro: string;
          title_hu: string | null;
          title_en: string | null;
          summary_ro: string | null;
          summary_hu: string | null;
          summary_en: string | null;
          report_year: number | null;
          report_date: string | null;
          author: string | null;
          file_url: string;
          file_name: string;
          published: boolean;
          source_url: string | null;
          created_at: string;
        };
        Insert: {
          slug: string;
          report_type: string;
          title_ro: string;
          file_url: string;
          file_name: string;
          title_hu?: string | null;
          title_en?: string | null;
          summary_ro?: string | null;
          summary_hu?: string | null;
          summary_en?: string | null;
          report_year?: number | null;
          report_date?: string | null;
          author?: string | null;
          published?: boolean;
          source_url?: string | null;
        };
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          status: 'new' | 'read' | 'replied' | 'archived';
          replied_at: string | null;
          replied_by: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          subject: string;
          message: string;
          phone?: string | null;
          status?: 'new' | 'read' | 'replied' | 'archived';
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>;
      };
      
      petitions: {
        Row: {
          id: string;
          registration_number: string | null;
          name: string;
          email: string;
          phone: string | null;
          address: string | null;
          subject: string;
          content: string;
          attachments: unknown;
          status: 'inregistrata' | 'in_lucru' | 'solutionata' | 'respinsa' | 'redirectionata';
          response: string | null;
          responded_at: string | null;
          responded_by: string | null;
          deadline: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          subject: string;
          content: string;
          registration_number?: string | null;
          phone?: string | null;
          address?: string | null;
          attachments?: unknown;
          status?: 'inregistrata' | 'in_lucru' | 'solutionata' | 'respinsa' | 'redirectionata';
          response?: string | null;
          deadline?: string | null;
        };
        Update: Partial<Database['public']['Tables']['petitions']['Insert']>;
      };
    };
    
    Views: {
      v_latest_news: {
        Row: {
          id: string;
          slug: string;
          category: string;
          title_ro: string;
          title_hu: string | null;
          title_en: string | null;
          excerpt_ro: string | null;
          excerpt_hu: string | null;
          excerpt_en: string | null;
          featured_image: string | null;
          published_at: string | null;
          featured: boolean;
        };
      };
      v_upcoming_events: {
        Row: {
          id: string;
          slug: string;
          event_type: string;
          start_date: string;
          end_date: string | null;
          title_ro: string;
          title_hu: string | null;
          title_en: string | null;
          location_ro: string | null;
          location_hu: string | null;
          location_en: string | null;
          featured_image: string | null;
        };
      };
    };
    
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];

