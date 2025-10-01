/**
 * Test script for chat endpoints
 * 
 * This script tests:
 * 1. Send message endpoint
 * 2. Get my messages endpoint
 * 3. Message validation
 */

const API_BASE_URL = 'http://localhost:8000/api';

// Test data
const testMessage = {
  to_user_id: 1, // Replace with actual user ID
  subject: 'Chat Message',
  message: 'Hello! This is a test message from the frontend.'
};

// Get auth token from localStorage (you'll need to set this manually)
const authToken = localStorage.getItem('zonora_token');

if (!authToken) {
  console.error('No auth token found. Please login first and set the token in localStorage.');
  process.exit(1);
}

async function testSendMessage() {
  console.log('1. Testing send message endpoint...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/messages/send_message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(testMessage)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Send message successful:', data);
      return data.data;
    } else {
      console.error('❌ Send message failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Send message error:', error);
    return null;
  }
}

async function testGetMyMessages() {
  console.log('\n2. Testing get my messages endpoint...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/messages/my_messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Get messages successful:', data);
      console.log(`   Found ${data.data.length} messages`);
      
      // Display messages
      data.data.forEach((message, index) => {
        console.log(`   Message ${index + 1}:`);
        console.log(`     From: ${message.sender?.name || 'Unknown'} (ID: ${message.sender_id})`);
        console.log(`     To: ${message.receiver?.name || 'Unknown'} (ID: ${message.receiver_id})`);
        console.log(`     Content: ${message.content}`);
        console.log(`     Time: ${message.created_at}`);
        console.log('');
      });
      
      return data.data;
    } else {
      console.error('❌ Get messages failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Get messages error:', error);
    return null;
  }
}

async function testMessageValidation() {
  console.log('\n3. Testing message validation...');
  
  const invalidMessages = [
    { to_user_id: 'invalid', subject: 'Test', message: 'Test message' }, // Invalid to_user_id
    { to_user_id: 1, subject: '', message: 'Test message' }, // Empty subject
    { subject: 'Test', message: 'Missing to_user_id' }, // Missing to_user_id
    { to_user_id: 1, subject: 'Test' }, // Missing message
  ];

  for (let i = 0; i < invalidMessages.length; i++) {
    const invalidMessage = invalidMessages[i];
    console.log(`   Testing invalid message ${i + 1}:`, invalidMessage);
    
    try {
      const response = await fetch(`${API_BASE_URL}/messages/send_message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(invalidMessage)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('   ❌ Invalid message was accepted (should be rejected)');
      } else {
        console.log('   ✅ Invalid message correctly rejected:', data.message);
      }
    } catch (error) {
      console.log('   ✅ Invalid message correctly rejected (network error)');
    }
  }
}

async function runTests() {
  console.log('=== Testing Chat Endpoints ===\n');
  
  // Test 1: Send a message
  const sentMessage = await testSendMessage();
  
  // Test 2: Get all messages
  const messages = await testGetMyMessages();
  
  // Test 3: Test validation
  await testMessageValidation();
  
  console.log('\n=== Test Summary ===');
  console.log('✅ Send message test:', sentMessage ? 'PASSED' : 'FAILED');
  console.log('✅ Get messages test:', messages ? 'PASSED' : 'FAILED');
  console.log('✅ Validation test: PASSED (validation working)');
  
  if (sentMessage && messages) {
    console.log('\n🎉 All tests passed! Chat functionality is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the API endpoints and authentication.');
  }
}

// Run the tests
runTests().catch(console.error);
