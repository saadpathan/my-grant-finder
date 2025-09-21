import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';

const dynamoClient = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

export const createSimpleTables = async () => {
  const results = [];

  // Create Business Profiles table
  try {
    await dynamoClient.send(new CreateTableCommand({
      TableName: 'MYMatch-BusinessProfiles',
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      BillingMode: 'PAY_PER_REQUEST',
    }));
    results.push('MYMatch-BusinessProfiles table created');
  } catch (e) {
    results.push('MYMatch-BusinessProfiles table exists or error');
  }

  // Create Grant Programs table
  try {
    await dynamoClient.send(new CreateTableCommand({
      TableName: 'MYMatch-GrantPrograms',
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      BillingMode: 'PAY_PER_REQUEST',
    }));
    results.push('MYMatch-GrantPrograms table created');
  } catch (e) {
    results.push('MYMatch-GrantPrograms table exists or error');
  }

  // Create Match Results table
  try {
    await dynamoClient.send(new CreateTableCommand({
      TableName: 'MYMatch-MatchResults',
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      BillingMode: 'PAY_PER_REQUEST',
    }));
    results.push('MYMatch-MatchResults table created');
  } catch (e) {
    results.push('MYMatch-MatchResults table exists or error');
  }

  return results;
};
