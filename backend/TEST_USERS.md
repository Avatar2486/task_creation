# Test User Accounts

## Admin Accounts (2)

| Name | Email | Password | Role |
|------|-------|----------|------|
| Admin User | admin@example.com | admin123 | admin |
| Super Admin | superadmin@example.com | admin123 | admin |

## Regular User Accounts (10)

| Name | Email | Password | Role |
|------|-------|----------|------|
| John Doe | john@example.com | password123 | user |
| Jane Smith | jane@example.com | password123 | user |
| Mike Johnson | mike@example.com | password123 | user |
| Sarah Williams | sarah@example.com | password123 | user |
| David Brown | david@example.com | password123 | user |
| Emma Davis | emma@example.com | password123 | user |
| Chris Wilson | chris@example.com | password123 | user |
| Lisa Anderson | lisa@example.com | password123 | user |
| Tom Martinez | tom@example.com | password123 | user |
| Amy Taylor | amy@example.com | password123 | user |

## Quick Login Commands

### Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Notes

- All passwords are hashed using bcrypt before storage
- Admin users have access to admin-only routes like GET /api/auth/users
- Regular users can only access their own tasks and profile
- Run `node setup.js` to create these users (only works if database is empty)
