import { APIGatewayProxyHandler } from 'aws-lambda';
import { MatchBusinessRequest } from './types';

// This Lambda function receives a business profile, runs AI logic, and returns matches
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const profile: MatchBusinessRequest = body;

    // --- AI logic goes here ---
    // Replace this with your actual AI model logic or call
    // For now, return a dummy match
    const matches = [
      {
        grantProgramId: 'some-id',
        matchScore: 85,
        reasons: ['Industry match', 'Stage match']
      }
    ];

    return {
      statusCode: 200,
      body: JSON.stringify(matches),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
