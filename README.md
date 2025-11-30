# CivicConnect Mobile-First Social Media App

This repository contains the frontend code for the CivicConnect civic-tech web application, optimized for mobile devices with a social media app-like interface.

## Features

- Mobile-first design with app-like interface
- Bottom navigation bar for core controls
- Prioritized display of schemes and opportunities
- Enhanced social feed with official and community posts
- User profiles with customization options
- Dark mode support
- Accessibility features
- Prepared for backend integration

## Backend Integration Guide

### API Structure

The application is designed to work with a RESTful API backend. The API service layer is structured in the following files:

- `lib/api-service.ts`: Contains all API endpoints and request methods
- `lib/auth-service.ts`: Handles authentication, token management, and session persistence

### Authentication Flow

1. **User Registration**:
   - Frontend collects user data (name, email, password, role)
   - Sends POST request to `/auth/register`
   - Stores returned tokens and user data in localStorage

2. **User Login**:
   - Frontend collects credentials (email, password)
   - Sends POST request to `/auth/login`
   - Stores returned tokens and user data in localStorage

3. **Token Refresh**:
   - When API returns 401 Unauthorized
   - Frontend uses refresh token to request new access token
   - Updates stored tokens

4. **Logout**:
   - Sends POST request to `/auth/logout`
   - Clears stored tokens and user data

### Data Models

The application expects the following data models from the backend:

1. **User**:
   \`\`\`typescript
   interface User {
     id: string;
     name: string;
     email: string;
     avatar?: string;
     role: 'citizen' | 'official';
     isVerified: boolean;
     createdAt: string;
   }
   \`\`\`

2. **Post**:
   \`\`\`typescript
   interface Post {
     id: string;
     content: string;
     image?: string;
     author: User;
     likes: number;
     comments: number;
     shares: number;
     createdAt: string;
   }
   \`\`\`

3. **Scheme**:
   \`\`\`typescript
   interface Scheme {
     id: string;
     title: string;
     description: string;
     deadline: string;
     isNew: boolean;
     eligibility: string;
     documents: string[];
     fundingDetails: string;
     applicationProcess: string;
   }
   \`\`\`

4. **Job**:
   \`\`\`typescript
   interface Job {
     id: string;
     title: string;
     company: string;
     location: string;
     description: string;
     requirements: string[];
     salary?: string;
     isNew: boolean;
     postedAt: string;
   }
   \`\`\`

5. **Event**:
   \`\`\`typescript
   interface Event {
     id: string;
     title: string;
     date: string;
     location: string;
     description: string;
     organizer: string;
     attendees: number;
   }
   \`\`\`

6. **Notification**:
   \`\`\`typescript
   interface Notification {
     id: string;
     type: 'alert' | 'message' | 'connection' | 'application' | 'system';
     title: string;
     content: string;
     isRead: boolean;
     createdAt: string;
     actionUrl?: string;
   }
   \`\`\`

### Implementing Backend Integration

1. **Environment Setup**:
   - Create a `.env.local` file with:
     \`\`\`
     NEXT_PUBLIC_API_URL=https://your-api-url.com
     \`\`\`

2. **API Service Implementation**:
   - Uncomment and implement the example functions in `lib/api-service.ts`
   - Add error handling and loading states

3. **Authentication Integration**:
   - Implement the auth provider in `components/auth-provider.tsx`
   - Wrap your application with the auth provider in `app/layout.tsx`

4. **Protected Routes**:
   - Create middleware to check authentication status
   - Redirect unauthenticated users to login page

5. **Data Fetching**:
   - Use React Query or SWR for data fetching and caching
   - Implement loading and error states for all data fetching operations

### Example: Fetching Posts

\`\`\`typescript
import { useQuery } from 'react-query';
import { apiRequest, API_ENDPOINTS } from '@/lib/api-service';
import { getToken } from '@/lib/auth-service';

export function usePosts() {
  const token = getToken();
  
  return useQuery('posts', async () => {
    return apiRequest(
      API_ENDPOINTS.POSTS.FEED,
      'GET',
      undefined,
      token
    );
  });
}
\`\`\`

### Example: Creating a Post

\`\`\`typescript
import { useMutation, useQueryClient } from 'react-query';
import { apiRequest, API_ENDPOINTS } from '@/lib/api-service';
import { getToken } from '@/lib/auth-service';

export function useCreatePost() {
  const queryClient = useQueryClient();
  const token = getToken();
  
  return useMutation(
    async ({ content, image }: { content: string, image?: File }) => {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }
      
      return apiRequest(
        API_ENDPOINTS.POSTS.CREATE,
        'POST',
        formData,
        token
      );
    },
    {
      onSuccess: () => {
        // Invalidate and refetch posts query
        queryClient.invalidateQueries('posts');
      }
    }
  );
}
\`\`\`

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application is ready to be deployed to Vercel or any other Next.js-compatible hosting platform.
