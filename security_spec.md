# Security Specification & Threat Model ("Fortress" Ruleset Version 2)

## 1. Data Invariants
1. **User Ownership Constraint**: A user can only read, write, update, or delete records that belong directly to their authenticated sub-resource subtree (i.e. `/users/{userId}/**` where `{userId}` strictly matches `request.auth.uid`).
2. **Identity Integrity**: For every document where a `userId` property exists in the schema, the value of that property must match `request.auth.uid` during creation and remains immutable during update.
3. **Enum Verification**: Properties like `theme` (`"default"`, `"light"`, `"ocean"`, `"sunset"`), `mood` (`"excellent"`, `"good"`, `"average"`, `"low"`, `"crisis"`), and `priority` (`"critical"`, `"high"`, `"medium_low"`) must strictly match their predefined enum lists.
4. **Range / Bound Validation**: `energyLevel` must be an integer between 1 and 10. `focusHours` must be a positive number between 0 and 24. `pipelineLeads` must be a non-negative integer.
5. **Path Hardening**: Document IDs can contain only standard characters matching `^[a-zA-Z0-9_\-]+$` and must not exceed 128 characters (no path poisoning).
6. **No Email Spoofing**: All write operations verify user authentication and require `request.auth.token.email_verified == true` for standard actions.

---

## 2. The "Dirty Dozen" Payloads

Below are the 12 malicious or structurally corrupt payloads designed to bypass core rules. Each must be rejected with `PERMISSION_DENIED`.

### Payload 1: Identity Spoofing (Theme Hack)
- **Objective**: Authenticated user "Shomoy" tries to write / overwrite user settings belonging to "Bob".
- **Path**: `/users/bob`
- **Auth User ID**: `shomoy_roy`
- **Data**:
  ```json
  {
    "userId": "shomoy_roy",
    "email": "shomoy@gmail.com",
    "theme": "light",
    "currentDay": 20
  }
  ```

### Payload 2: Path Poisoning (Special Characters Injection)
- **Objective**: User attempts to inject malicious characters into their path ID.
- **Path**: `/users/shomoy_roy/todo_items/todo-inject#%*`
- **Auth User ID**: `shomoy_roy`
- **Data**:
  ```json
  {
    "id": "todo-inject#%*",
    "userId": "shomoy_roy",
    "taskText": "Poison path item",
    "priority": "critical",
    "completed": false,
    "date": "2026-05-31"
  }
  ```

### Payload 3: Shadow Privilege Escalation (Adding Undefined fields)
- **Objective**: Attempting to inject administrative role fields or undocumented keys like `isAdmin` into the user profile.
- **Path**: `/users/shomoy_roy`
- **Auth User ID**: `shomoy_roy`
- **Data**:
  ```json
  {
    "userId": "shomoy_roy",
    "email": "shomoy@gmail.com",
    "theme": "sunset",
    "currentDay": 25,
    "isAdmin": true,
    "bypassCheck": "yes"
  }
  ```

### Payload 4: Orphaned Log Creation (Mismatching userId)
- **Objective**: Shomoy logs a day's stats, but places another user's UID in the payload.
- **Path**: `/users/shomoy_roy/daily_logs/2026-05-31`
- **Auth User ID**: `shomoy_roy`
- **Data**:
  ```json
  {
    "id": "2026-05-31",
    "userId": "bob_spoofer",
    "date": "2026-05-31",
    "mood": "excellent",
    "energyLevel": 8,
    "salatCongregation": true,
    "nicotineFree": true,
    "quranHifz": true,
    "focusHours": 6
  }
  ```

### Payload 5: Denial of Wallet (Massive ID Payload)
- **Objective**: Injecting an extremely long string as the document ID to bloat index sizes.
- **Path**: `/users/shomoy_roy/daily_logs/LONG_ID_REPEATED_OVER_500_CHARACTERS_THAT_SHOULD_BE_BLOCKED_BY_SIZE_ENFORCEMENT_GATES`
- **Auth User ID**: `shomoy_roy`
- **Data**:
  ```json
  {
    "id": "LONG_ID_REPEATED_OVER_500",
    "userId": "shomoy_roy",
    "date": "2026-05-31",
    "mood": "good",
    "energyLevel": 8
  }
  ```

