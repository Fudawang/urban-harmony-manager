
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AssociationInfo {
  name: string;
  president: string;
  phone: string;
  email: string;
  address: string;
  foundingDate: string;
  unifiedNumber?: string;
}

interface AssociationContextType {
  associationInfo: AssociationInfo;
  updateAssociationInfo: (info: Partial<AssociationInfo>) => void;
}

const defaultAssociationInfo: AssociationInfo = {
  name: '台北市中山區第一都市更新會',
  president: '王大明',
  phone: '02-2345-6789',
  email: 'info@tpeurban1.org.tw',
  address: '台北市中山區中山北路二段100號5樓',
  foundingDate: '2022-03-15',
  unifiedNumber: '87654321'
};

const AssociationContext = createContext<AssociationContextType | undefined>(undefined);

export const useAssociation = () => {
  const context = useContext(AssociationContext);
  if (!context) {
    throw new Error('useAssociation must be used within an AssociationProvider');
  }
  return context;
};

export const AssociationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [associationInfo, setAssociationInfo] = useState<AssociationInfo>(defaultAssociationInfo);

  const updateAssociationInfo = (info: Partial<AssociationInfo>) => {
    setAssociationInfo(prevInfo => ({
      ...prevInfo,
      ...info
    }));
  };

  return (
    <AssociationContext.Provider value={{ associationInfo, updateAssociationInfo }}>
      {children}
    </AssociationContext.Provider>
  );
};
