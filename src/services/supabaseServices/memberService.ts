
import { supabase } from "@/integrations/supabase/client";
import { PaginatedResponse } from "@/services/memberService";
import { Database } from "@/types/database.types";

export type SupabaseMember = Database['public']['Tables']['members']['Row'];

export type Member = {
  id: string;
  memberId: string;
  idNumber: string;
  name: string;
  city: string;
  district: string;
  section: string;
  subSection: string;
  landNumber: string;
  landShare: string;
  landArea: string;
  buildingNumber: string;
  buildingShare: string;
  buildingArea: string;
};

// Helper to convert Supabase response format to our Member format
const convertToMember = (data: SupabaseMember): Member => ({
  id: data.id,
  memberId: data.member_id,
  idNumber: data.id_number,
  name: data.name,
  city: data.city,
  district: data.district,
  section: data.section,
  subSection: data.sub_section,
  landNumber: data.land_number,
  landShare: data.land_share,
  landArea: data.land_area,
  buildingNumber: data.building_number,
  buildingShare: data.building_share,
  buildingArea: data.building_area
});

// Get available filters
export const getFilters = async (): Promise<{cities: string[], districts: {[key: string]: string[]}}> => {
  try {
    // Get all members to extract cities and districts
    const { data, error } = await supabase
      .from('members')
      .select('city, district');
    
    if (error) throw error;
    
    // Extract unique cities
    const cities = [...new Set(data.map(member => member.city))];
    
    // Extract districts per city
    const districts: {[key: string]: string[]} = {};
    cities.forEach(city => {
      districts[city] = [...new Set(
        data
          .filter(member => member.city === city)
          .map(member => member.district)
      )];
    });
    
    return { cities, districts };
  } catch (error) {
    console.error("Error fetching filters:", error);
    throw error;
  }
};

// Generate new member ID
export const generateMemberId = async (): Promise<string> => {
  try {
    // Get the count of existing members to determine the next ID
    const { count, error } = await supabase
      .from('members')
      .select('id', { count: 'exact', head: true });
    
    if (error) throw error;
    
    const nextId = (count || 0) + 1;
    return `M${nextId.toString().padStart(6, '0')}`;
  } catch (error) {
    console.error("Error generating member ID:", error);
    throw error;
  }
};

// Get all members with pagination
export const getAllMembers = async (
  page = 1, 
  pageSize = 20
): Promise<PaginatedResponse<Member>> => {
  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Get paginated data
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .range(from, to)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const total = count || 0;
    
    return {
      data: data.map(convertToMember),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

// Get member by ID
export const getMemberById = async (id: string): Promise<Member | undefined> => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return undefined;
    
    return convertToMember(data as SupabaseMember);
  } catch (error) {
    console.error("Error fetching member:", error);
    throw error;
  }
};

// Create new member
export const createMember = async (memberData: Omit<Member, 'id' | 'memberId'>): Promise<Member> => {
  try {
    // Generate new member ID
    const memberId = await generateMemberId();
    
    const { data, error } = await supabase
      .from('members')
      .insert({
        member_id: memberId,
        id_number: memberData.idNumber,
        name: memberData.name,
        city: memberData.city,
        district: memberData.district,
        section: memberData.section,
        sub_section: memberData.subSection,
        land_number: memberData.landNumber,
        land_share: memberData.landShare,
        land_area: memberData.landArea,
        building_number: memberData.buildingNumber,
        building_share: memberData.buildingShare,
        building_area: memberData.buildingArea
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return convertToMember(data as SupabaseMember);
  } catch (error) {
    console.error("Error creating member:", error);
    throw error;
  }
};

// Update member
export const updateMember = async (id: string, memberData: Omit<Member, 'id' | 'memberId'>): Promise<Member> => {
  try {
    const { data, error } = await supabase
      .from('members')
      .update({
        id_number: memberData.idNumber,
        name: memberData.name,
        city: memberData.city,
        district: memberData.district,
        section: memberData.section,
        sub_section: memberData.subSection,
        land_number: memberData.landNumber,
        land_share: memberData.landShare,
        land_area: memberData.landArea,
        building_number: memberData.buildingNumber,
        building_share: memberData.buildingShare,
        building_area: memberData.buildingArea
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return convertToMember(data as SupabaseMember);
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
};

// Delete member
export const deleteMember = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
};

// Search members with pagination, filtering and sorting
export const searchMembers = async (
  searchTerm = '', 
  filter: {city?: string, district?: string, section?: string} = {}, 
  page = 1, 
  pageSize = 20
): Promise<PaginatedResponse<Member>> => {
  try {
    let query = supabase.from('members').select('*', { count: 'exact' });
    
    // Apply filters
    if (filter.city) {
      query = query.eq('city', filter.city);
    }
    if (filter.district) {
      query = query.eq('district', filter.district);
    }
    if (filter.section) {
      query = query.eq('sub_section', filter.section);
    }
    
    // Apply search if provided
    if (searchTerm) {
      // Fix: Use a single string argument with comma-separated conditions
      query = query.or(`member_id.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,land_number.ilike.%${searchTerm}%,building_number.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,district.ilike.%${searchTerm}%`);
    }
    
    // Get total count for pagination
    const { count, error: countError } = await query.select('id', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Execute query with pagination
    const { data, error } = await query
      .range(from, to)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const total = count || 0;
    
    return {
      data: data.map(item => convertToMember(item as SupabaseMember)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error("Error searching members:", error);
    throw error;
  }
};
