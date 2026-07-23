---
name: clerk-auth
description: Clerk authentication patterns — OAuth, auth guards, token management with @clerk/clerk-expo v2
---

# Clerk Auth — Authentication Patterns

## Architecture

| Layer | File | Role |
|-------|------|------|
| Provider | `components/provider/provider.tsx` | `ClerkProvider` + `tokenCache` |
| API client | `api/client.ts` | Ky with auth token via `beforeRequest` hook |
| Route guard | Custom hook | Redirect unauthenticated to login |

## Patterns

### 1. Provider Setup

```typescript
// components/provider/provider.tsx
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ClerkProvider>
  );
}
```

`ClerkProvider` must be outermost — above `QueryClientProvider`. `tokenCache` uses `expo-secure-store` on native; `undefined` on web (HTTP-only cookies). Reads `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` from `.env` automatically.

### 2. OAuth Flows

Use `useSSO()` (deprecates `useOAuth()`):

```typescript
import { useSSO } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

function SignInWithGoogle() {
  const { startSSOFlow } = useSSO();
  const handleSignIn = async () => {
    const { createdSessionId, setActive } =
      await startSSOFlow({ strategy: 'oauth_google' });
    if (createdSessionId && setActive) await setActive({ session: createdSessionId });
  };
  return <Button title="Sign in with Google" onPress={handleSignIn} />;
}
```

Strategies: `oauth_google`, `oauth_apple`, `oauth_facebook`, `oauth_github`. Call `maybeCompleteAuthSession()` at module level in files using OAuth.

### 3. SecureStore Token Handling

`tokenCache` from `@clerk/clerk-expo/token-cache` implements:

```typescript
interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}
```

Pass to `ClerkProvider` — Clerk manages refresh/rotation internally. For custom storage (e.g., biometric gate), implement `TokenCache`.

### 4. Auth Guards in Expo Router

```typescript
// hooks/use-protect-route.ts
import { useAuth } from '@clerk/clerk-expo';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export function useProtectRoute() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!isSignedIn && !inAuthGroup) router.replace('/(auth)/sign-in');
    else if (isSignedIn && inAuthGroup) router.replace('/(tabs)');
  }, [isSignedIn, isLoaded, segments]);
}
```

Call in root `_layout.tsx`. Per-screen guard: check `useAuth()` inline with `<Redirect />`.

### 5. Clerk + TanStack Query

```typescript
// api/client.ts
export function useAuthedApi() {
  const { getToken } = useAuth();
  return ky.create({
    baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://equran.id/api/',
    headers: { Accept: 'application/json' },
    hooks: {
      beforeRequest: [async (req) => {
        const token = await getToken();
        if (token) req.headers.set('Authorization', `Bearer ${token}`);
      }],
    },
  });
}

// usage
const api = useAuthedApi();
const useUserProfile = () => useQuery({
  queryKey: ['user-profile'],
  queryFn: () => api.get('me').json(),
});
```

Use public `api` (no auth) for equran.id. Use `useAuthedApi()` for your own backend. `getToken()` returns short-lived session token — Clerk auto-refreshes via SecureStore refresh token.

### 6. User Profile Management

```typescript
import { useUser } from '@clerk/clerk-expo';

function ProfileEditor() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;

  // Read
  user.fullName;
  user.primaryEmailAddress?.emailAddress;
  user.publicMetadata?.role;   // set from backend

  // Write
  await user.update({ firstName: 'New' });
  await user.update({ publicMetadata: { preferences: { theme: 'dark' } } });
}
```

`publicMetadata` readable frontend-side; `privateMetadata` backend-only via Backend API.

### 7. Sign Out Flow

```typescript
import { useAuth } from '@clerk/clerk-expo';
const { signOut } = useAuth();
await signOut(); // clears session from memory + SecureStore
router.replace('/(auth)/sign-in'); // immediate redirect (useProtectRoute also handles it)
```

### 8. Error Handling

```typescript
import { isClerkAPIResponseError } from '@clerk/clerk-expo';

try {
  await startSSOFlow({ strategy: 'oauth_google' });
} catch (err) {
  if (isClerkAPIResponseError(err)) {
    // Typed Clerk errors: err.errors.forEach(e => e.code, e.message)
  }
  // Network error or user cancelled OAuth
}
```

Codes: `session_expired` (re-auth needed), `oauth_access_denied` (user cancelled), `missing_session_token` (not signed in). If `getToken()` returns null, session is expired — force re-auth.

## Common Pitfalls

- **Provider order**: `ClerkProvider` must wrap `QueryClientProvider`.
- **`isLoaded`**: Always check before reading `isSignedIn` or `user` — Clerk hydrates async.
- **OAuth redirects**: `WebBrowser.maybeCompleteAuthSession()` at module level.
- **No Next.js middleware**: Expo Router guards use hooks, not middleware.
- **equran.id is public**: Only auth requests to your own backend.

## Related Skills

- `tanstack-query-zustand` — authed API client with TanStack Query
- `expo-router-v4` — `(auth)` route groups, redirect patterns
- `nativewind-v4` — styling auth screens
