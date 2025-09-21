// Simple Node.js script to test DynamoDB connection
// Run with: node test-backend.js

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const awsConfig = {
  region: process.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
};

const dynamoClient = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLES = {
  BUSINESS_PROFILES: process.env.VITE_BUSINESS_PROFILES_TABLE || 'MYMatch-BusinessProfiles',
  GRANT_PROGRAMS: process.env.VITE_GRANT_PROGRAMS_TABLE || 'MYMatch-GrantPrograms',
  MATCH_RESULTS: process.env.VITE_MATCH_RESULTS_TABLE || 'MYMatch-MatchResults',
};

async function testConnection() {
  console.log('🚀 Testing DynamoDB Connection...\n');
  
  // Test 1: Check environment variables
  console.log('1. Checking Environment Variables:');
  const requiredVars = [
    'VITE_AWS_REGION',
    'VITE_AWS_ACCESS_KEY_ID', 
    'VITE_AWS_SECRET_ACCESS_KEY',
    'VITE_BUSINESS_PROFILES_TABLE',
    'VITE_GRANT_PROGRAMS_TABLE',
    'VITE_MATCH_RESULTS_TABLE'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length === 0) {
    console.log('✅ All environment variables are set');
  } else {
    console.log('❌ Missing environment variables:', missingVars);
    return;
  }
  
  console.log(`📍 AWS Region: ${process.env.VITE_AWS_REGION}`);
  console.log(`🗄️ Tables: ${Object.values(TABLES).join(', ')}\n`);

  // Test 2: Test table access
  console.log('2. Testing Table Access:');
  
  for (const [tableName, tableValue] of Object.entries(TABLES)) {
    try {
      const result = await docClient.send(new ScanCommand({
        TableName: tableValue,
        Limit: 1
      }));
      
      console.log(`✅ ${tableName}: ${tableValue} (${result.Items?.length || 0} items)`);
    } catch (error) {
      console.log(`❌ ${tableName}: ${tableValue} - ${error.message}`);
    }
  }
  
  console.log('\n3. Testing Grant Programs Table (should have seed data):');
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.GRANT_PROGRAMS,
      Limit: 5
    }));
    
    if (result.Items && result.Items.length > 0) {
      console.log(`✅ Found ${result.Items.length} grant programs:`);
      result.Items.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} (${item.provider})`);
      });
    } else {
      console.log('⚠️ No grant programs found. Run the app to seed initial data.');
    }
  } catch (error) {
    console.log(`❌ Error reading grant programs: ${error.message}`);
  }
  
  console.log('\n4. Testing Business Profiles Table:');
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.BUSINESS_PROFILES,
      Limit: 5
    }));
    
    if (result.Items && result.Items.length > 0) {
      console.log(`✅ Found ${result.Items.length} business profiles:`);
      result.Items.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.companyName} (${item.industry})`);
      });
    } else {
      console.log('ℹ️ No business profiles found yet. This is normal if no one has completed the questionnaire.');
    }
  } catch (error) {
    console.log(`❌ Error reading business profiles: ${error.message}`);
  }
  
  console.log('\n🎉 Backend test completed!');
  console.log('\nNext steps:');
  console.log('1. If you see errors, check your AWS credentials and table names');
  console.log('2. If no grant programs are found, run the app and complete the questionnaire');
  console.log('3. Use the Debug Panel in the app (bottom-right button) for real-time testing');
}

testConnection().catch(console.error);
