from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from tools.leave_tools import LEAVES, EMPLOYEES, apply_leave, approve_leave, list_leaves

router = APIRouter()


class ApplyLeaveRequest(BaseModel):
    employee_id: str
    start_date: str
    end_date: str
    reason: str


class ApproveLeaveRequest(BaseModel):
    manager_id: str


@router.get("/")
async def get_leaves(employee_id: str = None):
    return list_leaves(employee_id)


@router.post("/")
async def create_leave(req: ApplyLeaveRequest):
    result = apply_leave(req.employee_id, req.start_date, req.end_date, req.reason)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/{leave_id}/approve")
async def approve(leave_id: str, req: ApproveLeaveRequest):
    result = approve_leave(leave_id, req.manager_id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result
