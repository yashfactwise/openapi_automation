/**
 * Test setup file
 * Configures global test environment and mocks
 */

// Mock localStorage for tests
const localStorageMock = (() => {
    let store = {};

    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

global.localStorage = localStorageMock;

// Clear localStorage before each test
beforeEach(() => {
    localStorage.clear();
});
