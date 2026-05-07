// Example test file for middleware
// This is a template for testing your authentication middleware

describe('Authentication Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should return 401 if no token is provided', () => {
    // TODO: Import your authMiddleware and test it
    // Example: authMiddleware(mockReq, mockRes, mockNext);
    // expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  it('should call next if valid token is provided', () => {
    // TODO: Add valid token to mockReq.headers
    // authMiddleware(mockReq, mockRes, mockNext);
    // expect(mockNext).toHaveBeenCalled();
  });
});
