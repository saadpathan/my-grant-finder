import { ApiService } from '@/services/api';

// Initialize the application with seed data
export const initializeApp = async () => {
  try {
    console.log('🚀 Initializing MYMatch application...');
    
    // Seed initial grant programs
    const seedResult = await ApiService.seedInitialData();
    
    if (seedResult.success) {
      console.log('✅ Application initialized successfully!');
      console.log(`📊 Seeded ${seedResult.data?.grantPrograms || 0} grant programs`);
      return true;
    } else {
      console.error('❌ Failed to initialize application:', seedResult.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error initializing application:', error);
    return false;
  }
};

// Check if the app is properly configured
export const checkAppConfiguration = () => {
  const requiredEnvVars = [
    'VITE_AWS_REGION',
    'VITE_AWS_ACCESS_KEY_ID', 
    'VITE_AWS_SECRET_ACCESS_KEY',
    'VITE_BUSINESS_PROFILES_TABLE',
    'VITE_GRANT_PROGRAMS_TABLE',
    'VITE_MATCH_RESULTS_TABLE'
  ];

  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
};

