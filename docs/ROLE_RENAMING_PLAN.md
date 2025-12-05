# Role Renaming Plan: Citizen/Official → Member/Agent

## 🎯 Project Context

**Project:** Real Estate Social Media Platform (formerly civic-tech app)  
**Goal:** Transform the app from a civic engagement platform to a real estate networking platform for realtors, agents, and people interested in real estate services in the **United States**.

**Target Users:**

- **Members** - General users (home buyers, sellers, investors, anyone interested in real estate)
- **Agents** - Real estate professionals (realtors, agents, brokers)
- **Admins** - Platform administrators (unchanged)

---

## 📋 Overview

This document contains ALL information needed to rename user roles from civic-tech terminology to real estate platform terminology.

| Current    | New      | Display Name        |
| ---------- | -------- | ------------------- |
| `citizen`  | `member` | "Member"            |
| `official` | `agent`  | "Real Estate Agent" |
| `admin`    | `admin`  | "Admin" (unchanged) |

---

## ✅ Decisions Made

| Question             | Answer                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Migration Strategy   | **Reset database** (development) - use `npx prisma db push --force-reset`                 |
| License Verification | Use existing `isVerified` field (no new field needed)                                     |
| Agent Display Name   | **"Real Estate Agent"**                                                                   |
| Specializations UI   | **Checkboxes** (multi-select)                                                             |
| License Info         | **Optional** - collect but don't require verification                                     |
| Future User Types    | Property Managers, Mortgage Lenders, Home Inspectors, Title Companies (planned for later) |

---

## 🗄️ Database Changes (Prisma Schema)

**File:** `backend/prisma/schema.prisma`

### 1. Update UserRole Enum

```prisma
// CHANGE FROM:
enum UserRole {
  citizen
  official
  admin
}

// CHANGE TO:
enum UserRole {
  member
  agent
  admin
}
```

### 2. Add Agent-Specific Fields to User Model

Add these fields to the `User` model (after `pincode` field, before `role` field):

```prisma
// Real Estate Agent fields (optional)
licenseNumber    String?   // Real estate license number
licenseState     String?   // State where licensed (e.g., "CA", "TX")
brokerage        String?   // Brokerage/Agency name
yearsExperience  Int?      // Years in real estate
specializations  String[]  @default([]) // e.g., ["Residential", "Commercial", "Luxury"]
```

### 3. Run Migration

```bash
cd backend
npx prisma db push --force-reset
npx prisma db seed
```

---

## 🔧 Backend Changes

### File 1: `backend/prisma/seed.ts`

Update all seed data to use new roles:

- Replace `role: 'citizen'` with `role: 'member'`
- Replace `role: 'official'` with `role: 'agent'`

### File 2: `backend/src/controllers/authController.ts`

1. Update role validation to accept `"member" | "agent"` instead of `"citizen" | "official"`
2. Add agent fields to registration:

```typescript
// Registration should accept these new optional fields:
licenseNumber?: string;
licenseState?: string;
brokerage?: string;
yearsExperience?: number;
specializations?: string[];
```

3. Pass agent fields to Prisma create when role is "agent"

### File 3: `backend/src/controllers/userController.ts`

Add agent fields to allowed profile update fields:

```typescript
"licenseNumber",
  "licenseState",
  "brokerage",
  "yearsExperience",
  "specializations";
```

### File 4: `backend/src/controllers/adminController.ts`

Search and replace any role checks:

- `role === 'citizen'` → `role === 'member'`
- `role === 'official'` → `role === 'agent'`

### File 5: `backend/src/middleware/auth.ts`

Update any role-based middleware functions if they reference old role names.

### File 6: `backend/src/routes/auth.ts`

Update validation schemas to accept new role values and agent fields.

### File 7: `backend/src/routes/users.ts`

Update validation schemas to accept agent fields for profile updates.

---

## 🎨 Frontend Changes

### File 1: `lib/types.ts`

#### Update UserRole type (line ~7):

```typescript
// FROM:
export type UserRole = "citizen" | "official" | "admin";

// TO:
export type UserRole = "member" | "agent" | "admin";
```

#### Add agent fields to User interface (after `pincode` field):

```typescript
// Real Estate Agent fields (optional)
licenseNumber?: string | null
licenseState?: string | null
brokerage?: string | null
yearsExperience?: number | null
specializations?: string[]
```

### File 2: `lib/api-service.ts`

#### Update register function (line ~206-214):

```typescript
export async function register(userData: {
  name: string;
  email: string;
  password: string;
  role: "member" | "agent"; // Changed from "citizen" | "official"
  location?: string;
  phone?: string;
  // Agent-specific fields (optional)
  licenseNumber?: string;
  licenseState?: string;
  brokerage?: string;
  yearsExperience?: number;
  specializations?: string[];
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    "POST",
    userData
  );
}
```

