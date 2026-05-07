# Jest Testing Setup for ChitChatCode Backend

This backend now includes Jest unit testing configured and ready to use.

## Installation

Jest has been installed as a dev dependency. You can verify by running:
```bash
npm list jest
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-run on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

Test files are located in the `__tests__` directory:

```
backend/
├── __tests__/
│   ├── autheService.test.js       (Authentication service tests)
│   ├── authMiddleware.test.js     (Middleware tests - template)
│   └── userController.test.js     (Controller tests - template)
├── jest.config.js                  (Jest configuration)
├── .env.test                       (Test environment variables)
└── ...
```

## Writing Tests

### Example Test Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should do something', () => {
    // Test logic
    expect(result).toBe(expected);
  });

  it('should handle error case', () => {
    expect(() => {
      // Code that should throw
    }).toThrow();
  });
});
```

## Available Test Files

### 1. **autheService.test.js** (Fully Implemented)
Tests for JWT token generation and verification:
- `generateToken()` - Creates JWT tokens
- `verifyToken()` - Validates and decodes JWT tokens

**Status:** ✅ Complete and ready to run

### 2. **authMiddleware.test.js** (Template)
Template for testing authentication middleware. Includes:
- Test for missing token (401)
- Test for valid token

**Status:** ⚠️ Template - needs your middleware implementation

### 3. **userController.test.js** (Template)
Template for testing user controller endpoints. Includes:
- `getUserProfile()` tests
- `updateUserProfile()` tests

**Status:** ⚠️ Template - needs your controller implementation

## Next Steps

1. **Run existing tests:**
   ```bash
   npm test
   ```

2. **Add more tests** for your controllers and middleware by:
   - Copying the templates in `__tests__`
   - Importing your actual functions
   - Implementing the test cases

3. **Use mocking** for database calls:
   ```javascript
   jest.mock('../models', () => ({
     User: {
       findByPk: jest.fn(),
     },
   }));
   ```

## Common Jest Matchers

```javascript
expect(value).toBe(expected);           // Strict equality
expect(value).toEqual(expected);        // Deep equality
expect(value).toBeDefined();            // Not undefined
expect(value).toBeNull();               // Null check
expect(() => fn()).toThrow();           // Error throwing
expect(mock).toHaveBeenCalled();        // Mock called check
expect(array).toContain(item);          // Array contains
```

## Configuration Reference

See `jest.config.js` for:
- Test environment (Node.js)
- Coverage collection paths
- Test file patterns

## Troubleshooting

**Issue:** Tests fail due to missing environment variables
**Solution:** Check `.env.test` file has necessary variables

**Issue:** Database connection errors in tests
**Solution:** Mock database calls using `jest.mock()`

**Issue:** Cannot find module
**Solution:** Ensure paths in imports match your file structure

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Node.js Applications](https://jestjs.io/docs/getting-started#using-babel)
- [Mock Functions](https://jestjs.io/docs/mock-functions)
