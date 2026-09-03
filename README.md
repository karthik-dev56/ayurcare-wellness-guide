# AyurCare Wellness Guide

Build the frontend for my existing Ayurvedic RAG application called AyurCare.

1. IMPORTANT — EXISTING BACKEND

I already have a fully deployed backend. Do NOT create a new backend, database, authentication system, or mock API.

Backend base URL:

https://ayurvedic-rag-production.up.railway.app

API documentation:

https://ayurvedic-rag-production.up.railway.app/docs

OpenAPI:

https://ayurvedic-rag-production.up.railway.app/openapi.json

The frontend must integrate with this existing backend.

Available backend endpoints:

GET /

POST /chat

GET /chat/history

POST /test-user

POST /test-message

GET /test-chat/{user_id}

GET /auth/google

GET /auth/google/callback

GET /auth/me

POST /auth/logout

Do not invent different endpoint names or replace the existing backend architecture.

2. APPLICATION NAME

The application name is:

AyurCare

Do NOT call it "Ayurvedic RAG", "AI Ayurvedic Assistant", "RAG Assistant", or any other name in the UI.

Use AyurCare consistently throughout the frontend.

3. CORE USER FLOW

The application should have two states.

STATE A — User is NOT signed in

Show a clean AyurCare landing/chat entry screen.

The user should clearly understand:

AyurCare is an Ayurvedic health information assistant.

They need to sign in to use personalized chat/history features.

Their previous conversations are available after signing in.

Primary CTA:

Sign in with Google

Clicking this should use the existing backend Google authentication:

GET /auth/google

Do NOT implement Google OAuth independently in the frontend.

The backend is responsible for authentication.

4. AFTER GOOGLE LOGIN

After Google authentication completes, the frontend must determine the currently authenticated user using:

GET /auth/me

The frontend should maintain the authenticated user state.

Display a small user profile area in the header/sidebar containing:

Google profile picture if available

User name

User email

Logout option

Do not expose technical authentication details to the user.

5. CHAT HISTORY

This is extremely important.

Chat history already belongs to the backend.

Do NOT create localStorage-based chat history.

Do NOT create a separate frontend database.

Do NOT create fake/mock history.

After the user is authenticated, fetch:

GET /chat/history

Display the history returned by the backend.

The UI should make it feel like the user's conversations are persistent.

Example sidebar:

Your conversations

Headache and digestion

Ayurvedic diet questions

Sleep routine

Skin care

Previous conversation...

Use the actual backend response data.

If there is no history:

No conversations yet. Start your first conversation with AyurCare.

The frontend must always treat the backend as the source of truth for history.

6. USER ISOLATION

A user must only see their own conversation history.

Never allow the frontend to manually choose another user's ID to retrieve history.

The authenticated session from the backend determines the current user.

The frontend should call:

GET /auth/me

and then:

GET /chat/history

using the authenticated session/cookies required by the backend.

Do not put user IDs manually into the frontend URL or localStorage unless the existing API explicitly requires it.

7. CHAT

Once signed in, provide the main AyurCare chat interface.

Use:

POST /chat

for sending messages.

The frontend should send exactly the request structure expected by the existing OpenAPI schema.

Before implementing the request, inspect the OpenAPI specification at:

https://ayurvedic-rag-production.up.railway.app/openapi.json

Do not guess the ChatRequest structure.

Display:

User messages

AyurCare responses

Loading state while the backend is processing

Error state if the API fails

After a successful chat request, refresh/update the conversation history from:

GET /chat/history

so the sidebar stays synchronized with the backend.

8. LOGOUT

Use the existing backend:

POST /auth/logout

Do not implement fake frontend-only logout.

After logout:

Clear the frontend authenticated-user state.

Clear any temporary UI state.

Return the user to the signed-out AyurCare screen.

Do not show their previous private history.

9. UI/UX — VERY IMPORTANT

I want a simple, clean, calm healthcare/wellness interface.

Do NOT make it look like a typical AI product.

Avoid:

futuristic AI graphics

glowing gradients

excessive glassmorphism

robot imagery

"AI" badges

complicated dashboards

unnecessary animations

excessive cards

technical terminology

developer/API language

model names

RAG terminology

The user should feel that this is a trustworthy Ayurvedic wellness application.

10. VISUAL STYLE

Application name:

AyurCare

Design direction:

Minimal

Clean

Warm

Calm

Professional

Healthcare/wellness oriented

Extremely easy to understand

Use a restrained natural visual language inspired by Ayurveda.

Prefer:

soft off-white background

subtle green/natural accents

dark readable text

generous whitespace

rounded but not excessive components

simple icons

clear typography

Do not make the interface visually busy.

11. DESKTOP LAYOUT

For authenticated users, use a simple two-column layout.

LEFT SIDEBAR

AyurCare logo/name at top.

Then:

New conversation

Then:

Your conversations

Show conversations retrieved from:

GET /chat/history

At bottom:

Current user's profile

Profile image

Name

Email

Logout

MAIN CONTENT

Top:

