import json
import os

_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

with open(os.path.join(_DATA_DIR, "salaries.json")) as f:
    SALARIES: list = json.load(f)

with open(os.path.join(_DATA_DIR, "employees.json")) as f:
    EMPLOYEES: list = json.load(f)


def get_salary(employee_id: str, requester_id: str) -> dict:
    """Return salary info. Only the employee or their direct manager can view it."""
    employee = next((e for e in EMPLOYEES if e["id"] == employee_id), None)
    requester = next((e for e in EMPLOYEES if e["id"] == requester_id), None)
    if not employee or not requester:
        return {"success": False, "error": "Employee not found."}
    is_self = requester_id == employee_id
    is_manager = requester["role"] == "manager" and employee.get("manager_id") == requester_id
    if not (is_self or is_manager):
        return {"success": False, "error": "Access denied. You can only view your own salary."}
    salary = next((s for s in SALARIES if s["employee_id"] == employee_id), None)
    return {"success": True, "salary": salary}


def update_salary(employee_id: str, new_salary: float, requester_id: str) -> dict:
    """Update an employee's salary. Only their direct manager can do this."""
    employee = next((e for e in EMPLOYEES if e["id"] == employee_id), None)
    requester = next((e for e in EMPLOYEES if e["id"] == requester_id), None)
    if not employee or not requester:
        return {"success": False, "error": "Employee not found."}
    is_manager = requester["role"] == "manager" and employee.get("manager_id") == requester_id
    if not is_manager:
        return {"success": False, "error": "Only the employee's direct manager can update salary."}
    salary = next((s for s in SALARIES if s["employee_id"] == employee_id), None)
    if salary:
        salary["base_salary"] = new_salary
        from datetime import datetime
        salary["last_updated"] = datetime.utcnow().date().isoformat()
    else:
        from datetime import datetime
        new_record = {"employee_id": employee_id, "base_salary": new_salary, "currency": "USD", "last_updated": datetime.utcnow().date().isoformat()}
        SALARIES.append(new_record)
        salary = new_record
    return {"success": True, "salary": salary}