### File 3: `components/auth-provider.tsx`

#### Update RegisterData interface:

```typescript
interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "member" | "agent"; // Changed
  location?: string;
  phone?: string;
  // Agent-specific fields
  licenseNumber?: string;
  licenseState?: string;
  brokerage?: string;
  yearsExperience?: number;
  specializations?: string[];
}
```

### File 4: `app/login/page.tsx`

#### Changes needed:

1. **Tab labels:**

   - `"Citizen"` → `"Member"`
   - `"Government Official"` → `"Agent"`

2. **Tab values:**

   - `value="citizen"` → `value="member"`
   - `value="official"` → `value="agent"`

3. **Card titles:**

   - `"Citizen Login"` → `"Member Login"`
   - `"Government Official Login"` → `"Agent Login"`

4. **Card descriptions:**

   - Keep member description as is
   - Change official description to: `"Login for real estate professionals"`

5. **Form labels (Agent tab):**

   - `"Official ID"` → `"Email"`
   - Remove DigiLocker references

6. **Button text:**

   - `"Login with DigiLocker"` → `"Login"`

7. **Variable names (recommended):**
   - `citizenEmail` → `memberEmail`
   - `citizenPassword` → `memberPassword`
   - `officialId` → `agentEmail`
   - `officialPassword` → `agentPassword`
   - `handleCitizenLogin` → `handleMemberLogin`
   - `handleOfficialLogin` → `handleAgentLogin`

### File 5: `app/signup/page.tsx`

#### Changes needed:

1. **Tab labels:**

   - `"Citizen"` → `"Member"`
   - `"Government Official"` → `"Agent"`

2. **Tab values:**

   - `value="citizen"` → `value="member"`
   - `value="official"` → `value="agent"`

3. **Card titles:**

   - `"Create Citizen Account"` → `"Create Member Account"`
   - `"Government Official Registration"` → `"Agent Registration"`

4. **Card descriptions:**

   - `"Enter your details to create your account"` → `"Join our real estate community"`
   - `"Create an account with official verification"` → `"Register as a real estate professional"`

5. **REMOVE from Agent tab:**

   - Department dropdown (government departments)
   - Employee ID field
   - DigiLocker verification note

6. **ADD to Agent tab (all optional):**

