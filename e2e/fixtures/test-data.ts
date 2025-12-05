/**
 * Test Data Fixtures for CivicConnect E2E Tests
 * Contains static test data and generators
 */

// Existing seed users (from prisma/seed.ts)
export const seedUsers = {
  priya: {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    role: 'citizen' as const,
  },
  raj: {
    name: 'Raj Kumar',
    email: 'raj@example.com',
    password: 'password123',
    role: 'citizen' as const,
  },
  official: {
    name: 'Municipal Official',
    email: 'official@gov.in',
    password: 'password123',
    role: 'official' as const,
  },
  anita: {
    name: 'Anita Desai',
    email: 'anita@example.com',
    password: 'password123',
    role: 'citizen' as const,
  },
  health: {
    name: 'Health Department',
    email: 'health@gov.in',
    password: 'password123',
    role: 'official' as const,
  },
};

// Test user templates
export const testUserTemplates = {
  citizen: {
    name: 'Test Citizen User',
    role: 'citizen' as const,
    password: 'TestPass123!',
  },
  official: {
    name: 'Test Official User',
    role: 'official' as const,
    password: 'TestPass123!',
  },
};

// Invalid credentials for negative testing
export const invalidCredentials = {
  wrongEmail: {
    email: 'nonexistent@example.com',
    password: 'password123',
  },
  wrongPassword: {
    email: 'priya@example.com',
    password: 'wrongpassword',
  },
  invalidEmail: {
    email: 'not-an-email',
    password: 'password123',
  },
  shortPassword: {
    email: 'test@example.com',
    password: '123',
  },
  emptyFields: {
    email: '',
    password: '',
  },
};

// Test post data
export const testPosts = {
  simple: {
    content: 'This is a simple test post for E2E testing.',
  },
  withEmoji: {
    content: 'Test post with emojis! 🎉🚀✨',
  },
  long: {
    content: `This is a longer test post that contains multiple sentences. 
    It's designed to test how the application handles longer content. 
    The post includes line breaks and various punctuation marks!
    Let's see how it renders in the feed.`,
  },
  withSpecialChars: {
    content: 'Test post with special characters: @#$%^&*()_+-=[]{}|;:\'",.<>?/',
  },
};

// Test comment data
export const testComments = {
  simple: {
    content: 'This is a test comment.',
  },
  withEmoji: {
    content: 'Great post! 👍',
  },
  reply: {
    content: 'I agree with this point.',
  },
};

// Invalid post data for negative testing
export const invalidPosts = {
  empty: {
    content: '',
  },
  whitespaceOnly: {
    content: '   ',
  },
};

// Invalid comment data for negative testing
export const invalidComments = {
  empty: {
    content: '',
  },
  whitespaceOnly: {
    content: '   ',
  },
};

// Test profile data
export const testProfileUpdates = {
  nameOnly: {
    name: 'Updated Test Name',
  },
  withAvatar: {
    name: 'Updated Name',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
  },
};

// Test message data
export const testMessages = {
  simple: {
    content: 'Hello, this is a test message!',
  },
  withEmoji: {
    content: 'Hi there! 👋 How are you?',
  },
};

// Expected UI elements
export const uiElements = {
  login: {
    emailInput: 'input[type="email"], input[name="email"]',
    passwordInput: 'input[type="password"], input[name="password"]',
    submitButton: 'button[type="submit"]',
    registerLink: 'a[href="/signup"]',
    forgotPasswordLink: 'a[href*="forgot"]',
  },
  signup: {
    nameInput: 'input[name="name"]',
    emailInput: 'input[type="email"], input[name="email"]',
    passwordInput: 'input[type="password"], input[name="password"]',
    roleSelect: 'select[name="role"], [data-testid="role-select"]',
    submitButton: 'button[type="submit"]',
    loginLink: 'a[href="/login"]',
  },
  feed: {
    postInput: 'textarea[placeholder*="What"], [data-testid="post-input"]',
    postButton: 'button:has-text("Post"), [data-testid="post-button"]',
    postCard: '[data-testid="post-card"], article',
    likeButton: 'button:has-text("Like"), [data-testid="like-button"]',
    commentButton: 'button:has-text("Comment"), [data-testid="comment-button"]',
    shareButton: 'button:has-text("Share"), [data-testid="share-button"]',
  },
  navigation: {
    homeLink: 'a[href="/"]',
    profileLink: 'a[href="/profile"]',
    messagesLink: 'a[href="/messages"]',
    notificationsLink: 'a[href="/notifications"]',
    logoutButton: 'button:has-text("Logout"), [data-testid="logout-button"]',
  },
};

// API endpoints for direct testing
export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
  },
  users: {
    profile: '/users/profile',
    connections: '/users/connections',
    suggestedConnections: '/users/suggested-connections',
    connect: (userId: string) => `/users/connect/${userId}`,
    disconnect: (userId: string) => `/users/disconnect/${userId}`,
  },
  posts: {
    feed: '/posts/feed',
    create: '/posts',
    get: (id: string) => `/posts/${id}`,
    like: (id: string) => `/posts/${id}/like`,
    unlike: (id: string) => `/posts/${id}/unlike`,
    comments: (id: string) => `/posts/${id}/comments`,
  },
  schemes: {
    list: '/schemes',
    get: (id: string) => `/schemes/${id}`,
    apply: (id: string) => `/schemes/${id}/apply`,
    myApplications: '/schemes/my-applications',
  },
  jobs: {
    list: '/jobs',
    get: (id: string) => `/jobs/${id}`,
    apply: (id: string) => `/jobs/${id}/apply`,
    myApplications: '/jobs/my-applications',
  },
  events: {
    list: '/events',
    get: (id: string) => `/events/${id}`,
    attend: (id: string) => `/events/${id}/attend`,
    myEvents: '/events/my-events',
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
  },
  messages: {
    conversations: '/messages/conversations',
    conversation: (id: string) => `/messages/conversations/${id}`,
    send: '/messages',
  },
  emergencyAlerts: {
    list: '/emergency-alerts',
    get: (id: string) => `/emergency-alerts/${id}`,
  },
  search: '/search',
};
