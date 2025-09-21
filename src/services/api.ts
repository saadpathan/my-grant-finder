import { 
  BusinessProfileService, 
  GrantProgramService, 
  MatchResultService, 
  MatchingService 
} from './dynamodb';
import { 
  BusinessProfile, 
  GrantProgram, 
  MatchResult, 
  ApiResponse,
  CreateBusinessProfileRequest,
  UpdateBusinessProfileRequest,
  CreateGrantProgramRequest,
  MatchBusinessRequest
} from '@/types';

// API Service Class
export class ApiService {
  // Business Profile APIs
  static async createBusinessProfile(data: CreateBusinessProfileRequest): Promise<ApiResponse<BusinessProfile>> {
    try {
      const businessProfile = await BusinessProfileService.create(data);
      return {
        success: true,
        data: businessProfile,
        message: 'Business profile created successfully',
      };
    } catch (error) {
      console.error('Error creating business profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create business profile',
      };
    }
  }

  static async getBusinessProfile(id: string): Promise<ApiResponse<BusinessProfile>> {
    try {
      const businessProfile = await BusinessProfileService.getById(id);
      if (!businessProfile) {
        return {
          success: false,
          error: 'Business profile not found',
        };
      }
      return {
        success: true,
        data: businessProfile,
      };
    } catch (error) {
      console.error('Error getting business profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get business profile',
      };
    }
  }

  static async updateBusinessProfile(id: string, data: Partial<CreateBusinessProfileRequest>): Promise<ApiResponse<BusinessProfile>> {
    try {
      const businessProfile = await BusinessProfileService.update(id, data);
      if (!businessProfile) {
        return {
          success: false,
          error: 'Business profile not found',
        };
      }
      return {
        success: true,
        data: businessProfile,
        message: 'Business profile updated successfully',
      };
    } catch (error) {
      console.error('Error updating business profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update business profile',
      };
    }
  }

  static async deleteBusinessProfile(id: string): Promise<ApiResponse<boolean>> {
    try {
      await BusinessProfileService.delete(id);
      return {
        success: true,
        data: true,
        message: 'Business profile deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting business profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete business profile',
      };
    }
  }

  static async getAllBusinessProfiles(): Promise<ApiResponse<BusinessProfile[]>> {
    try {
      const businessProfiles = await BusinessProfileService.getAll();
      return {
        success: true,
        data: businessProfiles,
      };
    } catch (error) {
      console.error('Error getting business profiles:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get business profiles',
      };
    }
  }

  // Grant Program APIs
  static async createGrantProgram(data: CreateGrantProgramRequest): Promise<ApiResponse<GrantProgram>> {
    try {
      const grantProgram = await GrantProgramService.create(data);
      return {
        success: true,
        data: grantProgram,
        message: 'Grant program created successfully',
      };
    } catch (error) {
      console.error('Error creating grant program:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create grant program',
      };
    }
  }

  static async getGrantProgram(id: string): Promise<ApiResponse<GrantProgram>> {
    try {
      const grantProgram = await GrantProgramService.getById(id);
      if (!grantProgram) {
        return {
          success: false,
          error: 'Grant program not found',
        };
      }
      return {
        success: true,
        data: grantProgram,
      };
    } catch (error) {
      console.error('Error getting grant program:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get grant program',
      };
    }
  }

  static async getAllGrantPrograms(): Promise<ApiResponse<GrantProgram[]>> {
    try {
      const grantPrograms = await GrantProgramService.getAll();
      return {
        success: true,
        data: grantPrograms,
      };
    } catch (error) {
      console.error('Error getting grant programs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get grant programs',
      };
    }
  }

  static async getGrantProgramsByIndustry(industry: string): Promise<ApiResponse<GrantProgram[]>> {
    try {
      const grantPrograms = await GrantProgramService.findByIndustry(industry);
      return {
        success: true,
        data: grantPrograms,
      };
    } catch (error) {
      console.error('Error getting grant programs by industry:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get grant programs by industry',
      };
    }
  }

