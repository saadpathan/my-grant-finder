import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Database, Users, Award } from "lucide-react";
import { ApiService } from "@/services/api";
import { useBusinessProfile, useGrantPrograms } from "@/hooks/useApi";
//import { createSimpleTables } from "@/utils/simpleCreateTables";
//import { testConnection } from "@/utils/testConnection";

// Helper to check AWS env variables
function checkAwsEnvVars() {
  const region = import.meta.env.VITE_AWS_REGION;
  const accessKey = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const secretKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
  let missing: string[] = [];
  if (!region) missing.push('VITE_AWS_REGION');
  if (!accessKey) missing.push('VITE_AWS_ACCESS_KEY_ID');
  if (!secretKey) missing.push('VITE_AWS_SECRET_ACCESS_KEY');
  if (missing.length > 0) {
    // Log to console for developer
    console.warn('⚠️ Missing AWS environment variables:', missing.join(', '));
  }
  return missing;
}

export const DebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // getAllBusinessProfiles does not exist in the hook, so remove it
  const { getAllGrantPrograms, seedInitialData } = useGrantPrograms();
  const missingAwsVars = checkAwsEnvVars();

  const createTablesTest = async () => {
    setIsLoading(true);
    setTestResults(null);
    
    const results = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    try {
      console.log('🔨 Creating DynamoDB tables...');
      const tableResults = await createSimpleTables();
      
      const createCheck = {
        name: "Create DynamoDB Tables",
        status: "success",
        details: {
          message: `Table creation completed`,
          results: tableResults
        }
      };
      
      results.tests.push(createCheck);
      
    } catch (error) {
      const createCheck = {
        name: "Create DynamoDB Tables",
        status: "error",
        details: {
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      
      results.tests.push(createCheck);
    } finally {
      setIsLoading(false);
      setTestResults(results);
    }
  };

  const runDetailedTest = async () => {
    setIsLoading(true);
    setTestResults(null);
    
    try {
      console.log('🔍 Running detailed connection test...');
      const results = await testConnection();
      setTestResults(results);
    } catch (error) {
      console.error('Detailed test failed:', error);
      setTestResults({
        timestamp: new Date().toISOString(),
        tests: [{
          name: "Detailed Test",
          status: "error",
          details: { message: error instanceof Error ? error.message : 'Unknown error' }
        }]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runConnectionTest = async () => {
    setIsLoading(true);
    setTestResults(null);
    
    const results = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    try {
      // Test 1: Check environment variables
      const envCheck = {
        name: "Environment Variables",
        status: "checking",
        details: {}
      };
      
      const requiredEnvVars = [
        'VITE_AWS_REGION',
        'VITE_AWS_ACCESS_KEY_ID', 
        'VITE_AWS_SECRET_ACCESS_KEY',
        'VITE_BUSINESS_PROFILES_TABLE',
        'VITE_GRANT_PROGRAMS_TABLE',
        'VITE_MATCH_RESULTS_TABLE'
      ];

      const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
      
      if (missingVars.length === 0) {
        envCheck.status = "success";
        envCheck.details = { message: "All environment variables are set" };
      } else {
        envCheck.status = "error";
        envCheck.details = { message: `Missing: ${missingVars.join(', ')}` };
      }
      
      results.tests.push(envCheck);

      // Test 2: Test DynamoDB connection by seeding data
      const seedCheck = {
        name: "DynamoDB Connection & Data Seeding",
        status: "checking",
        details: {}
      };

      try {
        const seeded = await seedInitialData();
        seedCheck.status = "success";
        seedCheck.details = {
          message: `Successfully seeded ${seeded.grantPrograms || 0} grant programs`,
          data: seeded
        };
      } catch (error) {
        seedCheck.status = "error";
        seedCheck.details = { message: error instanceof Error ? error.message : 'Unknown error' };
      }
      results.tests.push(seedCheck);

      // Test 3: Test reading grant programs
      const readCheck = {
        name: "DynamoDB Read Operations",
        status: "checking",
        details: {}
      };

      try {
        const programs = await getAllGrantPrograms();
        readCheck.status = "success";
        readCheck.details = { 
          message: `Successfully read ${programs.length} grant programs`,
          sampleData: programs.slice(0, 2).map(p => ({ id: p.id, name: p.name, provider: p.provider }))
        };
      } catch (error) {
        readCheck.status = "error";
        readCheck.details = { message: error instanceof Error ? error.message : 'Unknown error' };
      }
      
      results.tests.push(readCheck);

      // Test 4: Test creating a business profile
      const createCheck = {
        name: "DynamoDB Write Operations",
        status: "checking",
        details: {}
      };

      try {
        const testProfile = {
          companyName: "Test Company",
          establishedYear: "2024",
          industry: "Technology & IT",
          stage: "Startup (0-2 years)",
          employees: "1-5",
          revenue: "300k-3m",
          fundingPurpose: ["Digital Transformation"],
          fundingAmount: "50k-200k",
          timeline: "1-3months",
          location: "Kuala Lumpur",
          description: "Test business for debugging"
        };

        const createResult = await ApiService.createBusinessProfile(testProfile);
        if (createResult.success) {
          createCheck.status = "success";
          createCheck.details = { 
            message: "Successfully created test business profile",
            profileId: createResult.data?.id
          };
        } else {
          createCheck.status = "error";
          createCheck.details = { message: createResult.error };
        }
      } catch (error) {
        createCheck.status = "error";
        createCheck.details = { message: error instanceof Error ? error.message : 'Unknown error' };
      }
      
      results.tests.push(createCheck);

      // Test 5: Test matching algorithm
      const matchCheck = {
        name: "Matching Algorithm",
        status: "checking",
        details: {}
      };

      try {
        const matchData = {
          businessProfileId: "test-id",
          industry: "Technology & IT",
          stage: "Startup (0-2 years)",
          employees: "1-5",
          revenue: "300k-3m",
          fundingPurpose: ["Digital Transformation"],
          fundingAmount: "50k-200k",
          location: "Kuala Lumpur"
        };

        const matchResult = await ApiService.findMatches(matchData);
        if (matchResult.success) {
          matchCheck.status = "success";
          matchCheck.details = { 
            message: `Found ${matchResult.data?.length || 0} matches`,
            topMatch: matchResult.data?.[0] ? {
              program: matchResult.data[0].program.name,
              score: matchResult.data[0].matchScore
            } : null
          };
        } else {
          matchCheck.status = "error";
          matchCheck.details = { message: matchResult.error };
        }
      } catch (error) {
        matchCheck.status = "error";
        matchCheck.details = { message: error instanceof Error ? error.message : 'Unknown error' };
      }
      
      results.tests.push(matchCheck);

    } catch (error) {
      console.error('Debug test failed:', error);
    } finally {
      setIsLoading(false);
      setTestResults(results);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'checking':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-primary text-primary-foreground shadow-lg"
        >
          <Database className="h-4 w-4 mr-2" />
          Debug Backend
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backend Debug Panel
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={createTablesTest}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Tables...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Create Tables
                </>
              )}
            </Button>
            <Button
              onClick={runDetailedTest}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Detailed Test
                </>
              )}
            </Button>
            <Button
              onClick={runConnectionTest}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Full Test
                </>
              )}
            </Button>
          </div>

          {testResults && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Test run at: {new Date(testResults.timestamp).toLocaleString()}
              </div>
              
              {testResults.tests.map((test: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(test.status)}
                    <h3 className="font-semibold">{test.name}</h3>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {test.details.message}
                  </div>
                  {test.details.data && (
                    <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(test.details.data, null, 2)}
                    </pre>
                  )}
                  {test.details.sampleData && (
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-1">Sample Data:</div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(test.details.sampleData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {missingAwsVars.length > 0 && (
            <div style={{ background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
              <strong>Warning:</strong> Missing AWS environment variables: {missingAwsVars.join(', ')}<br />
              Please check your <code>.env</code> file and restart the dev server.
            </div>
          )}

          <Alert>
            <AlertDescription>
              <strong>How to use:</strong> Click "Test Backend Connection" to verify your AWS DynamoDB setup. 
              This will test environment variables, database connection, data seeding, and all CRUD operations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
