describe('Failing Test Cases - User Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      params: { id: '123' },
      body: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe('User validation - Failure Cases', () => {
    it('should fail: email should be valid format', () => {
      // This test intentionally fails - invalid email format
      const invalidEmail = 'not-an-email';
      expect(invalidEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should fail: password should not be empty string', () => {
      const password = '';
      // This test intentionally fails - empty password should fail validation
      expect(password.length).toBeGreaterThan(0);
    });

    it('should fail: user name should not contain numbers', () => {
      const userName = 'User123';
      // This test intentionally fails - name contains numbers
      expect(userName).not.toMatch(/\d/);
    });
  });

  describe('API Response - Failure Cases', () => {
    it('should fail: response status should not be 200 on error', () => {
      const errorStatus = 404;
      // This test intentionally fails to show status code mismatch
      expect(errorStatus).toBe(200);
    });

    it('should fail: response should contain user object', () => {
      const response = {
        success: false,
        message: 'User not found',
      };
      // This test intentionally fails - no user data in error response
      expect(response).toHaveProperty('user');
    });
  });
});
