import anthropic
from skills.onboarding_skill import ONBOARDING_SKILL
from tools.employee_tools import get_employee, list_employees
from tools.policy_tools import get_policy, list_policies

client = anthropic.Anthropic()

ONBOARDING_TOOLS = [
    {
        "name": "get_employee",
        "description": "Get details for a specific employee by ID.",
        "input_schema": {
            "type": "object",
            "properties": {
                "employee_id": {"type": "string"},
            },
            "required": ["employee_id"],
        },
    },
    {
        "name": "list_employees",
        "description": "List all employees with their names, roles, and departments.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "get_policy",
        "description": "Retrieve a company policy by name.",
        "input_schema": {
            "type": "object",
            "properties": {
                "policy_name": {"type": "string"},
            },
            "required": ["policy_name"],
        },
    },
    {
        "name": "list_policies",
        "description": "List all available policy names.",
        "input_schema": {"type": "object", "properties": {}},
    },
]

TOOL_MAP = {
    "get_employee": get_employee,
    "list_employees": list_employees,
    "get_policy": get_policy,
    "list_policies": list_policies,
}


def run_onboarding_subagent(user_message: str, employee_id: str) -> str:
    """Agentic loop for onboarding assistance."""
    messages = [{"role": "user", "content": user_message}]
    system = ONBOARDING_SKILL + f"\n\nCurrent user employee_id: {employee_id}"

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=system,
            tools=ONBOARDING_TOOLS,
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            text_blocks = [b for b in response.content if hasattr(b, "text")]
            return text_blocks[0].text if text_blocks else "Onboarding information provided."

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
