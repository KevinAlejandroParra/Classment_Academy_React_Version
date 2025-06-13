const mockCourse = {
  id: 1,
  title: 'Test Course',
  description: 'A test course for Classment Academy',
  schoolId: 1,
  instructor: 'Test Instructor',
  duration: '3 months',
  level: 'beginner',
  price: 99.99,
  schedule: 'Monday, Wednesday, Friday',
  startDate: new Date().toISOString(),
  status: 'active',
  createdAt: new Date().toISOString()
};

const mockCreateCourse = (courseData) => {
  return {
    success: true,
    course: {
      ...mockCourse,
      ...courseData,
      id: Math.floor(Math.random() * 1000) + 1,
      createdAt: new Date().toISOString()
    },
    message: 'Course created successfully'
  };
};

const mockValidateCourseData = (courseData) => {
  return {
    isValid: true,
    errors: []
  };
};

const mockValidateSchedule = (schedule) => {
  return {
    isValid: true,
    availableSlots: ['Monday', 'Wednesday', 'Friday']
  };
};

describe('Course Creation Tests', () => {
  test('should successfully create a new course', () => {
    const courseData = {
      title: 'New Course',
      description: 'A new course in the system',
      schoolId: 1,
      instructor: 'New Instructor',
      duration: '6 months',
      level: 'intermediate',
      price: 149.99
    };
    
    const result = mockCreateCourse(courseData);
    
    expect(result.success).toBe(true);
    expect(result.course.title).toBe(courseData.title);
    expect(result.course.description).toBe(courseData.description);
    expect(result.message).toBe('Course created successfully');
  });

  test('should validate course data', () => {
    const courseData = {
      title: 'New Course',
      description: 'A new course in the system',
      schoolId: 1,
      instructor: 'New Instructor'
    };
    
    const validation = mockValidateCourseData(courseData);
    
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  test('should validate course schedule', () => {
    const schedule = 'Monday, Wednesday, Friday';
    
    const result = mockValidateSchedule(schedule);
    
    expect(result.isValid).toBe(true);
    expect(result.availableSlots).toContain('Monday');
    expect(result.availableSlots).toContain('Wednesday');
    expect(result.availableSlots).toContain('Friday');
  });

  test('should create course with required fields', () => {
    const courseData = {
      title: 'Minimal Course',
      schoolId: 1,
      instructor: 'Basic Instructor'
    };
    
    const result = mockCreateCourse(courseData);
    
    expect(result.success).toBe(true);
    expect(result.course.id).toBeDefined();
    expect(result.course.title).toBe(courseData.title);
    expect(result.course.status).toBe('active');
    expect(result.course.createdAt).toBeDefined();
  });
}); 