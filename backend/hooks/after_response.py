from datetime import datetime

AUDIT_LOG = []


def after_agent_response(employee_id: str, user_message: str, agent_response: str):
    """Post-processing hook: log all agent interactions for audit purposes."""
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "employee_id": employee_id,
        "user_message": user_message,
        "agent_response": agent_response[:200],
    }
    AUDIT_LOG.append(entry)
    print(f"[AUDIT] {entry}")
