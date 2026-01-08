import { createAnonServerClient } from '../server';

export interface StaffMember {
  id: string;
  position_type: 'primar' | 'viceprimar' | 'secretar' | 'administrator' | 'director' | 'sef_serviciu' | 'altele';
  name: string;
  photo_url: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  reception_hours: string | null;
  responsibilities: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouncilMember {
  id: string;
  name: string;
  party: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  mandate_start: string | null;
  mandate_end: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  commissions?: CouncilCommission[];
}

export interface CouncilCommission {
  id: string;
  name: string;
  description: string | null;
  commission_number: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  members?: CouncilMember[];
}

/**
 * Get all active staff members (leadership)
 */
export async function getStaffMembers(): Promise<StaffMember[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('staff_members')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching staff members:', error);
    return [];
  }

  return data || [];
}

/**
 * Get staff members by position type
 */
export async function getStaffByPosition(positionType: StaffMember['position_type']): Promise<StaffMember[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('staff_members')
    .select('*')
    .eq('is_active', true)
    .eq('position_type', positionType)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching staff by position:', error);
    return [];
  }

  return data || [];
}

/**
 * Get leadership (primar, viceprimar, secretar)
 */
export async function getLeadership(): Promise<StaffMember[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('staff_members')
    .select('*')
    .eq('is_active', true)
    .in('position_type', ['primar', 'viceprimar', 'secretar', 'administrator'])
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching leadership:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all active council members
 */
export async function getCouncilMembers(): Promise<CouncilMember[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('council_members')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching council members:', error);
    return [];
  }

  return data || [];
}

/**
 * Get council members with their commissions
 */
export async function getCouncilMembersWithCommissions(): Promise<CouncilMember[]> {
  const supabase = createAnonServerClient();

  // Get members
  const { data: members, error: membersError } = await supabase
    .from('council_members')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (membersError || !members) {
    console.error('Error fetching council members:', membersError);
    return [];
  }

  // Get member-commission relationships
  const { data: relationships } = await supabase
    .from('council_member_commissions')
    .select('member_id, commission_id, role');

  // Get commissions
  const { data: commissions } = await supabase
    .from('council_commissions')
    .select('*')
    .eq('is_active', true);

  // Map commissions to members
  return members.map(member => ({
    ...member,
    commissions: relationships
      ?.filter(r => r.member_id === member.id)
      .map(r => commissions?.find(c => c.id === r.commission_id))
      .filter(Boolean) as CouncilCommission[] || [],
  }));
}

/**
 * Get all active council commissions
 */
export async function getCouncilCommissions(): Promise<CouncilCommission[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('council_commissions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching council commissions:', error);
    return [];
  }

  return data || [];
}

/**
 * Get council commissions with members
 */
export async function getCouncilCommissionsWithMembers(): Promise<CouncilCommission[]> {
  const supabase = createAnonServerClient();

  // Get commissions
  const { data: commissions, error: commissionsError } = await supabase
    .from('council_commissions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (commissionsError || !commissions) {
    console.error('Error fetching commissions:', commissionsError);
    return [];
  }

  // Get relationships
  const { data: relationships } = await supabase
    .from('council_member_commissions')
    .select('member_id, commission_id, role');

  // Get members
  const { data: members } = await supabase
    .from('council_members')
    .select('*')
    .eq('is_active', true);

  // Map members to commissions
  return commissions.map(commission => ({
    ...commission,
    members: relationships
      ?.filter(r => r.commission_id === commission.id)
      .map(r => members?.find(m => m.id === r.member_id))
      .filter(Boolean) as CouncilMember[] || [],
  }));
}
