import anthropic
from skills.salary_inquiry_skill import SALARY_INQUIRY_SKILL
from tools.salary_tools import get_salary, update_salary

client = anthropic.Anthropic()

SALARY_TOOLS = [
    {
        "name": "get_salary",
        "description": "Retrieve salary information for an employee. Access-controlled — only self or direct manager can view.",
        "input_schema": {
            "type": "object",
            "properties": {
                "employee_id":  {"type": "string", "description": "The employee whose salary to look up"},
                "requester_id": {"type": "string", "description": "The ID of the person making the request"},
            },
            "required": ["employee_id", "requester_id"],
        },
    },
    {
        "name": "update_salary",
        "description": "Update an employee's base salary. Only their direct manager can do this.",
        "input_schema": {
            "type": "object",
            "properties": {
                "employee_id":  {"type": "string"},
                "new_salary":   {"type": "number", "description": "New base salary amount in USD"},
                "requester_id": {"type": "string", "description": "The manager's employee ID"},
            },
            "required": ["employee_id", "new_salary", "requester_id"],
        },
    },
]

TOOL_MAP = {"get_salary": get_salary, "update_salary": update_salary}


def run_salary_subagent(user_message: str, employee_id: str) -> str:
    """Agentic loop for salary inquiries."""
    messages = [{"role": "user", "content": user_message}]
    system = SALARY_INQUIRY_SKILL + f"\n\nCurrent user employee_id: {employee_id}"

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=system,
            tools=SALARY_TOOLS,
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            text_blocks = [b for b in response.content if hasattr(b, "text")]
            return text_blocks[0].text if text_blocks else "Salary query processed."

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    fn = TOOL_MAP.get(block.name)
                    result = fn(**block.input) if fn else {"error": f"Unknown tool: {block.name}"}
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": str(result),
                    })
            messages.append({"role": "user", "content": tool_results})
