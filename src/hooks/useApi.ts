import { useState, useCallback } from 'react';
import { ApiService } from '@/services/api';
import { BusinessProfile, GrantProgram, CreateBusinessProfileRequest, MatchBusinessRequest } from '@/types';

// Custom hook for business profile operations
export const useBusinessProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBusinessProfile = useCallback(async (data: CreateBusinessProfileRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.createBusinessProfile(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create business profile');
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBusinessProfile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getBusinessProfile(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to get business profile');
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createBusinessProfile,
    getBusinessProfile,
  };
};

// Custom hook for grant program operations
export const useGrantPrograms = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllGrantPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getAllGrantPrograms();
      if (!response.success) {
        throw new Error(response.error || 'Failed to get grant programs');
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGrantProgramsByIndustry = useCallback(async (industry: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.getGrantProgramsByIndustry(industry);
      if (!response.success) {
        throw new Error(response.error || 'Failed to get grant programs by industry');
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const seedInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.seedInitialData();
      if (!response.success) {
        throw new Error(response.error || 'Failed to seed initial data');
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAllGrantPrograms,
    getGrantProgramsByIndustry,
    seedInitialData,
  };
};

// Custom hook for matching operations
export const useMatching = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findMatches = useCallback(async (businessData: MatchBusinessRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.findMatches(businessData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to find matches');
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    findMatches,
  };
};

// Custom hook for application state management
export const useAppState = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'questionnaire' | 'results'>('landing');
  const [businessData, setBusinessData] = useState<BusinessProfile | null>(null);
  const [matches, setMatches] = useState<{ program: GrantProgram; matchScore: number; reasons: string[] }[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleStartAssessment = useCallback(() => {
    setCurrentStep('questionnaire');
  }, []);

  const handleQuestionnaireComplete = useCallback((data: BusinessProfile) => {
    setBusinessData(data);
    setCurrentStep('results');
  }, []);

  const handleBackToLanding = useCallback(() => {
    setCurrentStep('landing');
    setBusinessData(null);
    setMatches([]);
  }, []);

  const setMatchResults = useCallback((matchResults: { program: GrantProgram; matchScore: number; reasons: string[] }[]) => {
    setMatches(matchResults);
  }, []);

  return {
    currentStep,
    businessData,
    matches,
    isInitialized,
    setCurrentStep,
    setBusinessData,
    setMatches,
    setIsInitialized,
    handleStartAssessment,
    handleQuestionnaireComplete,
    handleBackToLanding,
    setMatchResults,
  };
};

