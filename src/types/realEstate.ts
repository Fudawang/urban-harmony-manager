
export type OwnershipType = '單一所有權' | '共同持分' | '分別持分';

export interface RealEstateOwner {
  id: string;
  name: string;
  idNumber: string; // 身分證字號或統一編號
  contactInfo: string;
  ownershipType: OwnershipType;
  ownershipRatio?: string; // 持分比例，如 "1/2", "30%"
  notes?: string;
}

export type PropertyType = '土地' | '建物' | '土地及建物';
export type PropertyStatus = '更新前' | '更新後' | '其他';

export interface RealEstateProperty {
  id: string;
  address: string;
  type: PropertyType;
  area: number;  // in square meters
  ownerCount: number;
  district: string;
  section: string;
  number: string;
  status: PropertyStatus;
  lastUpdated: string;
}

// Member property ownership records
export interface MemberPropertyOwnership {
  id: string;
  memberId: string;
  propertyId: string;
  propertyType: PropertyType;
  ownershipType: OwnershipType;
  ownershipRatio: string;
  notes?: string;
}