AyurCare

Small supporting text such as:

Your personal Ayurvedic wellness companion.

Then the conversation area.

At the bottom:

Clean message input.

Placeholder:

Ask AyurCare anything about your wellness...

Send button should be simple and obvious.

12. SIGNED-OUT SCREEN

Keep this extremely simple.

Centered AyurCare branding.

Example structure:

AyurCare

Explore Ayurvedic wellness guidance through a simple conversation.

Then:

Sign in with Google

Supporting text:

Sign in to start a conversation and access your previous chats.

Do not show an empty chat interface to unauthenticated users.

Do not show chat history to unauthenticated users.

13. MOBILE RESPONSIVENESS

The application must work extremely well on mobile.

On small screens:

Sidebar becomes a drawer.

Chat takes full width.

Input remains easy to use.

Profile/logout remains accessible.

History remains accessible through a menu button.

Do not simply shrink the desktop UI.

Design the mobile experience intentionally.

14. LOADING STATES

Use simple, subtle loading states.

Examples:

While checking authentication:

Loading AyurCare...

While loading history:

Loading your conversations...

While AyurCare is responding:

Use a subtle typing/loading indicator.

Do not use flashy AI animations.

15. ERROR HANDLING

Handle backend failures gracefully.

If /auth/me fails because the user is not authenticated:

Treat the user as signed out.

If /chat/history fails:

Show:

We couldn't load your conversations right now. Please try again.

If /chat fails:

Show:

Something went wrong while processing your message. Please try again.

Never expose stack traces, API URLs, HTTP debugging information, or backend errors directly to normal users.

16. AUTHENTICATION ARCHITECTURE

Use the backend's existing authentication flow.

Expected conceptual flow:

User
↓
AyurCare frontend
↓
GET /auth/google
↓
Backend Google OAuth
↓
GET /auth/google/callback
↓
Backend establishes authenticated session
↓
Frontend
↓
GET /auth/me
↓
Authenticated user
↓
GET /chat/history
↓
Display user's backend history

Make sure cookies/session credentials are handled correctly for requests to the Railway backend.

Use the appropriate credentials configuration for cross-origin authenticated requests if required by the backend.

Do NOT store Google passwords, OAuth secrets, or backend secrets in the frontend.

17. IMPORTANT — INSPECT THE REAL API

Before writing integration code, inspect:

https://ayurvedic-rag-production.up.railway.app/openapi.json

Use the actual schemas and response structures from the deployed API.

Especially inspect:

ChatRequest

/chat response

/chat/history response

/auth/me response

/auth/google

/auth/google/callback

/auth/logout

Do not create assumptions about the response fields.

Create a small, clean API client layer so backend integration is centralized.

For example conceptually:

api/auth
api/chat

But adapt this to the chosen frontend architecture.

18. DO NOT MOCK THE BACKEND

This is critical.

Do not use:

fake users

fake conversations

mock chat responses

hardcoded history

localStorage history

simulated authentication

The application must communicate with the real deployed AyurCare backend.

If an endpoint response differs from assumptions, adapt the frontend to the actual OpenAPI specification.

19. SESSION INITIALIZATION

When the application loads:

Show a minimal loading state.

Call /auth/me.

If authenticated:

Store current user in frontend state.

Load /chat/history.

Show authenticated AyurCare interface.

If unauthenticated:

Show signed-out AyurCare interface.

Never briefly expose another user's cached history.

20. SECURITY

Never put backend secrets into frontend code.

Never put Google OAuth client secrets into frontend code.

Never trust a frontend-provided user ID for authorization.

The backend session must determine the authenticated user.

Backend remains responsible for:

authentication

authorization

user identity

chat persistence

chat history

RAG processing

Frontend is responsible for:

presentation

user interaction

calling the backend APIs

displaying backend data

21. CODE QUALITY

Use a clean component structure.

Keep:

authentication state

API calls

chat state

history state

UI components

reasonably separated.

Use environment configuration for the backend base URL rather than scattering the Railway URL throughout the code.

For example conceptually:

VITE_API_BASE_URL=https://ayurvedic-rag-production.up.railway.app

Do not expose secrets through environment variables intended to be private.

22. FINAL PRODUCT FEEL

The final result should feel like:

"I opened a clean Ayurvedic wellness application and can simply sign in and talk to AyurCare."

It should NOT feel like:

"I am using a developer-built RAG/AI/API demo."

The backend is already built.

Your job is to build the polished, simple, user-friendly AyurCare frontend around the existing backend.

Before finishing, verify the complete flow:

Signed out → Sign in with Google → authenticated → /auth/me → history from /chat/history → send message through /chat → history updates → logout → signed out.

Do not change the backend unless absolutely required for frontend compatibility. If a backend CORS/cookie configuration prevents the OAuth/session flow from working from the deployed frontend, clearly identify the exact backend configuration that needs to be changed rather than replacing the authentication architecture.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ayurcare-wellness-guide.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/eed8cbec-dc24-4eec-8fc9-f71dcbc4dcd2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
