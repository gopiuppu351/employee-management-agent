import json
import os

_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

with open(os.path.join(_DATA_DIR, "employees.json")) as f:
    EMPLOYEES: list = json.load(f)


def get_employee(employee_id: str) -> dict:
    """Get details for a specific employee by ID."""
    employee = next((e for e in EMPLOYEES if e["id"] == employee_id), None)
    if not employee:
        return {"success": False, "error": f"Employee {employee_id} not found."}
    return {"success": True, "employee": employee}


def list_employees() -> list:
    """List all employees (name, ID, department, role — no salary)."""
    return [{"id": e["id"], "name": e["name"], "role": e["role"], "department": e["department"]} for e in EMPLOYEES]
