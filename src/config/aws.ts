import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// AWS Configuration
const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
};

// Validate credentials
console.log('🔍 AWS Configuration Debug:');
console.log('Region:', awsConfig.region);
console.log('Access Key ID:', awsConfig.credentials.accessKeyId ? 'Set' : 'Not set');
console.log('Secret Access Key:', awsConfig.credentials.secretAccessKey ? 'Set' : 'Not set');

if (!awsConfig.credentials.accessKeyId || !awsConfig.credentials.secretAccessKey) {
  console.error('❌ AWS credentials not found in environment variables');
  console.error('Please check your .env file contains:');
  console.error('VITE_AWS_ACCESS_KEY_ID=your-access-key');
  console.error('VITE_AWS_SECRET_ACCESS_KEY=your-secret-key');
  console.error('Current values:');
  console.error('VITE_AWS_ACCESS_KEY_ID:', import.meta.env.VITE_AWS_ACCESS_KEY_ID);
  console.error('VITE_AWS_SECRET_ACCESS_KEY:', import.meta.env.VITE_AWS_SECRET_ACCESS_KEY);
} else {
  console.log('✅ AWS credentials are set');
}

// Create DynamoDB client
const dynamoClient = new DynamoDBClient(awsConfig);

// Create DynamoDB Document Client for easier operations
export const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Table names
export const TABLES = {
  BUSINESS_PROFILES: import.meta.env.VITE_BUSINESS_PROFILES_TABLE || 'MYMatch-BusinessProfiles',
  GRANT_PROGRAMS: import.meta.env.VITE_GRANT_PROGRAMS_TABLE || 'MYMatch-GrantPrograms',
  MATCH_RESULTS: import.meta.env.VITE_MATCH_RESULTS_TABLE || 'MYMatch-MatchResults',
} as const;

export default awsConfig;