```tsx
// State variables to add:
const [agentBrokerage, setAgentBrokerage] = useState("");
const [agentLicense, setAgentLicense] = useState("");
const [agentLicenseState, setAgentLicenseState] = useState("");
const [agentExperience, setAgentExperience] = useState("");
const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

// Toggle function for specializations:
const toggleSpec = (spec: string) => {
  setSelectedSpecs((prev) =>
    prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
  );
};

// Form fields to add:

{
  /* Brokerage/Agency Name */
}
<div className="space-y-2">
  <Label htmlFor="brokerage">Brokerage/Agency Name (Optional)</Label>
  <Input
    id="brokerage"
    placeholder="Enter your brokerage name"
    value={agentBrokerage}
    onChange={(e) => setAgentBrokerage(e.target.value)}
  />
</div>;

{
  /* License Number */
}
<div className="space-y-2">
  <Label htmlFor="license">Real Estate License # (Optional)</Label>
  <Input
    id="license"
    placeholder="Enter your license number"
    value={agentLicense}
    onChange={(e) => setAgentLicense(e.target.value)}
  />
</div>;

{
  /* License State - US States dropdown */
}
<div className="space-y-2">
  <Label htmlFor="license-state">License State (Optional)</Label>
  <Select value={agentLicenseState} onValueChange={setAgentLicenseState}>
    <SelectTrigger>
      <SelectValue placeholder="Select state" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="AL">Alabama</SelectItem>
      <SelectItem value="AK">Alaska</SelectItem>
      <SelectItem value="AZ">Arizona</SelectItem>
      <SelectItem value="AR">Arkansas</SelectItem>
      <SelectItem value="CA">California</SelectItem>
      <SelectItem value="CO">Colorado</SelectItem>
      <SelectItem value="CT">Connecticut</SelectItem>
      <SelectItem value="DE">Delaware</SelectItem>
      <SelectItem value="FL">Florida</SelectItem>
      <SelectItem value="GA">Georgia</SelectItem>
      <SelectItem value="HI">Hawaii</SelectItem>
      <SelectItem value="ID">Idaho</SelectItem>
      <SelectItem value="IL">Illinois</SelectItem>
      <SelectItem value="IN">Indiana</SelectItem>
      <SelectItem value="IA">Iowa</SelectItem>
      <SelectItem value="KS">Kansas</SelectItem>
      <SelectItem value="KY">Kentucky</SelectItem>
      <SelectItem value="LA">Louisiana</SelectItem>
      <SelectItem value="ME">Maine</SelectItem>
      <SelectItem value="MD">Maryland</SelectItem>
      <SelectItem value="MA">Massachusetts</SelectItem>
      <SelectItem value="MI">Michigan</SelectItem>
      <SelectItem value="MN">Minnesota</SelectItem>
      <SelectItem value="MS">Mississippi</SelectItem>
      <SelectItem value="MO">Missouri</SelectItem>
      <SelectItem value="MT">Montana</SelectItem>
      <SelectItem value="NE">Nebraska</SelectItem>
      <SelectItem value="NV">Nevada</SelectItem>
      <SelectItem value="NH">New Hampshire</SelectItem>
      <SelectItem value="NJ">New Jersey</SelectItem>
      <SelectItem value="NM">New Mexico</SelectItem>
      <SelectItem value="NY">New York</SelectItem>
      <SelectItem value="NC">North Carolina</SelectItem>
      <SelectItem value="ND">North Dakota</SelectItem>
      <SelectItem value="OH">Ohio</SelectItem>
      <SelectItem value="OK">Oklahoma</SelectItem>
      <SelectItem value="OR">Oregon</SelectItem>
      <SelectItem value="PA">Pennsylvania</SelectItem>
      <SelectItem value="RI">Rhode Island</SelectItem>
      <SelectItem value="SC">South Carolina</SelectItem>
      <SelectItem value="SD">South Dakota</SelectItem>
      <SelectItem value="TN">Tennessee</SelectItem>
      <SelectItem value="TX">Texas</SelectItem>
      <SelectItem value="UT">Utah</SelectItem>
      <SelectItem value="VT">Vermont</SelectItem>
      <SelectItem value="VA">Virginia</SelectItem>
      <SelectItem value="WA">Washington</SelectItem>
      <SelectItem value="WV">West Virginia</SelectItem>
      <SelectItem value="WI">Wisconsin</SelectItem>
      <SelectItem value="WY">Wyoming</SelectItem>
      <SelectItem value="DC">Washington D.C.</SelectItem>
    </SelectContent>
  </Select>
</div>;

{
  /* Years of Experience */
}
<div className="space-y-2">
  <Label htmlFor="experience">Years of Experience (Optional)</Label>
  <Select value={agentExperience} onValueChange={setAgentExperience}>
    <SelectTrigger>
      <SelectValue placeholder="Select experience" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="0">Less than 1 year</SelectItem>
      <SelectItem value="1">1-3 years</SelectItem>
      <SelectItem value="3">3-5 years</SelectItem>
      <SelectItem value="5">5-10 years</SelectItem>
      <SelectItem value="10">10+ years</SelectItem>
    </SelectContent>
  </Select>
</div>;

{
  /* Specializations - Checkboxes */
}
<div className="space-y-2">
  <Label>Specializations (Optional)</Label>
  <div className="grid grid-cols-2 gap-2">
    {[
      "Residential",
      "Commercial",
      "Luxury",
      "Investment",
      "First-Time Buyers",
      "Relocation",
    ].map((spec) => (
      <div key={spec} className="flex items-center space-x-2">
        <Checkbox
          id={`spec-${spec}`}
          checked={selectedSpecs.includes(spec)}
          onCheckedChange={() => toggleSpec(spec)}
        />
        <label htmlFor={`spec-${spec}`} className="text-sm cursor-pointer">
          {spec}
        </label>
      </div>
    ))}
  </div>
</div>;

{
  /* Info Note */
}
<div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
  <p className="text-xs text-blue-700 dark:text-blue-300">
    <strong>Note:</strong> License information is optional. Verified agents
    (with confirmed license) receive a badge on their profile.
  </p>
</div>;
```

7. **Update submit handler:**

```typescript
const success = await register({
  name: `${agentFirstName} ${agentLastName}`,
  email: agentEmail,
  password: agentPassword,
  role: "agent",
  phone: agentPhone || undefined,
  licenseNumber: agentLicense || undefined,
  licenseState: agentLicenseState || undefined,
  brokerage: agentBrokerage || undefined,
  yearsExperience: agentExperience ? parseInt(agentExperience) : undefined,
  specializations: selectedSpecs.length > 0 ? selectedSpecs : undefined,
});
```

8. **Variable names (recommended):**
   - `officialFirstName` → `agentFirstName`
   - `officialLastName` → `agentLastName`
   - `officialEmail` → `agentEmail`
   - `officialPassword` → `agentPassword`
   - `officialPhone` → `agentPhone`
   - `handleOfficialSubmit` → `handleAgentSubmit`

