# Employee Management Agent — Claude Context

## Project Purpose
This is an HR management agent that helps employees and managers with:
- Leave applications and approvals
- Salary record queries
- Employee and company policy lookups
- Onboarding assistance

## Agent Behavior Guidelines
- Always be professional, concise, and helpful.
- Verify the employee's role (manager vs. employee) before approving leaves.
- Never expose another employee's salary to non-managers.
- When policy is unclear, always recommend escalating to HR.

## Available Tools
- `apply_leave(employee_id, start_date, end_date, reason)`
- `approve_leave(leave_id, manager_id)`
- `get_salary(employee_id, requester_id)`
- `get_policy(policy_name)`
- `list_employees()`

## Data Storage
No database. All records stored in `/backend/data/*.json` files loaded into memory at startup.

## Running the App
- Backend: `cd backend && uvicorn main:app --reload --port 8000`
- Frontend: `cd frontend && npm run dev`