### Payload 6: Invalid Mood Enum Injection
- **Objective**: Injecting a custom mood status value not specified by the blueprint ("depressed").
- **Path**: `/users/shomoy_roy/daily_logs/2026-05-31`
- **Auth User ID**: `shomoy_roy`
- **Data**:
  ```json
  {
    "id": "2026-05-31",
    "userId": "shomoy_roy",
    "date": "2026-05-31",
    "mood": "depressed",
    "energyLevel": 5,
    "salatCongregation": true,
    "nicotineFree": false,
    "quranHifz": false,
    "focusHours": 4
  }
  ```

### Payload 7: Focus Hours Out of Boundary (Over-range)
- **Objective**: Spammer submits `focusHours` with an impossible numeric range (e.g. 500 hours/day).
- **Path**: `/users/shomoy_roy/daily_logs/2026-05-31`
- **Auth User ID**: `shomoy_roy`
- **Data**:
  ```json
  {
    "id": "2026-05-31",
    "userId": "shomoy_roy",
    "date": "2026-05-31",
    "mood": "good",
    "energyLevel": 9,
    "focusHours": 500
  }
  ```

### Payload 8: Negative Volt Level Allocation (Out of bounds)
- **Objective**: Submitting negative volts check for `energyLevel`.
- **Path**: `/users/shomoy_roy/daily_logs/2026-05-31`
- **Auth User ID**: `shomoy_roy`
- **Data**:
  ```json
  {
    "id": "2026-05-31",
    "userId": "shomoy_roy",
    "date": "2026-05-31",
    "mood": "good",
    "energyLevel": -5
  }
  ```

### Payload 9: Invalid Priority Enum Injection to Todo
- **Objective**: Specifying non-sanctioned priority enum values like "urgent" as a backdoor bypass attempt.
- **Path**: `/users/shomoy_roy/todo_items/todo-1`
- **Auth User ID**: `shomoy_roy`
- **Data**:
  ```json
  {
    "id": "todo-1",
    "userId": "shomoy_roy",
    "taskText": "Read Qur'an",
    "priority": "urgent",
    "completed": false,
    "date": "2026-05-31"
  }
  ```

### Payload 10: Task Mutation to Impersonate Owner
- **Objective**: Shomoy tries to override an existing task to change its parent ownership to bob.
- **Path**: `/users/shomoy_roy/todo_items/todo-1`
- **Auth User ID**: `shomoy_roy`
- **Data**:
  ```json
  {
    "id": "todo-1",
    "userId": "bob_spoofer",
    "taskText": "Read Qur'an",
    "priority": "critical",
    "completed": false,
    "date": "2026-05-31"
  }
  ```

### Payload 11: Task Text Exhaustion (Denial of Wallet)
- **Objective**: Exceeding reasonable text bounds inside `taskText` (e.g. injecting 2MB text block).
- **Path**: `/users/shomoy_roy/todo_items/todo-1`
- **Auth User ID**: `shomoy_roy`
- **Data**:
  ```json
  {
    "id": "todo-1",
    "userId": "shomoy_roy",
    "taskText": "A_MASSIVE_STRING_REPEATED_TEN_THOUSAND_TIMES_EXCEEDING_LIMIT_CAPS...[10MB]",
    "priority": "high",
    "completed": false,
    "date": "2026-05-31"
  }
  ```

### Payload 12: Future Target Relapse / Bypassing Verified State
- **Objective**: User email is not verified, trying to publish daily focus logs anyway.
- **Path**: `/users/unverified_user/daily_logs/2026-05-31`
- **Auth User ID**: `unverified_user` (and `request.auth.token.email_verified == false`)
- **Data**:
  ```json
  {
    "id": "2026-05-31",
    "userId": "unverified_user",
    "date": "2026-05-31",
    "mood": "good",
    "energyLevel": 5
  }
  ```

---

## 3. Security Spec Test Specifications
```typescript
// Test suites describing mock environments and assertion checks
describe("Fortress rules validation tests", () => {
  it("rejects unauthorized nested modifications", async () => {
    // Assert Bob cannot override Shomoy's data
  });
  it("rejects invalid enum designations", async () => {
    // Assert mood, priority, theme are strictly formatted
  });
  it("forces strict boundary and limit constraints", async () => {
    // Assert size checking on user IDs, focus hours, and energy ranges
  });
});
```
