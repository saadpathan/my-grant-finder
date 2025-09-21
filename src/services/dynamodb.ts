import { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  ScanCommand,
  QueryCommand,
  BatchWriteCommand
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES } from '@/config/aws';
import { v4 as uuidv4 } from 'uuid';
import { 
  BusinessProfile, 
  GrantProgram, 
  MatchResult, 
  CreateBusinessProfileRequest,
  UpdateBusinessProfileRequest,
  CreateGrantProgramRequest,
  MatchBusinessRequest
} from '@/types';

// Business Profile Operations
export class BusinessProfileService {
  static async create(data: CreateBusinessProfileRequest): Promise<BusinessProfile> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const businessProfile: BusinessProfile = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.BUSINESS_PROFILES,
      Item: businessProfile,
    }));

    return businessProfile;
  }

  static async getById(id: string): Promise<BusinessProfile | null> {
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.BUSINESS_PROFILES,
      Key: { id },
    }));

    return result.Item as BusinessProfile || null;
  }

  static async update(id: string, data: Partial<CreateBusinessProfileRequest>): Promise<BusinessProfile | null> {
    const updateExpression = 'SET updatedAt = :updatedAt';
    const expressionAttributeValues: any = {
      ':updatedAt': new Date().toISOString(),
    };

    // Build dynamic update expression
    const updateFields = Object.keys(data).filter(key => key !== 'id');
    updateFields.forEach((key, index) => {
      updateExpression += `, ${key} = :val${index}`;
      expressionAttributeValues[`:val${index}`] = data[key as keyof CreateBusinessProfileRequest];
    });

    await docClient.send(new UpdateCommand({
      TableName: TABLES.BUSINESS_PROFILES,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }));

    return this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    await docClient.send(new DeleteCommand({
      TableName: TABLES.BUSINESS_PROFILES,
      Key: { id },
    }));

    return true;
  }

  static async getAll(): Promise<BusinessProfile[]> {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.BUSINESS_PROFILES,
    }));

    return result.Items as BusinessProfile[] || [];
  }
}

// Grant Program Operations
export class GrantProgramService {
  static async create(data: CreateGrantProgramRequest): Promise<GrantProgram> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const grantProgram: GrantProgram = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.GRANT_PROGRAMS,
      Item: grantProgram,
    }));

    return grantProgram;
  }

  static async getById(id: string): Promise<GrantProgram | null> {
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.GRANT_PROGRAMS,
      Key: { id },
    }));

    return result.Item as GrantProgram || null;
  }

  static async getAll(): Promise<GrantProgram[]> {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.GRANT_PROGRAMS,
    }));

    return result.Items as GrantProgram[] || [];
  }

  static async findByIndustry(industry: string): Promise<GrantProgram[]> {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.GRANT_PROGRAMS,
      FilterExpression: 'contains(industry, :industry)',
      ExpressionAttributeValues: {
        ':industry': industry,
      },
    }));

    return result.Items as GrantProgram[] || [];
  }

  static async findByBusinessStage(stage: string): Promise<GrantProgram[]> {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.GRANT_PROGRAMS,
      FilterExpression: 'contains(businessStage, :stage)',
      ExpressionAttributeValues: {
        ':stage': stage,
      },
    }));

    return result.Items as GrantProgram[] || [];
  }

  static async findByFundingPurpose(purpose: string): Promise<GrantProgram[]> {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.GRANT_PROGRAMS,
      FilterExpression: 'contains(fundingPurpose, :purpose)',
      ExpressionAttributeValues: {
        ':purpose': purpose,
      },
    }));

    return result.Items as GrantProgram[] || [];
  }

  static async batchCreate(programs: CreateGrantProgramRequest[]): Promise<GrantProgram[]> {
    const createdPrograms: GrantProgram[] = [];
    
    // Process in batches of 25 (DynamoDB limit)
    for (let i = 0; i < programs.length; i += 25) {
      const batch = programs.slice(i, i + 25);
      const putRequests = batch.map(program => ({
        PutRequest: {
          Item: {
            id: uuidv4(),
            ...program,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as GrantProgram,
        },
      }));

      await docClient.send(new BatchWriteCommand({
        RequestItems: {
          [TABLES.GRANT_PROGRAMS]: putRequests,
        },
      }));

      // Add to created programs
      putRequests.forEach(request => {
        createdPrograms.push(request.PutRequest.Item as GrantProgram);
      });
    }

    return createdPrograms;
  }
}

