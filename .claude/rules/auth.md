# Auth & Access Control Rules

## Session access
Use `getSessionData()` from `@/lib/utils` to get session info:
```ts
const { isAdmin, isSuperAdmin, userMail, userName, isLoggedIn } = await getSessionData();
```
- `isAdmin`: includes both admins and superAdmins (arnaud.gathy@gmail.com + arno.firefox@gmail.com)
- `isSuperAdmin`: only arno.firefox@gmail.com

## Restricting routes to admins
Use the helper for one-liner protection in Server Components:
```ts
await restrictToAdmins(); // redirects to "/" if not admin
```

## Encounters are admin-only
The `/encounters` route always calls `restrictToAdmins()`. All encounter-related pages follow the same pattern.

## Middleware
`src/middleware.ts` handles session-based route protection at the edge. Do not duplicate route protection logic that already lives there.

## NextAuth config
`auth.ts` at the project root — Google OAuth provider with a static email whitelist. To add a user, add their email to the `authorized` array in `auth.ts`.

## Root redirect logic
`src/app/page.tsx` redirects based on role:
- superAdmin → `/encounters`
- admin → `/encounters`
- logged-in (not admin) → `/characters`
- not logged in → `/landing`
