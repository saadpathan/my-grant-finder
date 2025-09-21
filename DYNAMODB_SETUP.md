# AWS DynamoDB Setup Guide for MYMatch

## 🎯 Overview
This guide will help you set up AWS DynamoDB tables for the MYMatch application.

## 📋 Prerequisites
- AWS Account with appropriate permissions
- AWS CLI configured (optional but recommended)
- Environment variables set up

## 🗄️ Required DynamoDB Tables

### 1. Business Profiles Table
**Table Name**: `MYMatch-BusinessProfiles`
**Primary Key**: `id` (String)

```json
{
  "TableName": "MYMatch-BusinessProfiles",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

### 2. Grant Programs Table
**Table Name**: `MYMatch-GrantPrograms`
**Primary Key**: `id` (String)

```json
{
  "TableName": "MYMatch-GrantPrograms",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

### 3. Match Results Table
**Table Name**: `MYMatch-MatchResults`
**Primary Key**: `id` (String)
**Global Secondary Indexes**:
- `BusinessProfileIndex` (businessProfileId)
- `GrantProgramIndex` (grantProgramId)

```json
{
  "TableName": "MYMatch-MatchResults",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    },
    {
      "AttributeName": "businessProfileId",
      "AttributeType": "S"
    },
    {
      "AttributeName": "grantProgramId",
      "AttributeType": "S"
    }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "BusinessProfileIndex",
      "KeySchema": [
        {
          "AttributeName": "businessProfileId",
          "KeyType": "HASH"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    },
    {
      "IndexName": "GrantProgramIndex",
      "KeySchema": [
        {
          "AttributeName": "grantProgramId",
          "KeyType": "HASH"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

## 🚀 Setup Methods

### Method 1: AWS Console (Recommended for beginners)

1. **Login to AWS Console**
   - Go to [AWS DynamoDB Console](https://console.aws.amazon.com/dynamodb/)
   - Select your preferred region

2. **Create Tables**
   - Click "Create table"
   - Enter table name: `MYMatch-BusinessProfiles`
   - Partition key: `id` (String)
   - Choose "On-demand" billing mode
   - Click "Create table"
   - Repeat for other tables

3. **Create Global Secondary Indexes for Match Results**
   - Go to `MYMatch-MatchResults` table
   - Click "Indexes" tab
   - Click "Create index"
   - Add `BusinessProfileIndex` and `GrantProgramIndex` as shown above

### Method 2: AWS CLI

```bash
# Create Business Profiles table
aws dynamodb create-table \
    --table-name MYMatch-BusinessProfiles \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

# Create Grant Programs table
aws dynamodb create-table \
    --table-name MYMatch-GrantPrograms \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

# Create Match Results table with GSI
aws dynamodb create-table \
    --table-name MYMatch-MatchResults \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=businessProfileId,AttributeType=S \
        AttributeName=grantProgramId,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=BusinessProfileIndex,KeySchema=[{AttributeName=businessProfileId,KeyType=HASH}],Projection={ProjectionType=ALL} \
        IndexName=GrantProgramIndex,KeySchema=[{AttributeName=grantProgramId,KeyType=HASH}],Projection={ProjectionType=ALL} \
    --billing-mode PAY_PER_REQUEST
```

### Method 3: AWS CloudFormation

Create a file `dynamodb-tables.yaml`:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  BusinessProfilesTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: MYMatch-BusinessProfiles
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      BillingMode: PAY_PER_REQUEST

  GrantProgramsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: MYMatch-GrantPrograms
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      BillingMode: PAY_PER_REQUEST

  MatchResultsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: MYMatch-MatchResults
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
        - AttributeName: businessProfileId
          AttributeType: S
        - AttributeName: grantProgramId
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      GlobalSecondaryIndexes:
        - IndexName: BusinessProfileIndex
          KeySchema:
            - AttributeName: businessProfileId
              KeyType: HASH
          Projection:
            ProjectionType: ALL
        - IndexName: GrantProgramIndex
          KeySchema:
            - AttributeName: grantProgramId
              KeyType: HASH
          Projection:
            ProjectionType: ALL
      BillingMode: PAY_PER_REQUEST
```

Deploy with:
```bash
aws cloudformation create-stack --stack-name mymatch-dynamodb --template-body file://dynamodb-tables.yaml
```

## 🔧 Environment Variables

Make sure your `.env` file contains:

```env
VITE_AWS_REGION=your-region
VITE_AWS_ACCESS_KEY_ID=your-access-key
VITE_AWS_SECRET_ACCESS_KEY=your-secret-key
VITE_BUSINESS_PROFILES_TABLE=MYMatch-BusinessProfiles
VITE_GRANT_PROGRAMS_TABLE=MYMatch-GrantPrograms
VITE_MATCH_RESULTS_TABLE=MYMatch-MatchResults
```

## ✅ Verification

After creating the tables, verify they exist:

```bash
aws dynamodb list-tables
```

You should see all three tables listed.

## 🚨 Important Notes

1. **Region**: Make sure your DynamoDB tables are in the same region as specified in your environment variables
2. **Permissions**: Ensure your AWS credentials have DynamoDB read/write permissions
3. **Costs**: Pay-per-request billing means you only pay for what you use
4. **Backup**: Consider enabling point-in-time recovery for production use

## 🔍 Troubleshooting

### Common Issues:

1. **Access Denied**: Check your AWS credentials and permissions
2. **Table Not Found**: Verify table names match exactly (case-sensitive)
3. **Region Mismatch**: Ensure all resources are in the same region
4. **GSI Creation Failed**: Wait for table creation to complete before adding indexes

### Testing Connection:

Run the app and check the browser console for initialization messages. You should see:
- ✅ Application initialized successfully!
- 📊 Seeded X grant programs

If you see errors, check your environment variables and table names.

