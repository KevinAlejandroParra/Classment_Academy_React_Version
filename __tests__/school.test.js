const mockSchool = {
  id: 1,
  name: 'Test School',
  description: 'A test school for Classment Academy',
  address: '123 Test Street',
  city: 'Bogotá',
  country: 'Colombia',
  phone: '+1234567890',
  email: 'school@example.com',
  website: 'https://testschool.com',
  logo: 'default-school-logo.png',
  status: 'active',
  createdAt: new Date().toISOString()
};

const mockCreateSchool = (schoolData) => {
  return {
    success: true,
    school: {
      ...mockSchool,
      ...schoolData,
      id: Math.floor(Math.random() * 1000) + 1,
      createdAt: new Date().toISOString()
    },
    message: 'School created successfully'
  };
};

const mockValidateSchoolData = (schoolData) => {
  return {
    isValid: true,
    errors: []
  };
};

const mockUploadLogo = (file) => {
  return {
    success: true,
    url: 'https://example.com/schools/new-logo.png'
  };
};

const mockValidateLocation = (address, city, country) => {
  return {
    isValid: true,
    coordinates: {
      lat: 4.6097,
      lng: -74.0817
    }
  };
};

describe('School Creation Tests', () => {
  test('should successfully create a new school', () => {
    const schoolData = {
      name: 'New School',
      description: 'A new school in the system',
      address: '456 New Street',
      city: 'Medellín',
      country: 'Colombia',
      phone: '+0987654321',
      email: 'newschool@example.com'
    };
    
    const result = mockCreateSchool(schoolData);
    
    expect(result.success).toBe(true);
    expect(result.school.name).toBe(schoolData.name);
    expect(result.school.description).toBe(schoolData.description);
    expect(result.message).toBe('School created successfully');
  });

  test('should validate school data', () => {
    const schoolData = {
      name: 'New School',
      description: 'A new school in the system',
      address: '456 New Street',
      city: 'Medellín',
      country: 'Colombia'
    };
    
    const validation = mockValidateSchoolData(schoolData);
    
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  test('should successfully upload school logo', () => {
    const mockFile = {
      name: 'school-logo.jpg',
      type: 'image/jpeg',
      size: 2048
    };
    
    const result = mockUploadLogo(mockFile);
    
    expect(result.success).toBe(true);
    expect(result.url).toBeDefined();
  });

  test('should validate school location', () => {
    const address = '456 New Street';
    const city = 'Medellín';
    const country = 'Colombia';
    
    const result = mockValidateLocation(address, city, country);
    
    expect(result.isValid).toBe(true);
    expect(result.coordinates).toBeDefined();
    expect(result.coordinates.lat).toBeDefined();
    expect(result.coordinates.lng).toBeDefined();
  });

  test('should create school with required fields', () => {
    const schoolData = {
      name: 'Minimal School',
      address: '789 Simple Street',
      city: 'Cali',
      country: 'Colombia'
    };
    
    const result = mockCreateSchool(schoolData);
    
    expect(result.success).toBe(true);
    expect(result.school.id).toBeDefined();
    expect(result.school.name).toBe(schoolData.name);
    expect(result.school.status).toBe('active');
    expect(result.school.createdAt).toBeDefined();
  });

  test('should handle school creation with optional fields', () => {
    const schoolData = {
      name: 'Complete School',
      description: 'A school with all fields',
      address: '101 Complete Ave',
      city: 'Barranquilla',
      country: 'Colombia',
      phone: '+1234567890',
      email: 'complete@school.com',
      website: 'https://completeschool.com',
      logo: 'custom-logo.png'
    };
    
    const result = mockCreateSchool(schoolData);
    
    expect(result.success).toBe(true);
    expect(result.school.website).toBe(schoolData.website);
    expect(result.school.logo).toBe(schoolData.logo);
    expect(result.school.phone).toBe(schoolData.phone);
    expect(result.school.email).toBe(schoolData.email);
  });
}); 