from fastapi import APIRouter, HTTPException
from tools.policy_tools import get_policy, list_policies

router = APIRouter()


@router.get("/")
async def get_all_policies():
    return {"policies": list_policies()}


@router.get("/{policy_name}")
async def get_single_policy(policy_name: str):
    result = get_policy(policy_name)
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