### File 6: `components/social-feed.tsx`

Search and replace:

- `role === "official"` → `role === "agent"`
- `isOfficial` → `isAgent` (variable names)
- Badge text: `"Official"` → `"Real Estate Agent"` (or just `"Agent"` if space is limited)

### File 7: `components/sidebar.tsx`

Update role display text. Replace any:

- `"citizen"` display → `"Member"`
- `"official"` display → `"Real Estate Agent"`

Consider adding a helper function:

```typescript
const getRoleDisplayName = (role: string) => {
  switch (role) {
    case "agent":
      return "Real Estate Agent";
    case "member":
      return "Member";
    case "admin":
      return "Admin";
    default:
      return role;
  }
};
```

### File 8: `app/connections/page.tsx`

Update role checks and badge text:

- `role === "official"` → `role === "agent"`
- Badge: `"Official"` → `"Real Estate Agent"`

### File 9: `app/messages/page.tsx`

Update role checks:

- `role === "official"` → `role === "agent"`
- Any display text referencing "Official" → "Real Estate Agent"

### File 10: `app/search/page.tsx`

Update role display:

```typescript
// FROM:
{
  user.role === "official" ? "Government Official" : "Citizen";
}

// TO:
{
  user.role === "agent" ? "Real Estate Agent" : "Member";
}
```

### File 11: `app/settings/page.tsx`

Update profile visibility options:

```tsx
// FROM:
<SelectItem value="officials">Government Officials Only</SelectItem>

// TO:
<SelectItem value="agents">Agents Only</SelectItem>
```

### File 12: `app/admin/page.tsx`

Update all role displays and filters:

- `"citizen"` → `"member"`
- `"official"` → `"agent"`
- `"Government Official"` → `"Real Estate Agent"`
- `"Citizen"` → `"Member"`

---

## 📁 Complete File List

### Backend (7 files)

1. `backend/prisma/schema.prisma` - Enum + new fields
2. `backend/prisma/seed.ts` - Update roles in seed data
3. `backend/src/controllers/authController.ts` - Registration logic
4. `backend/src/controllers/userController.ts` - Profile update
5. `backend/src/controllers/adminController.ts` - Role checks
6. `backend/src/routes/auth.ts` - Validation
7. `backend/src/routes/users.ts` - Validation

### Frontend (12 files)

1. `lib/types.ts` - TypeScript types
2. `lib/api-service.ts` - API function
3. `components/auth-provider.tsx` - Auth context
4. `app/login/page.tsx` - Login page
5. `app/signup/page.tsx` - Signup page (major changes)
6. `components/social-feed.tsx` - Feed badges
7. `components/sidebar.tsx` - Role display
8. `app/connections/page.tsx` - Connection badges
9. `app/messages/page.tsx` - Message role checks
10. `app/search/page.tsx` - Search results
11. `app/settings/page.tsx` - Privacy options
12. `app/admin/page.tsx` - Admin panel

---

## 🚀 Implementation Order

### Phase 1: Backend

1. Update `schema.prisma` (enum + fields)
2. Run `npx prisma db push --force-reset`
3. Update `seed.ts` and run `npx prisma db seed`
4. Update controllers and routes
5. Test API with Postman/curl

### Phase 2: Frontend Types

1. Update `lib/types.ts`
2. Update `lib/api-service.ts`
3. Update `components/auth-provider.tsx`

### Phase 3: Auth Pages

1. Update `app/login/page.tsx`
2. Update `app/signup/page.tsx` (most complex)
3. Test login/signup flows

### Phase 4: Other Components

1. Update `components/social-feed.tsx`
2. Update `components/sidebar.tsx`
3. Update remaining pages

### Phase 5: Verification

1. Test member registration & login
2. Test agent registration (with/without license info)
3. Verify role badges display correctly
4. Test admin panel

---

## 🧪 Test Credentials (After Migration)

Create these test users via seed or manually:

| Role   | Email                | Password    |
| ------ | -------------------- | ----------- |
| Member | member@test.com      | password123 |
| Agent  | agent@test.com       | password123 |
| Admin  | admin@realestate.com | admin123    |

---

## ❓ Notes

- The existing `isVerified` field on User model will be used for license verification
- All agent-specific fields are OPTIONAL during registration
- Specializations use checkboxes (can select multiple)
- Geographic focus is United States (all 50 states + DC in dropdown)
- Monetization strategy TBD
- Future user types (Property Managers, Lenders, etc.) will be added later

---

**Document Last Updated:** Ready for implementation
**Status:** ✅ Approved - Ready to implement
