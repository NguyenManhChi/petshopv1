// Test script for User Management API
// Run this with: node test_user_api.js

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test data
const adminCredentials = {
  user_email: 'admin@petshop.com',
  user_password: 'Admin@123',
};

let adminToken = '';

async function testUserAPI() {
  try {
    console.log('🚀 Testing User Management API...\n');

    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(
      `${API_BASE_URL}/auth/login`,
      adminCredentials
    );
    adminToken = loginResponse.data.data.token;
    console.log('✅ Admin login successful');
    console.log(`   Token: ${adminToken.substring(0, 20)}...\n`);

    // Step 2: Get all users
    console.log('2. Getting all users...');
    const usersResponse = await axios.get(`${API_BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('✅ Users retrieved successfully');
    console.log(`   Total users: ${usersResponse.data.data.users.length}`);
    console.log(
      `   Pagination: ${JSON.stringify(usersResponse.data.data.pagination)}\n`
    );

    // Step 3: Search users
    console.log('3. Searching users...');
    const searchResponse = await axios.get(
      `${API_BASE_URL}/auth/users?search=admin`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    console.log('✅ User search successful');
    console.log(
      `   Found ${searchResponse.data.data.users.length} users matching "admin"\n`
    );

    // Step 4: Get user by ID
    if (usersResponse.data.data.users.length > 0) {
      const userId = usersResponse.data.data.users[0].id;
      console.log(`4. Getting user by ID (${userId})...`);
      const userResponse = await axios.get(
        `${API_BASE_URL}/auth/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      console.log('✅ User retrieved by ID successfully');
      console.log(
        `   User: ${userResponse.data.data.user.user_name} (${userResponse.data.data.user.user_email})\n`
      );

      // Step 5: Update user
      console.log(`5. Updating user (${userId})...`);
      const updateData = {
        user_name: 'Updated User Name',
        user_active: true,
      };
      const updateResponse = await axios.put(
        `${API_BASE_URL}/auth/users/${userId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      console.log('✅ User updated successfully');
      console.log(
        `   Updated name: ${updateResponse.data.data.user.user_name}\n`
      );

      // Step 6: Revert the update
      console.log(`6. Reverting user update (${userId})...`);
      const revertData = {
        user_name: usersResponse.data.data.users[0].user_name,
        user_active: usersResponse.data.data.users[0].user_active,
      };
      await axios.put(`${API_BASE_URL}/auth/users/${userId}`, revertData, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log('✅ User reverted successfully\n');
    }

    // Step 7: Test unauthorized access
    console.log('7. Testing unauthorized access...');
    try {
      await axios.get(`${API_BASE_URL}/auth/users`);
      console.log('❌ Unauthorized access should have failed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access properly blocked');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    console.log('\n🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the tests
testUserAPI();
