from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agents.hr_agent import run_hr_agent
from hooks.before_request import before_agent_call
from hooks.after_response import after_agent_response

router = APIRouter()


class ChatRequest(BaseModel):
    employee_id: str
    message: str


@router.post("/chat")
async def chat(req: ChatRequest):
    try:
        ctx = before_agent_call(req.employee_id, req.message)
        response = run_hr_agent(req.message, req.employee_id)
        after_agent_response(req.employee_id, req.message, response)
        return {"reply": response, "context": ctx}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")
