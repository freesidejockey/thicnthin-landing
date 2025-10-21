# Supabase Integration Guide

> **Purpose**: This document explains how to integrate Supabase forms with database persistence, including both client-side and server-side validation. Use this as a reference pattern for future database-driven features.

---

## Overview

This guide walks through the complete process of creating a form that submits data to Supabase, including:
- Database table creation with RLS policies
- TypeScript type generation
- Server-side validation and actions
- Client-side validation and UI
- Progressive enhancement

---

## Step 1: Create Database Table

Use the Supabase MCP tool to create a migration:

```typescript
mcp__supabase__apply_migration({
  name: "create_table_name",
  query: `-- SQL migration here`
})
```

### Example: Contact Submissions Table

```sql
-- Create a table for contact form submissions
create table public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.contact_submissions enable row level security;

-- Allow anonymous users to insert
create policy "Allow public insert"
  on public.contact_submissions
  for insert
  to anon
  with check (true);

-- Allow anonymous users to read (optional)
create policy "Allow public read"
  on public.contact_submissions
  for select
  to anon
  using (true);
```

**Important Notes:**
- Always enable RLS (Row Level Security) for production tables
- For MVP, you can allow public insert/read, but restrict this in production
- Use meaningful policy names that describe what they allow
- Consider adding policies for authenticated users vs anonymous users

---

## Step 2: Generate TypeScript Types

After creating the table, generate TypeScript types to ensure type safety:

```typescript
mcp__supabase__generate_typescript_types()
```

Save the generated types to: `src/lib/supabase/database.types.ts`

### Update Supabase Clients

Update both client and server Supabase instances to use the typed database:

**Client (`src/lib/supabase/client.ts`):**
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

**Server (`src/lib/supabase/server.ts`):**
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createServerClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}
```

---

## Step 3: Create Server Action with Validation

Create a server action file in your route directory (e.g., `src/app/contact/actions.ts`):

### Key Components:

1. **Type Definitions**: Define interfaces for form data and state
2. **Validation Functions**: Server-side validation logic
3. **Action Function**: The server action that handles form submission

**Example Structure:**

```typescript
'use server'

import { createServerClient } from '@/lib/supabase/server'

export interface FormData {
  field1: string
  field2: string
}

export interface FormState {
  success: boolean
  errors?: {
    field1?: string[]
    field2?: string[]
    _form?: string[]  // General form errors
  }
  message?: string
}

