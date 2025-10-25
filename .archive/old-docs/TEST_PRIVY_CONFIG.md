# Privy Configuration Issues & Solutions

## Current Error
"Origin not allowed" - The app is trying to connect from an origin that's not whitelisted in Privy dashboard.

## Debug Information Needed
Run the app and check browser console for:
- Current Origin being used
- App ID being sent
- Protocol (http/https)

## Solutions:

### Option 1: Fix Current App
1. Login to https://dashboard.privy.io
2. Find app with ID: `cmfsej8w7013cle0df5ottcj6`
3. Go to Settings → Security → Allowed Domains
4. Add ALL of these:
   ```
   http://localhost:3000
   http://localhost:3001
   http://127.0.0.1:3000
   http://127.0.0.1:3001
   http://[::1]:3000
   https://localhost:3000
   ```

### Option 2: Create New Test App
If you can't access the dashboard or settings:

1. Go to https://dashboard.privy.io
2. Create a new app called "LaunchOS Dev"
3. Get the new App ID
4. Update `.env.local` with new ID
5. Add localhost origins during setup

### Option 3: Temporary Bypass (Development Only)
For testing the rest of the app without auth:

```typescript
// In PrivyProviderWrapper.tsx, temporarily bypass Privy:
export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  // TEMPORARY: Skip Privy for testing
  return <>{children}</>
}
```

Then create a mock wallet context for testing.

## Common Causes:
1. **App was created by someone else** - You might not have access to settings
2. **Origins were cleared** - Someone might have removed localhost
3. **App ID mismatch** - Using wrong app ID
4. **Protocol mismatch** - http vs https

## To Check in Browser:
1. Open DevTools (F12)
2. Go to Console
3. Look for "🔍 Privy Debug Info"
4. Note the exact origin shown
5. Add that exact origin to Privy dashboard