import json
import uuid
import os
from datetime import datetime

_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

with open(os.path.join(_DATA_DIR, "leaves.json")) as f:
    LEAVES: list = json.load(f)

with open(os.path.join(_DATA_DIR, "employees.json")) as f:
    EMPLOYEES: list = json.load(f)


def apply_leave(employee_id: str, start_date: str, end_date: str, reason: str) -> dict:
    """Submit a leave request for an employee."""
    leave = {
        "id": f"L{str(uuid.uuid4())[:4].upper()}",
        "employee_id": employee_id,
        "start_date": start_date,
        "end_date": end_date,
        "reason": reason,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
    }
    LEAVES.append(leave)
    return {"success": True, "leave": leave}


def approve_leave(leave_id: str, manager_id: str) -> dict:
    """Approve a pending leave request. Only managers can approve."""
    manager = next((e for e in EMPLOYEES if e["id"] == manager_id and e["role"] == "manager"), None)
    if not manager:
        return {"success": False, "error": "Only managers can approve leave."}
    leave = next((l for l in LEAVES if l["id"] == leave_id), None)
    if not leave:
        return {"success": False, "error": f"Leave {leave_id} not found."}
    leave["status"] = "approved"
    leave["approved_by"] = manager_id
    return {"success": True, "leave": leave}


def list_leaves(employee_id: str = None) -> list:
    """List all leaves, optionally filtered by employee."""
    if employee_id:
        return [l for l in LEAVES if l["employee_id"] == employee_id]
    return LEAVES
