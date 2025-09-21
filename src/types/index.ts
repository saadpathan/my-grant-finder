// Business Profile Types
export interface BusinessProfile {
  id: string;
  companyName: string;
  registrationNumber?: string;
  establishedYear: string;
  industry: string;
  businessModel?: string;
  stage: string;
  employees: string;
  revenue: string;
  fundingPurpose: string[];
  fundingAmount: string;
  timeline: string;
  location: string;
  description: string;
  challenges?: string;
  createdAt: string;
  updatedAt: string;
}

// Grant Program Types
export interface GrantProgram {
  id: string;
  name: string;
  provider: string;
  type: 'Government Grant' | 'Bank Financing' | 'Special Scheme' | 'Private Funding';
  fundingAmount: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  applicationLink: string;
  deadline: string;
  processingTime: string;
  status: string;
  industry: string[];
  businessStage: string[];
  fundingPurpose: string[];
  minRevenue?: string;
  maxRevenue?: string;
  minEmployees?: string;
  maxEmployees?: string;
  location?: string[];
  createdAt: string;
  updatedAt: string;
}

// Match Result Types
export interface MatchResult {
  id: string;
  businessProfileId: string;
  grantProgramId: string;
  matchScore: number;
  reasons: string[];
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Database Operation Types
export interface CreateBusinessProfileRequest {
  companyName: string;
  registrationNumber?: string;
  establishedYear: string;
  industry: string;
  businessModel?: string;
  stage: string;
  employees: string;
  revenue: string;
  fundingPurpose: string[];
  fundingAmount: string;
  timeline: string;
  location: string;
  description: string;
  challenges?: string;
}

export interface UpdateBusinessProfileRequest extends Partial<CreateBusinessProfileRequest> {
  id: string;
}

export interface CreateGrantProgramRequest {
  name: string;
  provider: string;
  type: GrantProgram['type'];
  fundingAmount: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  applicationLink: string;
  deadline: string;
  processingTime: string;
  status: string;
  industry: string[];
  businessStage: string[];
  fundingPurpose: string[];
  minRevenue?: string;
  maxRevenue?: string;
  minEmployees?: string;
  maxEmployees?: string;
  location?: string[];
}

export interface MatchBusinessRequest {
  businessProfileId: string;
  industry: string;
  stage: string;
  employees: string;
  revenue: string;
  fundingPurpose: string[];
  fundingAmount: string;
  location: string;
}

