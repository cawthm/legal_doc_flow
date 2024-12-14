export interface SubscriptionData {
  subscriberInfo: {
    category: string | null;
    bankName: string;
    bankType: 'foreign' | 'domestic' | null;
    foreignCountry?: string;
    isCustomer: boolean | null;
  };
  employmentInfo: {
    employerName: string;
    isPubliclyTraded: boolean | null;
    industry: string;
    positionHeld: string;
    isSeniorExecutive: boolean | null;
    familyMember: {
      name: string;
      companyName: string;
      positionHeld: string;
    };
    isGovernmentEmployee: boolean | null;
  };
} 