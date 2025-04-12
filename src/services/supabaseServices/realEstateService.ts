
import { supabase } from "@/integrations/supabase/client";
import { PropertyType, PropertyStatus, RealEstateProperty, RealEstateOwner, OwnershipType } from "@/types/realEstate";
import { Database } from "@/types/database.types";

// Real Estate Properties Functions
export const getProperties = async (): Promise<RealEstateProperty[]> => {
  try {
    const { data, error } = await supabase
      .from('real_estate_properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      address: item.address,
      type: item.type as PropertyType,
      area: Number(item.area),
      ownerCount: item.owner_count,
      district: item.district,
      section: item.section,
      number: item.number,
      status: item.status as PropertyStatus,
      lastUpdated: new Date(item.last_updated || Date.now()).toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

export const getPropertyById = async (id: string): Promise<RealEstateProperty | null> => {
  try {
    const { data, error } = await supabase
      .from('real_estate_properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      address: data.address,
      type: data.type as PropertyType,
      area: Number(data.area),
      ownerCount: data.owner_count,
      district: data.district,
      section: data.section,
      number: data.number,
      status: data.status as PropertyStatus,
      lastUpdated: new Date(data.last_updated || Date.now()).toISOString().split('T')[0]
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    throw error;
  }
};

export const createProperty = async (property: Omit<RealEstateProperty, 'id' | 'lastUpdated'>): Promise<RealEstateProperty> => {
  try {
    const { data, error } = await supabase
      .from('real_estate_properties')
      .insert({
        address: property.address,
        type: property.type,
        area: property.area,
        owner_count: property.ownerCount,
        district: property.district,
        section: property.section,
        number: property.number,
        status: property.status,
        last_updated: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      address: data.address,
      type: data.type as PropertyType,
      area: Number(data.area),
      ownerCount: data.owner_count,
      district: data.district,
      section: data.section,
      number: data.number,
      status: data.status as PropertyStatus,
      lastUpdated: new Date(data.last_updated || Date.now()).toISOString().split('T')[0]
    };
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const updateProperty = async (id: string, property: Omit<RealEstateProperty, 'id' | 'lastUpdated'>): Promise<RealEstateProperty> => {
  try {
    const { data, error } = await supabase
      .from('real_estate_properties')
      .update({
        address: property.address,
        type: property.type,
        area: property.area,
        owner_count: property.ownerCount,
        district: property.district,
        section: property.section,
        number: property.number,
        status: property.status,
        last_updated: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      address: data.address,
      type: data.type as PropertyType,
      area: Number(data.area),
      ownerCount: data.owner_count,
      district: data.district,
      section: data.section,
      number: data.number,
      status: data.status as PropertyStatus,
      lastUpdated: new Date(data.last_updated || Date.now()).toISOString().split('T')[0]
    };
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};

export const deleteProperty = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('real_estate_properties')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

// Real Estate Owners Functions
export const getOwners = async (): Promise<RealEstateOwner[]> => {
  try {
    const { data, error } = await supabase
      .from('real_estate_owners')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      idNumber: item.id_number,
      contactInfo: item.contact_info,
      ownershipType: item.ownership_type as OwnershipType,
      ownershipRatio: item.ownership_ratio || undefined,
      notes: item.notes || undefined
    }));
  } catch (error) {
    console.error("Error fetching owners:", error);
    throw error;
  }
};

export const getOwnerById = async (id: string): Promise<RealEstateOwner | null> => {
  try {
    const { data, error } = await supabase
      .from('real_estate_owners')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      idNumber: data.id_number,
      contactInfo: data.contact_info,
      ownershipType: data.ownership_type as OwnershipType,
      ownershipRatio: data.ownership_ratio || undefined,
      notes: data.notes || undefined
    };
  } catch (error) {
    console.error("Error fetching owner:", error);
    throw error;
  }
};

export const createOwner = async (owner: Omit<RealEstateOwner, 'id'>): Promise<RealEstateOwner> => {
  try {
    const { data, error } = await supabase
      .from('real_estate_owners')
      .insert({
        name: owner.name,
        id_number: owner.idNumber,
        contact_info: owner.contactInfo,
        ownership_type: owner.ownershipType,
        ownership_ratio: owner.ownershipRatio,
        notes: owner.notes
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      idNumber: data.id_number,
      contactInfo: data.contact_info,
      ownershipType: data.ownership_type as OwnershipType,
      ownershipRatio: data.ownership_ratio || undefined,
      notes: data.notes || undefined
    };
  } catch (error) {
    console.error("Error creating owner:", error);
    throw error;
  }
};

export const updateOwner = async (id: string, owner: Omit<RealEstateOwner, 'id'>): Promise<RealEstateOwner> => {
  try {
    const { data, error } = await supabase
      .from('real_estate_owners')
      .update({
        name: owner.name,
        id_number: owner.idNumber,
        contact_info: owner.contactInfo,
        ownership_type: owner.ownershipType,
        ownership_ratio: owner.ownershipRatio,
        notes: owner.notes
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      idNumber: data.id_number,
      contactInfo: data.contact_info,
      ownershipType: data.ownership_type as OwnershipType,
      ownershipRatio: data.ownership_ratio || undefined,
      notes: data.notes || undefined
    };
  } catch (error) {
    console.error("Error updating owner:", error);
    throw error;
  }
};

export const deleteOwner = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('real_estate_owners')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting owner:", error);
    throw error;
  }
};
