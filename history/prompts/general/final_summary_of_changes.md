This addresses the runtime error for the frontend (objects are not valid as a React child) by improving error message handling, and fixes backend 404/422 errors by updating the frontend's login endpoint and adding comprehensive validation to the register form.

Summary of changes:
- `frontend/src/app/login/page.tsx`:
    - Updated the login endpoint from `/auth/login` to `/api/auth/login`.
    - Enhanced error handling to correctly parse and display backend error messages, whether they are strings or arrays of error objects.
- `frontend/src/app/register/page.tsx`:
    - Added client-side validation for username (alphanumeric, length 3-20) and password complexity (minimum 8 characters, at least one lowercase, one uppercase, one digit, and one special character) to match backend requirements.
    - Enhanced error handling to correctly parse and display backend error messages, whether they are strings or arrays of error objects.