// Match Result Operations
export class MatchResultService {
  static async createMatch(businessProfileId: string, grantProgramId: string, matchScore: number, reasons: string[]): Promise<MatchResult> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const matchResult: MatchResult = {
      id,
      businessProfileId,
      grantProgramId,
      matchScore,
      reasons,
      createdAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.MATCH_RESULTS,
      Item: matchResult,
    }));

    return matchResult;
  }

  static async getMatchesByBusinessProfile(businessProfileId: string): Promise<MatchResult[]> {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLES.MATCH_RESULTS,
      IndexName: 'BusinessProfileIndex', // You'll need to create this GSI
      KeyConditionExpression: 'businessProfileId = :businessProfileId',
      ExpressionAttributeValues: {
        ':businessProfileId': businessProfileId,
      },
    }));

    return result.Items as MatchResult[] || [];
  }

  static async getMatchesByGrantProgram(grantProgramId: string): Promise<MatchResult[]> {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLES.MATCH_RESULTS,
      IndexName: 'GrantProgramIndex', // You'll need to create this GSI
      KeyConditionExpression: 'grantProgramId = :grantProgramId',
      ExpressionAttributeValues: {
        ':grantProgramId': grantProgramId,
      },
    }));

    return result.Items as MatchResult[] || [];
  }
}

// Matching Algorithm Service
export class MatchingService {
  static async findMatches(businessData: MatchBusinessRequest): Promise<{ program: GrantProgram; matchScore: number; reasons: string[] }[]> {
    // Get all grant programs
    const allPrograms = await GrantProgramService.getAll();
    
    // Calculate matches
    const matches = allPrograms.map(program => {
      const matchResult = this.calculateMatch(businessData, program);
      return {
        program,
        matchScore: matchResult.score,
        reasons: matchResult.reasons,
      };
    });

    // Filter matches with score > 0 and sort by score
    return matches
      .filter(match => match.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  private static calculateMatch(businessData: MatchBusinessRequest, program: GrantProgram): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Industry match (40% weight)
    if (program.industry.includes(businessData.industry)) {
      score += 40;
      reasons.push(`Industry match: ${businessData.industry}`);
    }

    // Business stage match (25% weight)
    if (program.businessStage.includes(businessData.stage)) {
      score += 25;
      reasons.push(`Business stage match: ${businessData.stage}`);
    }

    // Funding purpose match (20% weight)
    const purposeMatches = businessData.fundingPurpose.filter(purpose => 
      program.fundingPurpose.includes(purpose)
    ).length;
    if (purposeMatches > 0) {
      const purposeScore = (purposeMatches / businessData.fundingPurpose.length) * 20;
      score += purposeScore;
      reasons.push(`Funding purpose match: ${purposeMatches}/${businessData.fundingPurpose.length} purposes`);
    }

    // Revenue range match (10% weight)
    if (this.isRevenueInRange(businessData.revenue, program.minRevenue, program.maxRevenue)) {
      score += 10;
      reasons.push('Revenue range match');
    }

    // Employee count match (5% weight)
    if (this.isEmployeeCountInRange(businessData.employees, program.minEmployees, program.maxEmployees)) {
      score += 5;
      reasons.push('Employee count match');
    }

    return { score: Math.round(score), reasons };
  }

  private static isRevenueInRange(businessRevenue: string, minRevenue?: string, maxRevenue?: string): boolean {
    if (!minRevenue && !maxRevenue) return true;
    
    const revenueMap: { [key: string]: number } = {
      '<300k': 300000,
      '300k-3m': 1500000,
      '3m-20m': 11500000,
      '20m-50m': 35000000,
      '50m+': 50000000,
    };

    const businessRev = revenueMap[businessRevenue] || 0;
    const minRev = minRevenue ? revenueMap[minRevenue] || 0 : 0;
    const maxRev = maxRevenue ? revenueMap[maxRevenue] || Infinity : Infinity;

    return businessRev >= minRev && businessRev <= maxRev;
  }

  private static isEmployeeCountInRange(businessEmployees: string, minEmployees?: string, maxEmployees?: string): boolean {
    if (!minEmployees && !maxEmployees) return true;
    
    const employeeMap: { [key: string]: number } = {
      '1-5': 3,
      '6-30': 18,
      '31-75': 53,
      '76-200': 138,
      '200+': 200,
    };

    const businessEmp = employeeMap[businessEmployees] || 0;
    const minEmp = minEmployees ? employeeMap[minEmployees] || 0 : 0;
    const maxEmp = maxEmployees ? employeeMap[maxEmployees] || Infinity : Infinity;

    return businessEmp >= minEmp && businessEmp <= maxEmp;
  }
}

