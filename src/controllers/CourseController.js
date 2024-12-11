import CourseModel from '../models/CourseModel';

class CourseController {
  static async getCourseDetails(courseId) {
    try {
      const courseDetails = await CourseModel.getCourseDetails(courseId);
      return courseDetails;
    } catch (error) {
      console.error('Error in CourseController:', error);
      throw error;
    }
  }
}

export default CourseController;

