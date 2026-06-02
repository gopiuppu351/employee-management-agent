import anthropic
from subagents.leave_subagent import run_leave_subagent
from subagents.salary_subagent import run_salary_subagent
from subagents.onboarding_subagent import run_onboarding_subagent
from subagents.policy_subagent import run_policy_subagent

client = anthropic.Anthropic()

ROUTER_SYSTEM = """
You are the HR Orchestrator for an Employee Management System.
Your job is to understand the user's intent and route to the correct department:
- "leave" → leave management (apply, approve, check leave status, time off)
- "salary" → salary inquiries (pay, compensation, raise)
- "policy" → company or HR policy questions (rules, guidelines, entitlements)
- "onboarding" → new employee setup, introductions, getting started

Respond with ONLY one of: leave | salary | policy | onboarding
"""


def route_intent(user_message: str) -> str:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=10,
        system=ROUTER_SYSTEM,
        messages=[{"role": "user", "content": user_message}],
    )
    return response.content[0].text.strip().lower()


def run_hr_agent(user_message: str, employee_id: str) -> str:
    intent = route_intent(user_message)
    print(f"[HR Agent] Routed to: {intent}")
    if intent == "leave":
        return run_leave_subagent(user_message, employee_id)
    elif intent == "salary":
        return run_salary_subagent(user_message, employee_id)
    elif intent == "policy":
        return run_policy_subagent(user_message)
    else:
        return run_onboarding_subagent(user_message, employee_id)
