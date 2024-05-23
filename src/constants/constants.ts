export const MESSAGE = {
    USER_NOT_FOUND: 'User Not Found',
    USERS_FOUND_SUCCESSFULLY: 'Users Found Successfully',
    LOGIN_SUCCESSFUL: 'Login Successfully',
    INVALID_CREDENTIALS: 'Invalid credentials',
    FIELDS_REQUIRED: 'All fields are required',
    USER_ALREADY_EXITS: 'User already exists',
    USERS_DATA: 'Users data',
    USER_DETAILS_UPDATED: 'User details updated',
    USER_DELETED: 'User Deleted',
    COURSE_ALREADY_EXISTS: 'Course already exists',
    COURSE_CREATED: 'Course created successfully',
    COURSE_NOT_FOUND: 'Course not found!',
    COURSE_DATA: 'Course Found',
    COURSE_UPDATED: 'Course updated successfully',
    REQUIRED_COURSE_ID: 'Course ID is required',
    COURSE_DELETED: 'Course deleted successfully',
    COURSE_ENROLLED: 'You have enroll a course successfully',
    LESSON_NOT_FOUND: 'Lesson not found',
    LESSON_CREATED: 'Lesson Created',
    PASSWORD_RESET: 'Password reset successful',
    INVALID_TOKEN: 'Invalid or expired reset token',
    RESET_PASSWORD_EMAIL_SENT: 'Reset password email sent',
    STRIPE_PRODUCT_CREATION_FAILED: 'Stripe product creation failed',
    STRIPE_PRICE_CREATION_FAILED: 'Stripe price creation failed',
    USER_CREATED: 'User created',
    COURSE_LEFT: 'Course left successfully',
    IMAGE_UPLOAD_SUCCESS: 'Image uploaded successfully',
    LESSON_LIST: 'Lesson list',
    CERTIFICATE_DOWNLOAD: 'Certificate downloaded successfully',
    LESSON_COMPLETED: 'Lesson completed',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    EMAIL_SUBJECT: 'Reset Password',
    EMAIL_MESSAGE: 'Click on the link to reset your password:',
    COURSE_PURCHASED: 'Course purchased successfully',
    COURSE_ALREADY_PURCHASED: 'Course already purchased by this user',
    LESSON_ALREADY_EXISTS: 'Lesson already exists.',
    CERTIFICATE_DOWNLOAD_SUCCESS: 'Certificate downloaded successfully',
    CERTIFICATE_SENT: 'Certificate sent successfully',
    PDF_GENERATION_FAILED: 'PDF generation failed',
    EMAIL_SEND_FAILED: 'Email send failed',
    EMAIL_SENDING_FAILED: 'Email sending failed',
    COURSE_UPDATE_FAILED: 'Course update failed',
    PASSWORD_RESET_CONTENT: 'Your password has been reset successfully',
    COURSE_CREATION_FAILED: 'Course creation failed',
    CERTIFICATE_OF_COMPLETION: 'Certificate of Completion',
    COURSE_COMPLITION: 'Congratulations for Completing the Course',
    REVIEW_RATING_ADDED: 'Review and rating added successfully',
    REVIEW_RATING_FETCHED: 'Review and rating fetched successfully',
    GET_OVERALL_RATING: 'Overall rating fetched successfully',
    REVIEW_RATING_UPDATED: 'Review and rating updated successfully',
    QUESTION_CREATED: 'Question created successfully',
    QUESTION_NOT_FOUND: 'Question not found',
    ANSWER_ADDED: 'Answer added successfully',
    QUESTION_LIST: 'Question list',
    CAN_NOT_ANSWER: 'Only owner can answer the question.',
};

export const NOTIFICATION = {

    COURSE_ENROLLED_CONTENT: (courseName: string) => `You have enrolled in the course ${courseName} successfully`,
    COURSE_CREATED_CONTENT: (courseName: string) => `A new course ${courseName} has been created`,
    COURSE_CREATION_FAILED_CONTENT: (error: string) => `Course creation failed due to ${error}`,
    COURSE_UPDATION_FAILED: (courseName: string) => `Course update failed for ${courseName}`,
    COURSE_UPDATED_CONTENT: (courseName: string) => `Course ${courseName} has been updated`,
    LESSON_CREATED_CONTENT: (lessonName: string) => `Lesson ${lessonName} has been created`,
    CERTIFICATE_SENT_CONTENT: (email: string) => `Certificate has been sent to your email id ${email}`,
    PASSWORD_RESET_CONTENT: 'Your password has been reset successfully',
    COURSE_CREATION_FAILED: 'Course creation failed',
    QUESTION_ADDED_CONTENT: (user: string) => `New question added by ${user}.Please check now`,
};

export const NOTIFICATION_TITLE = {
    NOTIFICATION_CREATED: 'Notification created successfully',
    NOTIFCATION_LIST: 'Notification list',
    PASSWORD_RESET: 'Password reset successful',
    COURSE_CREATED: 'Course created successfully',
    COURSE_UPDATED: 'Course updated successfully',
    COURSE_ENROLLED: 'Course enrolled successfully',
    LESSON_CREATED: 'Lesson created successfully',
    COURSE_COMPLITION: 'You have completed the course successfully',
    QUESTION_CREATED: 'Question created successfully',
}