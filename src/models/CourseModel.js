import axios from 'axios';

class CourseModel {
  static async getCourseDetails(courseId) {
    try {
      const response = await axios.get(`http://localhost:3000/api/cursos/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course details:', error);
      throw error;
    }
  }
}

export default CourseModel;

