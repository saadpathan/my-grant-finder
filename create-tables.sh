#!/bin/bash

# Create DynamoDB tables for MYMatch
# Run with: bash create-tables.sh

echo "🚀 Creating DynamoDB tables for MYMatch..."

# Set your region (change if different)
REGION="us-east-1"

# Create Business Profiles table
echo "Creating MYMatch-BusinessProfiles table..."
aws dynamodb create-table \
    --table-name MYMatch-BusinessProfiles \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

# Create Grant Programs table
echo "Creating MYMatch-GrantPrograms table..."
aws dynamodb create-table \
    --table-name MYMatch-GrantPrograms \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

# Create Match Results table
echo "Creating MYMatch-MatchResults table..."
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
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

echo "✅ Tables created successfully!"
echo "Check your AWS Console to verify the tables exist."
