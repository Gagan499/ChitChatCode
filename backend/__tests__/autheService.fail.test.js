const { generateToken, verifyToken } = require('../services/autheService');

describe('Failing Test Cases - Authentication Service', () => {
  describe('generateToken - Failure Scenarios', () => {
    it('should fail: token should not be undefined', () => {
      const userId = null;
      const token = generateToken(userId);
      
      // This test intentionally fails to show failure case
      expect(token).toBeUndefined();
    });

    it('should fail: tokens with same user ID should be identical', () => {
      const userId = '123';
      const token1 = generateToken(userId);
      const token2 = generateToken(userId);
      
      // This test intentionally fails because tokens have timestamps and differ
      expect(token1).toBe(token2);
    });

    it('should fail: token should not have 3 parts', () => {
      const userId = 'test-user';
      const token = generateToken(userId);
      
      // This test intentionally fails to demonstrate assertion failure
      expect(token.split('.').length).not.toBe(3);
    });
  });

  describe('verifyToken - Failure Scenarios', () => {
    it('should fail: invalid token should not throw error', () => {
      const invalidToken = 'definitely.not.valid';
      
      // This test intentionally fails - invalid token SHOULD throw
      expect(() => {
        verifyToken(invalidToken);
      }).not.toThrow();
    });

    it('should fail: decoded payload should not contain id', () => {
      const userId = 'test-id-123';
      const token = generateToken(userId);
      const decoded = verifyToken(token);
      
      // This test intentionally fails - decoded token SHOULD contain id
      expect(decoded).not.toHaveProperty('id');
    });
  });
});
