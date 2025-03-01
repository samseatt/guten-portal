# 🔐 **Comprehensive Authentication System (Auth) Design**

This document describes a well-structured, secure, and robust authentication and authorization system design tailored for your needs, ensuring a holistic and scalable approach that can seamlessly serve **Guten** as well as your broader system (like **VitalEdge**) using an independent **Auth** microservice.

---

## 📌 **1. Overall Architecture**

Your architecture involves a centralized Auth microservice built using Kotlin (Spring Boot recommended) to handle authentication across multiple services/apps:

```
| Frontends (Guten Portal, VitalEdge Portal, etc.)
|          ▼ API calls with credentials
|      Guten-Crust or other Crust (API Gateway Layer)
|          ▼ Authentication requests
|         Auth Microservice (Kotlin, Spring Boot)
|          ▼ Verify credentials
|       User Database (securely hashed credentials, roles, etc.)
```

**Post-Authentication Flow:**

```
| Auth Microservice issues JWT Token upon successful login
|          ▲ Returns JWT Token
|       API Gateway (Crust Layer)
|          ▲ JWT Token
| Frontend stores token securely (HTTP-only cookie or secure storage)
```

---

## 📌 **2. Authentication Microservice (Auth)**

### **🛠️ Stack:**
- Kotlin with Spring Boot
- PostgreSQL Database (for users, roles, permissions)
- JWT (JSON Web Tokens) for stateless, secure session management
- OAuth2/OpenID Connect integration support (optional for future federated login)

### **🔍 Responsibilities:**
- User Authentication (login/logout)
- User Authorization (Roles/Permissions management)
- JWT Generation & Validation
- Secure Password Hashing (BCrypt, Argon2)

---

## 📌 **3. Database Schema (Auth DB - PostgreSQL)**

### **Tables:**

- **users**
  - `id (PK)`
  - `username (unique)`
  - `email (unique)`
  - `hashed_password`
  - `created_at`
  - `updated_at`
  - `status` (active/inactive)

- **roles**
  - `id (PK)`
  - `name` (e.g., ADMIN, EDITOR, VIEWER)
  - `description`

- **permissions**
  - `id (PK)`
  - `name` (e.g., CREATE_SITE, EDIT_SITE, PUBLISH_SITE, etc.)
  - `description`

- **user_roles**
  - `user_id (FK)`
  - `role_id (FK)`

- **role_permissions**
  - `role_id (FK)`
  - `permission_id (FK)`

### 🔑 **Security considerations:**
- Store only hashed passwords (Argon2 recommended).
- All sensitive data encrypted at rest.
- Audit logging (login attempts, success/failure).

---

## 📌 **4. JWT Token Structure**

- **Payload:**
```json
{
  "sub": "user_id",
  "username": "johndoe",
  "roles": ["ADMIN", "EDITOR"],
  "exp": 1724989383, // expiration timestamp
  "iat": 1724902983, // issued at timestamp
  "iss": "auth.yourdomain.com"
}
```

### **Security Recommendations:**
- Tokens issued with short lifespans (e.g., 15 minutes).
- Secure refresh tokens to renew JWT securely without re-login.

---

## 📌 **5. Guten-Datalake Authorization**

Modify your `guten-datalake` to authorize requests using user context from the JWT.  
For example, **sites** table enhanced with an `owner_username`:

```sql
ALTER TABLE sites ADD COLUMN owner_username VARCHAR(255) NOT NULL;
```

**Example Check (FastAPI middleware or dependency):**
```python
async def authorize_user(site_name: str, current_user: User):
    site = await db.execute(select(Site).where(Site.name == site_name))
    site = site.scalar_one_or_none()
    if not site or site.owner_username != current_user.username:
        raise HTTPException(status_code=403, detail="Forbidden")
```

---

## 📌 **6. API Gateway (Guten-Crust) Middleware**

Middleware (in `guten-crust`) checks JWT token validity before passing requests downstream:

```typescript
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // attach payload for downstream use
    next();
  } catch (err) {
    res.status(401).send('Invalid Token');
  }
};

export default authMiddleware;
```

---

## 📌 **7. Guten-Portal (Frontend) Authentication Flow**

### 🖥️ **Login Page**
- Simple React form: Username + Password → sends to **Crust → Auth microservice**.

### 🌐 **API Example (Axios):**
```typescript
const loginUser = async (username, password) => {
  const response = await axios.post('/api/auth/login', { username, password });
  localStorage.setItem('token', response.data.token);
};
```

### 🛡️ **Protected Routes (Next.js)**
```tsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, []);

  return <div>Dashboard content</div>;
};
```

---

## 📌 **8. Security Best Practices**

- **JWT tokens** stored securely in HTTP-only cookies to mitigate XSS.
- Use HTTPS/TLS for all traffic between components.
- Secure headers (Content Security Policy, X-Frame-Options).
- Rate-limiting and IP-blocking policies for preventing brute-force attacks.
- Audit logging: log significant actions (login attempts, data changes).

---

## 📌 **9. Future-Proofing**

- **OAuth2/OpenID Connect** integration for social logins (Google, GitHub, etc.).
- Multi-factor authentication (MFA) for critical operations.
- API rate-limiting, additional security headers.
- SSO integration with enterprise authentication services.

---

## 🎯 **Summary of API endpoints (Auth Service)**

| Method | Endpoint                 | Description                     |
|--------|--------------------------|---------------------------------|
| POST   | `/auth/login`            | Authenticate and return JWT     |
| POST   | `/auth/logout`           | Invalidate user session (future, with refresh tokens)|
| POST   | `/auth/refresh-token`    | Issue new JWT from refresh token|
| GET    | `/auth/userinfo`         | Return user info based on JWT   |
| POST   | `/auth/register`         | User registration               |

---

## 🚀 **Implementation Roadmap**

1. **Setup Auth Microservice (Kotlin/Spring Boot)**
   - Secure password hashing, JWT issuance.
2. **Integration with API Gateway**
   - JWT validation middleware.
3. **Integration with Datalake**
   - User-based authorization checks.
4. **Frontend Integration**
   - Login forms, session handling.

---

**This architecture provides:**
- Scalability (multiple apps/services).
- Secure JWT authentication.
- Flexible user roles/permissions management.
- Centralized security governance.
