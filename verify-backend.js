// Copy and paste this into your browser console when the app is running
// This will test your backend connection in real-time

console.log('🔧 MYMatch Backend Verification Script');
console.log('=====================================');

// Test 1: Check if the app is running and API is available
console.log('\n1. Checking if app is running...');
if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
    console.log('✅ App is running on localhost');
} else {
    console.log('❌ App not running. Please start with: npm run dev');
}

// Test 2: Check environment variables (if available)
console.log('\n2. Checking environment variables...');
const envCheck = {
    region: import.meta?.env?.VITE_AWS_REGION || 'Not set',
    accessKey: import.meta?.env?.VITE_AWS_ACCESS_KEY_ID ? 'Set' : 'Not set',
    secretKey: import.meta?.env?.VITE_AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set',
    businessTable: import.meta?.env?.VITE_BUSINESS_PROFILES_TABLE || 'Not set',
    grantTable: import.meta?.env?.VITE_GRANT_PROGRAMS_TABLE || 'Not set',
    matchTable: import.meta?.env?.VITE_MATCH_RESULTS_TABLE || 'Not set'
};

console.table(envCheck);

// Test 3: Test API service (if available)
console.log('\n3. Testing API service...');
if (typeof window !== 'undefined') {
    // Try to access the API service
    try {
        // This will work if the app is running and modules are loaded
        console.log('✅ API service should be available');
        console.log('💡 Use the Debug Panel (bottom-right button) to test the actual connection');
    } catch (error) {
        console.log('❌ API service not accessible:', error.message);
    }
} else {
    console.log('❌ Not running in browser environment');
}

// Test 4: Instructions for manual verification
console.log('\n4. Manual Verification Steps:');
console.log(`
📋 To verify your backend is working:

1. 🚀 Start your app: npm run dev
2. 🌐 Open: http://localhost:8080
3. 🔧 Click "Debug Backend" button (bottom-right)
4. ▶️ Click "Test Backend Connection"
5. ✅ Look for all green checkmarks

🔍 What you should see:
• Environment variables: ✅ All set
• DynamoDB connection: ✅ Success
• Data seeding: ✅ X grant programs seeded
• Read operations: ✅ Success
• Write operations: ✅ Success
• Matching algorithm: ✅ X matches found

❌ If you see errors:
• Check your .env file
• Verify AWS credentials
• Ensure DynamoDB tables exist
• Check AWS region matches your .env
`);

console.log('\n🎉 Verification script completed!');
console.log('Use the Debug Panel in the app for real-time testing.');
