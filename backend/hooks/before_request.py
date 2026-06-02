from datetime import datetime


def before_agent_call(employee_id: str, user_message: str) -> dict:
    """Pre-processing hook: validate the request and log it."""
    print(f"[{datetime.utcnow().isoformat()}] Agent call | Employee: {employee_id} | Message: {user_message[:80]}")
    if not employee_id:
        raise ValueError("employee_id is required for all agent interactions.")
    return {"employee_id": employee_id, "timestamp": datetime.utcnow().isoformat()}