  static async getGrantProgramsByBusinessStage(stage: string): Promise<ApiResponse<GrantProgram[]>> {
    try {
      const grantPrograms = await GrantProgramService.findByBusinessStage(stage);
      return {
        success: true,
        data: grantPrograms,
      };
    } catch (error) {
      console.error('Error getting grant programs by business stage:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get grant programs by business stage',
      };
    }
  }

  static async getGrantProgramsByFundingPurpose(purpose: string): Promise<ApiResponse<GrantProgram[]>> {
    try {
      const grantPrograms = await GrantProgramService.findByFundingPurpose(purpose);
      return {
        success: true,
        data: grantPrograms,
      };
    } catch (error) {
      console.error('Error getting grant programs by funding purpose:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get grant programs by funding purpose',
      };
    }
  }

  static async batchCreateGrantPrograms(programs: CreateGrantProgramRequest[]): Promise<ApiResponse<GrantProgram[]>> {
    try {
      const grantPrograms = await GrantProgramService.batchCreate(programs);
      return {
        success: true,
        data: grantPrograms,
        message: `${grantPrograms.length} grant programs created successfully`,
      };
    } catch (error) {
      console.error('Error batch creating grant programs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to batch create grant programs',
      };
    }
  }

  // Matching APIs
  static async findMatches(businessData: MatchBusinessRequest): Promise<ApiResponse<{ program: GrantProgram; matchScore: number; reasons: string[] }[]>> {
    try {
      const matches = await MatchingService.findMatches(businessData);
      return {
        success: true,
        data: matches,
        message: `Found ${matches.length} matching programs`,
      };
    } catch (error) {
      console.error('Error finding matches:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to find matches',
      };
    }
  }

  static async createMatch(businessProfileId: string, grantProgramId: string, matchScore: number, reasons: string[]): Promise<ApiResponse<MatchResult>> {
    try {
      const matchResult = await MatchResultService.createMatch(businessProfileId, grantProgramId, matchScore, reasons);
      return {
        success: true,
        data: matchResult,
        message: 'Match result created successfully',
      };
    } catch (error) {
      console.error('Error creating match result:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create match result',
      };
    }
  }

  static async getMatchesByBusinessProfile(businessProfileId: string): Promise<ApiResponse<MatchResult[]>> {
    try {
      const matches = await MatchResultService.getMatchesByBusinessProfile(businessProfileId);
      return {
        success: true,
        data: matches,
      };
    } catch (error) {
      console.error('Error getting matches by business profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get matches by business profile',
      };
    }
  }

  static async getMatchesByGrantProgram(grantProgramId: string): Promise<ApiResponse<MatchResult[]>> {
    try {
      const matches = await MatchResultService.getMatchesByGrantProgram(grantProgramId);
      return {
        success: true,
        data: matches,
      };
    } catch (error) {
      console.error('Error getting matches by grant program:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get matches by grant program',
      };
    }
  }

