import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { fromEnv } from '@aws-sdk/credential-providers';

// AWS Configuration
const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: fromEnv(),
};

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