export async function submitForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // 1. Extract form data
  const field1 = formData.get('field1') as string

  // 2. Validate
  const errors: FormState['errors'] = {}
  if (!field1 || field1.trim().length === 0) {
    errors.field1 = ['Field is required']
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  // 3. Insert to database
  try {
    const supabase = createServerClient()
    const { error } = await supabase.from('table_name').insert({
      field1: field1.trim(),
    })

    if (error) {
      return {
        success: false,
        errors: { _form: ['Failed to submit form. Please try again.'] },
      }
    }

    return {
      success: true,
      message: 'Success message',
    }
  } catch (error) {
    return {
      success: false,
      errors: { _form: ['An unexpected error occurred.'] },
    }
  }
}
```

### Validation Best Practices:

- **Required fields**: Check for empty/null values
- **Length constraints**: Enforce min/max character limits
- **Format validation**: Email, phone, etc.
- **Sanitization**: Trim whitespace
- **Error messages**: Clear, user-friendly messages

---

## Step 4: Create Form Component with Client Validation

Create a page component in your route (e.g., `src/app/contact/page.tsx`):

### Key Features:

1. **useFormState**: Manage form submission state
2. **useFormStatus**: Track pending state for submit button
3. **Client-side validation**: Real-time validation on blur/change
4. **Error display**: Show both client and server errors
5. **Success feedback**: Display success messages

**Example Structure:**

```typescript
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { submitForm, type FormState } from './actions'
import { useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

export default function FormPage() {
  const initialState: FormState = { success: false }
  const [formState, formAction] = useFormState(submitForm, initialState)
  const [clientErrors, setClientErrors] = useState<{
    field1?: string
  }>({})

  const validateField = (name: string, value: string) => {
    const errors = { ...clientErrors }

    // Validation logic
    if (!value.trim()) {
      errors[name] = 'Field is required'
    } else {
      delete errors[name]
    }

    setClientErrors(errors)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.name, e.target.value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (clientErrors[e.target.name]) {
      validateField(e.target.name, e.target.value)
    }
  }

  return (
    <form action={formAction}>
      {/* Success message */}
      {formState.success && (
        <div className="bg-green-50 p-4">
          <p className="text-green-800">{formState.message}</p>
        </div>
      )}

      {/* Form-level errors */}
      {formState.errors?._form && (
        <div className="bg-red-50 p-4">
          <p className="text-red-800">{formState.errors._form[0]}</p>
        </div>
      )}

      {/* Input field */}
      <div>
        <label htmlFor="field1">Field Label</label>
        <input
          type="text"
          name="field1"
          id="field1"
          onBlur={handleBlur}
          onChange={handleChange}
        />

        {/* Field-level errors */}
        {(clientErrors.field1 || formState.errors?.field1) && (
          <p className="text-red-600">
            {clientErrors.field1 || formState.errors?.field1?.[0]}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  )
}
```

### Client Validation Strategy:

- **On Blur**: Validate when user leaves the field
- **On Change**: Re-validate if field had errors
- **Show client errors immediately**: Better UX
- **Show server errors after submission**: Catch edge cases
- **Prioritize client errors**: Show client error if both exist

---

## Step 5: Styling Considerations

Follow the design system guidelines in `DESIGN_SYSTEM.md`:

### Form Elements:
- **Input fields**: `ring-1 ring-inset ring-gray-300`
- **Focus states**: `focus:ring-2 focus:ring-blue-600`
- **Error states**: `text-red-600` for error messages
- **Success states**: `bg-green-50` with `text-green-800`
- **Disabled states**: `disabled:opacity-50 disabled:cursor-not-allowed`

### Color Palette:
- **Primary actions**: Blue-600 (`#2563EB`)
- **Hover states**: Blue-500 (`#3B82F6`)
- **Error messages**: Red-600
- **Success messages**: Green-800 on Green-50 background

---

## Complete Example: Contact Form

Reference the implementation in:
- **Database**: Migration `create_contact_submissions_table`
- **Types**: `src/lib/supabase/database.types.ts`
- **Server Action**: `src/app/contact/actions.ts`
- **Form Component**: `src/app/contact/page.tsx`

### Files Created:
1. `src/lib/supabase/database.types.ts` - Generated types
2. `src/app/contact/actions.ts` - Server-side logic
3. `src/app/contact/page.tsx` - Client-side form

### MCP Commands Used:
1. `mcp__supabase__apply_migration` - Create table
2. `mcp__supabase__generate_typescript_types` - Generate types

---

## Troubleshooting

### Common Issues:

1. **RLS Policy Blocks Insert**
   - Check that policies allow the correct role (anon/authenticated)
   - Verify environment variables are set correctly

2. **TypeScript Errors**
   - Regenerate types after schema changes
   - Ensure both client and server files import `Database` type

3. **Form Not Submitting**
   - Check network tab for errors
   - Verify server action is marked with `'use server'`
   - Check Supabase logs via MCP: `mcp__supabase__get_logs`

4. **Validation Not Working**
   - Ensure field names match between validation and form
   - Check that error state is properly tracked

---

## Security Checklist

Before deploying to production:

- [ ] Review RLS policies - restrict public access appropriately
- [ ] Add rate limiting for form submissions
- [ ] Sanitize all user inputs
- [ ] Add CAPTCHA for public forms
- [ ] Set up database backups
- [ ] Monitor for suspicious activity
- [ ] Add input length limits at database level
- [ ] Consider adding email verification

---

## Next Steps

To create a new form:

1. Design your table schema
2. Create migration using `mcp__supabase__apply_migration`
3. Regenerate TypeScript types
4. Create server action with validation
5. Build form component with client validation
6. Test thoroughly with edge cases
7. Apply styling from design system
8. Review security implications

---

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Design System](./DESIGN_SYSTEM.md)
