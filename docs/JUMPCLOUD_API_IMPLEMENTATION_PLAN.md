# JumpCloud API — Implementation Plan for DI Event Triggered Workflows

This document maps the DI Event Triggered actions (from your table) to JumpCloud API parameters and outlines a plan to implement them in the Workflow UI.

**Reference:** [JumpCloud API Docs](https://docs.jumpcloud.com/api/index.html) | [API v1.0](https://docs.jumpcloud.com/api/1.0/index.html) | [API v2.0](https://docs.jumpcloud.com/api/2.0/index.html)

---

## 1. Common Parameters (All Endpoints)

### Headers (Required)

| Header       | Type   | Required | Description                                                  |
|-------------|--------|----------|--------------------------------------------------------------|
| `x-api-key` | string | **Yes**  | API key from JumpCloud Admin Console → Username dropdown → API Settings |
| `Content-Type` | string | POST/PUT | `application/json` |
| `Accept`    | string | All      | `application/json` |
| `x-org-id`  | string | Multi-tenant only | Organization ID (required for MSP admins)   |

**Base URL:**
- US: `https://console.jumpcloud.com`
- EU: `https://console.eu.jumpcloud.com`

---

## 2. Action-by-Action API Specification

### 2.1 Change User Object State (staged, active, suspended)

**Endpoint:** `PUT /api/systemusers/{id}`  
**API Doc:** [systemusers_put](https://docs.jumpcloud.com/api/1.0/index.html#tag/Systemusers/operation/systemusers_put)

| Parameter Type | Name                 | Required | Type   | Description                          |
|----------------|----------------------|----------|--------|--------------------------------------|
| **Path**       | `id`                 | Yes      | string | System user ID                       |
| **Query**      | `fullValidationDetails` | No   | string | Pass `password` for validation details |
| **Body**       | `state`              | No       | string | `ACTIVATED` \| `STAGED` \| `SUSPENDED` |
| **Body**       | `suspended`           | No       | boolean | Deprecated; use `state`            |

**Request body schema (excerpt):** `systemuserput` — includes `state`, `suspended`, `email`, `firstname`, `lastname`, `attributes`, etc.

---

### 2.2 Device Action — Holistic (lock, restart, shutdown, erase)

**Lock:** `POST /api/systems/{system_id}/command/builtin/lock`  
**Restart:** `POST /api/systems/{system_id}/command/builtin/restart`  
**Shutdown:** `POST /api/systems/{system_id}/command/builtin/shutdown`  
**Erase:** `POST /api/systems/{system_id}/command/builtin/erase`  
**API Doc:** [Systems builtin commands](https://docs.jumpcloud.com/api/1.0/index.html#tag/Systems)

| Parameter Type | Name     | Required | Type   | Description        |
|----------------|----------|----------|--------|--------------------|
| **Path**       | `system_id` | Yes   | string | Device/System ID   |
| **Body**       | (empty)  | No       | object | `{}` for lock/restart/shutdown |
| **Header**     | `x-org-id` | Multi-tenant | string | Organization ID |

**Update Device (PUT):** `PUT /api/systems/{id}` — body schema `systemput` (e.g. `displayName`, `allowSshPasswordAuthentication`, `allowPublicKeyAuthentication`, `tags`).

---

### 2.3 Add/Remove User to/from User Group

**Endpoint:** `POST /api/v2/users/{user_id}/associations`  
**API Doc:** [graph_userAssociationsPost](https://docs.jumpcloud.com/api/2.0/index.html#tag/Users/operation/graph_userAssociationsPost)

| Parameter Type | Name       | Required | Type   | Description                    |
|----------------|------------|----------|--------|--------------------------------|
| **Path**       | `user_id`  | Yes      | string | User ID                        |
| **Body**       | `op`       | Yes      | string | `add` or `remove`              |
| **Body**       | `type`     | Yes      | string | Association type (e.g. `user_group`) |
| **Body**       | `id`       | Yes      | string | ID of the user group           |

---

### 2.4 Add/Remove Device to/from Device Group

**Endpoint:** `POST /api/v2/systems/{system_id}/associations`  
**API Doc:** [graph_systemGroupAssociationsPost](https://docs.jumpcloud.com/api/2.0/index.html#tag/System-Groups/operation/graph_systemGroupAssociationsPost)

| Parameter Type | Name       | Required | Type   | Description                    |
|----------------|------------|----------|--------|--------------------------------|
| **Path**       | `system_id`| Yes      | string | System/Device ID               |
| **Body**       | `op`       | Yes      | string | `add` or `remove`              |
| **Body**       | `type`     | Yes      | string | Association type (e.g. `system_group`) |
| **Body**       | `id`       | Yes      | string | ID of the system group         |

---

### 2.5 Run Command on Device

**Endpoint:** `POST /api/runCommand`  
**API Doc:** [commands_run](https://docs.jumpcloud.com/api/1.0/index.html#tag/Commands/operation/commands_run)

| Parameter Type | Name        | Required | Type   | Description                                      |
|----------------|-------------|----------|--------|--------------------------------------------------|
| **Body**       | `_id`       | Yes      | string | Command ID (command must be created beforehand)  |
| **Body**       | `systemIds` | No       | array  | Device IDs; if omitted, runs on command-bound devices |

**Note:** Command must exist before running. Create via `POST /api/commands` if needed.

---

### 2.6 Change User Object Attribute Value

**Endpoint:** `PUT /api/systemusers/{id}`  
**API Doc:** [systemusers_put](https://docs.jumpcloud.com/api/1.0/index.html#tag/Systemusers/operation/systemusers_put)

| Parameter Type | Name       | Required | Type   | Description              |
|----------------|------------|----------|--------|--------------------------|
| **Path**       | `id`       | Yes      | string | System user ID           |
| **Body**       | `attributes` | No     | array  | `[{ "name": "...", "value": "..." }]` |
| **Body**       | Other fields | No     | various | `email`, `firstname`, `department`, etc. |

---

### 2.7 Change Device Object Attribute Value

**Endpoint:** `PUT /api/systems/{id}`  
**API Doc:** [systems_put](https://docs.jumpcloud.com/api/1.0/index.html#tag/Systems/operation/systems_put)

| Parameter Type | Name       | Required | Type   | Description        |
|----------------|------------|----------|--------|--------------------|
| **Path**       | `id`       | Yes      | string | System ID          |
| **Body**       | `displayName` | No    | string | Display name       |
| **Body**       | `tags`     | No       | array  | Tag strings         |
| **Body**       | Other fields | No     | various | Per `systemput` schema |

---

### 2.8 User Password Reset

**Endpoint:** `POST /api/systemusers/{id}/expire`  
**API Doc:** [systemusers_expire](https://docs.jumpcloud.com/api/1.0/index.html#tag/Systemusers/operation/systemusers_expire)

| Parameter Type | Name | Required | Type   | Description      |
|----------------|------|----------|--------|------------------|
| **Path**       | `id` | Yes      | string | System user ID   |

No request body. Headers: `x-api-key`, `x-org-id` (if multi-tenant).

---

### 2.9 Notify via Channel (Email, Webhook)

**Status:** Separate mechanism — needs clarity on payload, recipients, and API.

**Note from table:** "Separate - Need clarity. What is the payload or who are recipients?"

**Suggested approach:** Check JumpCloud Notify / Channel docs or internal notification APIs.

---

### 2.10 Create User Group

**Endpoint:** `POST /api/v2/usergroups`  
**API Doc:** [groups_user_post](https://docs.jumpcloud.com/api/2.0/index.html#tag/User-Groups/operation/groups_user_post)

| Parameter Type | Name       | Required | Type   | Description              |
|----------------|------------|----------|--------|--------------------------|
| **Body**       | `name`     | Yes      | string | Group name               |
| **Body**       | `attributes` | No     | array  | Rule/attribute config    |

---

### 2.11 Create Device Group

**Endpoint:** `POST /api/v2/systemgroups`  
**API Doc:** [groups_system_post](https://docs.jumpcloud.com/api/2.0/index.html#tag/System-Groups/operation/groups_system_post)

| Parameter Type | Name       | Required | Type   | Description              |
|----------------|------------|----------|--------|--------------------------|
| **Body**       | `name`     | Yes      | string | Group name               |
| **Body**       | `attributes` | No     | array  | Rule/attribute config    |

---

### 2.12 Bind User Group to Resource / Bind Device Group to Policy / Bind User to Device

**Endpoint pattern:** `POST /api/v2/.../associations`  
**Note:** Table lists `/associations` — these map to v2 graph association endpoints. Exact paths depend on resource type (user, system, policy, etc.). See v2 API docs for each association type.

---

## 3. Implementation Plan

### Phase 1: API Client & Types (Week 1)

1. **API client module**
   - Create `src/api/jumpcloud.ts` (or similar)
   - Centralize `baseUrl`, `x-api-key`, `x-org-id`
   - Generic `request(method, path, body?, params?)` with error handling

2. **TypeScript types**
   - Define request/response interfaces per endpoint
   - Map OpenAPI schemas to TS types (e.g. `SystemUserPut`, `SystemPut`, `RunCommandBody`)

3. **Environment / config**
   - Store API key via env vars or secure config (never commit)
   - Optional `x-org-id` for multi-tenant

### Phase 2: Action Executors (Week 2–3)

Implement one module per action category:

| Action Category              | Module                  | Endpoints Used                         |
|-----------------------------|-------------------------|----------------------------------------|
| Change user state           | `userStateAction.ts`    | `PUT /api/systemusers/{id}`            |
| Device actions (lock, etc.) | `deviceAction.ts`      | `POST /api/systems/{id}/command/builtin/{action}` |
| User/Device group membership| `associationAction.ts`  | `POST /api/v2/users/{id}/associations`, `POST /api/v2/systems/{id}/associations` |
| Run command                 | `runCommandAction.ts`  | `POST /api/runCommand`                 |
| User attribute              | `userAttributeAction.ts` | `PUT /api/systemusers/{id}`          |
| Device attribute            | `deviceAttributeAction.ts` | `PUT /api/systems/{id}`           |
| Password reset              | `passwordResetAction.ts` | `POST /api/systemusers/{id}/expire`  |
| Create groups               | `createGroupAction.ts`  | `POST /api/v2/usergroups`, `POST /api/v2/systemgroups` |

Each executor:
- Receives workflow context (user_id, system_id, group_id, etc.)
- Builds path, query, body from action config
- Calls API client
- Returns success/error for execution timeline

### Phase 3: Workflow UI Integration (Week 4–5)

1. **Action configuration UI**
   - Per action type: form for path/query/body parameters
   - Dropdowns or typeahead for IDs (users, systems, groups, commands)
   - Validation against API schemas

2. **Execution integration**
   - When a workflow runs, call appropriate executor from Phase 2
   - Persist execution results (variables, result JSON) to `ExecutionStep`
   - Show in Execution Results Timeline (already built)

3. **Error handling**
   - Map API errors (400, 401, 403, 404, 503) to user-facing messages
   - "Copy Error" for failed steps (already implemented)

### Phase 4: Notify & Remaining Actions (Week 6)

1. **Notify via Channel**
   - Resolve API/payload/recipients
   - Implement once spec is clear

2. **Bind user group to resource / Bind device group to policy**
   - Use v2 association endpoints with correct `type` and `id`
   - Add to `associationAction.ts` or separate module

3. **Run Report**
   - Identify Report API (if available)
   - Add executor when endpoint is confirmed

---

## 4. Quick Reference — Common Trait Parameters

From the OpenAPI spec:

| Trait          | Name       | In   | Type   | Description                            |
|----------------|------------|------|--------|----------------------------------------|
| `filter`       | filter     | query| string | e.g. `department:$eq:Finance`         |
| `fields`       | fields     | query| string | Space-separated response fields        |
| `limit`        | limit      | query| integer| Max records                             |
| `skip`         | skip       | query| integer| Offset for pagination                   |
| `sort`         | sort       | query| string | Space-separated sort fields             |
| `x-org-id`     | x-org-id   | header| string| Org ID (multi-tenant)                   |

Filter operators: `$eq`, `$ne`, `$in`, `$nin`, `$lt`, `$lte`, `$gt`, `$gte`, `$sw`, `$ew`, `$co`, `$nco` (some require `x-eventually-consistent: true`).

---

## 5. Security Checklist

- [ ] API key stored in env/secret manager, never in code
- [ ] Use HTTPS only
- [ ] Validate/sanitize IDs and inputs before API calls
- [ ] Rate limiting / retries per [API Best Practices](https://support.jumpcloud.com/support/s/article/JumpCloud-API-Best-Practices)
- [ ] Audit logging for workflow executions and API calls

---

## 6. Links

- [JumpCloud API Index](https://docs.jumpcloud.com/api/index.html)
- [API v1.0 OpenAPI Spec](https://docs.jumpcloud.com/api/1.0/index.yaml)
- [API v2.0 OpenAPI Spec](https://docs.jumpcloud.com/api/2.0/index.yaml)
- [API Best Practices](https://support.jumpcloud.com/support/s/article/JumpCloud-API-Best-Practices)
