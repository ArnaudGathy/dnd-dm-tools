# Server Actions Rules

All mutation functions (create, update, delete) go in `src/lib/actions/*.ts`.
All read-only query functions go in `src/lib/api/*.ts`.

## Required file headers
Every server action file must start with:
```ts
"use server";
import "server-only";
```

## revalidatePath
Always call `revalidatePath()` after mutations so Next.js ISR cache is invalidated:
```ts
revalidatePath(`/characters/${characterId}/creatures`);
```
Use the most specific path possible. Avoid revalidating `/` or broad paths.

## Form actions (useActionState pattern)
Form-based actions follow this signature:
```ts
export const myAction = async (
  prevState: { error?: string; message?: string },
  formData: FormData,
) => { ... }
```
Validate with Zod before any Prisma calls. Return `{ error: "..." }` on failure, `{ message: "...", error: "" }` on success.

## Direct actions (called from event handlers)
Use a plain async function with typed parameters — no FormData, no prevState:
```ts
export async function setCreatureFavorite({ characterId, creatureId, currentState }: {...}) { ... }
```

## Error handling
- Throw only for unrecoverable programmer errors
- Return `{ error: string }` for user-facing validation or not-found errors
- Always log unexpected errors with `console.error` before returning
