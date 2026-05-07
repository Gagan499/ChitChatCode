const { generateToken, verifyToken } = require('../services/autheService');

describe('Authentication Service', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = '123';
      const token = generateToken(userId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should generate different tokens for different user IDs', () => {
      const token1 = generateToken('user1');
      const token2 = generateToken('user2');
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return the payload', () => {
      const userId = '456';
      const token = generateToken(userId);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(userId);
    });

    it('should throw an error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        verifyToken(invalidToken);
      }).toThrow();
    });

    it('should throw an error for expired token', () => {
      // Create a token that expires immediately
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { id: '789' },
        process.env.JWT_SECRET || 'default_secret_key',
        { expiresIn: '0s' }
      );
      
      // Wait a bit to ensure expiration
      setTimeout(() => {
        expect(() => {
          verifyToken(expiredToken);
        }).toThrow();
      }, 100);
    });
  });
});
