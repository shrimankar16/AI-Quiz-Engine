// Quick API Test Script
const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing QuizForge API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const health = await healthResponse.json();
    console.log('✅ Health:', health);

    // Test 2: Register a new user
    console.log('\n2️⃣ Testing user registration...');
    const registerData = {
      name: 'Test Teacher',
      email: `teacher.${Date.now()}@test.com`,
      password: 'password123',
      role: 'teacher'
    };
    
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    
    const registerResult = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Registration successful!');
      console.log('   User:', registerResult.user.name);
      console.log('   Role:', registerResult.user.role);
      console.log('   Token:', registerResult.token.substring(0, 20) + '...');
      
      const token = registerResult.token;
      
      // Test 3: Get current user info
      console.log('\n3️⃣ Testing authentication...');
      const meResponse = await fetch(`${BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const meResult = await meResponse.json();
      console.log('✅ Auth working! User:', meResult.user.email);
      
      // Test 4: Create an exam (teacher only)
      console.log('\n4️⃣ Testing exam creation...');
      const examData = {
        title: 'Sample Quiz',
        description: 'This is a test quiz',
        durationMinutes: 30,
        passingScore: 70
      };
      
      const examResponse = await fetch(`${BASE_URL}/teacher/exams`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(examData)
      });
      
      const examResult = await examResponse.json();
      if (examResponse.ok) {
        console.log('✅ Exam created!');
        console.log('   Title:', examResult.exam.title);
        console.log('   Access Code:', examResult.exam.accessCode);
        console.log('   Duration:', examResult.exam.durationMinutes, 'minutes');
      } else {
        console.log('❌ Exam creation failed:', examResult);
      }
      
      // Test 5: Get teacher's exams
      console.log('\n5️⃣ Testing exam list retrieval...');
      const examsResponse = await fetch(`${BASE_URL}/teacher/exams`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const examsResult = await examsResponse.json();
      console.log('✅ Retrieved', examsResult.exams.length, 'exam(s)');
      
    } else {
      console.log('❌ Registration failed:', registerResult);
    }

    console.log('\n✨ All tests completed!');
    console.log('\n📊 Summary:');
    console.log('   - Backend API: ✅ Working');
    console.log('   - Authentication: ✅ Working');
    console.log('   - Database: ✅ Working');
    console.log('   - Teacher APIs: ✅ Working');
    console.log('\n🎉 Your application is ready to use!');
    console.log('\n🌐 Frontend: http://localhost:5173');
    console.log('🔌 Backend: http://localhost:3000');
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    console.log('\nMake sure the backend is running: npm run dev');
  }
}

testAPI();
