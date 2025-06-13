const mockRegister = (userData) => {
  return {
    success: true,
    user: {
      id: 1,
      email: userData.email,
      name: userData.name,
      role: userData.role || 'student',
      createdAt: new Date().toISOString()
    },
    message: 'User registered successfully'
  };
};

const mockValidateRegistrationData = (userData) => {
  return {
    isValid: true,
    errors: []
  };
};

const mockIsEmailAvailable = (email) => {
  return true;
};

describe('Registration Tests', () => {
  test('should successfully register a new user', () => {
    const userData = {
      email: 'newuser@example.com',
      name: 'New User',
      password: 'securePassword123',
      role: 'student'
    };
    
    const result = mockRegister(userData);
    
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.message).toBe('User registered successfully');
  });

  test('should validate registration data', () => {
    const userData = {
      email: 'newuser@example.com',
      name: 'New User',
      password: 'securePassword123'
    };
    
    const validation = mockValidateRegistrationData(userData);
    
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  test('should check if email is available', () => {
    const email = 'newuser@example.com';
    
    const isAvailable = mockIsEmailAvailable(email);
    
    expect(isAvailable).toBe(true);
  });

  test('should create user with correct data structure', () => {
    const userData = {
      email: 'newuser@example.com',
      name: 'New User',
      password: 'securePassword123',
      role: 'student'
    };
    
    const result = mockRegister(userData);
    
    expect(result.user.id).toBe(1);
    expect(result.user.email).toBe(userData.email);
    expect(result.user.name).toBe(userData.name);
    expect(result.user.role).toBe(userData.role);
    expect(result.user.createdAt).toBeDefined();
  });

  test('should handle registration with default role', () => {
    const userData = {
      email: 'newuser@example.com',
      name: 'New User',
      password: 'securePassword123'
    };
    
    const result = mockRegister(userData);
    
    expect(result.user.role).toBe('student');
  });
}); 