  // Utility method to seed initial data
  static async seedInitialData(): Promise<ApiResponse<{ businessProfiles: number; grantPrograms: number }>> {
    try {
      console.log('🌱 Starting data seeding process...');
      
      // Check if data already exists
      console.log('🔍 Checking for existing grant programs...');
      const existingPrograms = await GrantProgramService.getAll();
      console.log(`Found ${existingPrograms.length} existing programs`);
      
      if (existingPrograms.length > 0) {
        return {
          success: true,
          data: { businessProfiles: 0, grantPrograms: existingPrograms.length },
          message: 'Data already seeded',
        };
      }

      // Seed initial grant programs
      const initialPrograms: CreateGrantProgramRequest[] = [
        {
          name: "SME Digitalization Grant",
          provider: "Malaysia Digital Economy Corporation (MDEC)",
          type: "Government Grant",
          fundingAmount: "Up to RM 50,000",
          description: "Funding to help SMEs adopt digital technologies and improve operational efficiency through digitalization initiatives.",
          eligibility: [
            "Malaysian-owned SME with at least 51% local shareholding",
            "Annual sales turnover between RM 300,000 to RM 20 million",
            "Valid SSM registration",
            "Minimum 1 year in operation"
          ],
          benefits: [
            "Up to 70% co-funding for digital adoption",
            "Technical consultation and support",
            "Access to certified digital solution providers",
            "Post-implementation monitoring and support"
          ],
          applicationLink: "https://www.mdec.my/what-we-offer/grants-programs/sme-digitalization-grant/",
          deadline: "31 December 2024",
          processingTime: "8-12 weeks",
          status: "Open for Applications",
          industry: ["Technology & IT", "Manufacturing", "Retail & E-commerce", "Food & Beverage", "Healthcare", "Education"],
          businessStage: ["Startup (0-2 years)", "Early Growth (2-5 years)", "Expansion (5+ years)"],
          fundingPurpose: ["Digital Transformation", "Equipment Purchase", "Working Capital"],
          minRevenue: "300k-3m",
          maxRevenue: "3m-20m",
          minEmployees: "1-5",
          maxEmployees: "76-200",
          location: ["Kuala Lumpur", "Selangor", "Penang", "Johor"]
        },
        {
          name: "SME Bank Micro Financing Scheme",
          provider: "SME Bank",
          type: "Bank Financing",
          fundingAmount: "RM 5,000 - RM 50,000",
          description: "Micro financing scheme designed to provide easy access to funding for micro enterprises and small businesses.",
          eligibility: [
            "Malaysian citizen aged 18 and above",
            "Valid business registration (SSM/Local Council)",
            "Business operational for at least 6 months",
            "Good credit standing"
          ],
          benefits: [
            "Competitive profit rates starting from 6% per annum",
            "Flexible repayment period up to 5 years",
            "Minimal documentation required",
            "Quick approval process"
          ],
          applicationLink: "https://www.smebank.com.my/financing/micro-financing",
          deadline: "Ongoing",
          processingTime: "2-4 weeks",
          status: "Always Available",
          industry: ["Technology & IT", "Manufacturing", "Retail & E-commerce", "Food & Beverage", "Healthcare", "Education", "Agriculture", "Construction"],
          businessStage: ["Idea Stage", "Startup (0-2 years)", "Early Growth (2-5 years)"],
          fundingPurpose: ["Working Capital", "Equipment Purchase", "Market Expansion"],
          minRevenue: "<300k",
          maxRevenue: "300k-3m",
          minEmployees: "1-5",
          maxEmployees: "6-30"
        },
        {
          name: "Bumiputera Entrepreneur Development Scheme",
          provider: "SME Corporation Malaysia",
          type: "Special Scheme",
          fundingAmount: "Up to RM 500,000",
          description: "Comprehensive development program for Bumiputera entrepreneurs including funding, training, and business development support.",
          eligibility: [
            "100% Bumiputera-owned business",
            "SME classification based on SME Corp definition",
            "Business plan and feasibility study required",
            "Attended entrepreneur development program"
          ],
          benefits: [
            "Soft loan with subsidized interest rate",
            "Business advisory and mentoring services",
            "Market linkage opportunities",
            "Capacity building programs"
          ],
          applicationLink: "https://www.smecorp.gov.my/index.php/en/programmes/financial-assistance",
          deadline: "Quarterly intake",
          processingTime: "12-16 weeks",
          status: "Next Intake: Q1 2024",
          industry: ["Technology & IT", "Manufacturing", "Retail & E-commerce", "Food & Beverage", "Healthcare", "Education", "Agriculture", "Construction", "Financial Services"],
          businessStage: ["Startup (0-2 years)", "Early Growth (2-5 years)", "Expansion (5+ years)"],
          fundingPurpose: ["Research & Development", "Equipment Purchase", "Working Capital", "Market Expansion", "Digital Transformation"],
          minRevenue: "300k-3m",
          maxRevenue: "3m-20m",
          minEmployees: "6-30",
          maxEmployees: "76-200"
        }
      ];

      console.log('📝 Creating initial grant programs...');
      const createdPrograms = await GrantProgramService.batchCreate(initialPrograms);
      console.log(`✅ Successfully created ${createdPrograms.length} grant programs`);

      return {
        success: true,
        data: { businessProfiles: 0, grantPrograms: createdPrograms.length },
        message: `Successfully seeded ${createdPrograms.length} grant programs`,
      };
    } catch (error) {
      console.error('❌ Error seeding initial data:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to seed initial data',
      };
    }
  }
}

