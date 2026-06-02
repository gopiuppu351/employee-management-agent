import json
import os

_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

with open(os.path.join(_DATA_DIR, "policies.json")) as f:
    POLICIES: dict = json.load(f)


def get_policy(policy_name: str) -> dict:
    """Retrieve a company policy by name."""
    policy = POLICIES.get(policy_name)
    if not policy:
        available = list(POLICIES.keys())
        return {"success": False, "error": f"Policy '{policy_name}' not found. Available policies: {available}"}
    return {"success": True, "policy_name": policy_name, "content": policy}


def list_policies() -> list:
    """List all available policy names."""
    return list(POLICIES.keys())
