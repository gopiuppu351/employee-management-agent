from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from tools.salary_tools import get_salary, update_salary

router = APIRouter()


class UpdateSalaryRequest(BaseModel):
    new_salary: float
    requester_id: str


@router.get("/{employee_id}")
async def get_employee_salary(employee_id: str, requester_id: str):
    result = get_salary(employee_id, requester_id)
    if not result["success"]:
        raise HTTPException(status_code=403, detail=result["error"])
    return result


@router.put("/{employee_id}")
async def update_employee_salary(employee_id: str, req: UpdateSalaryRequest):
    result = update_salary(employee_id, req.new_salary, req.requester_id)
    if not result["success"]:
        raise HTTPException(status_code=403, detail=result["error"])
    return result
