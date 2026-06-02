import anthropic
from skills.leave_approval_skill import LEAVE_APPROVAL_SKILL
from tools.leave_tools import apply_leave, approve_leave, list_leaves

client = anthropic.Anthropic()

LEAVE_TOOLS = [
    {
        "name": "apply_leave",
        "description": "Submit a leave request for an employee.",
        "input_schema": {
            "type": "object",
            "properties": {
                "employee_id": {"type": "string", "description": "The employee's ID (e.g. E001)"},
                "start_date":  {"type": "string", "description": "Start date in YYYY-MM-DD format"},
                "end_date":    {"type": "string", "description": "End date in YYYY-MM-DD format"},
                "reason":      {"type": "string", "description": "Reason for the leave request"},
            },
            "required": ["employee_id", "start_date", "end_date", "reason"],
        },
    },
    {
        "name": "approve_leave",
        "description": "Approve a pending leave request. Requires manager role.",
        "input_schema": {
            "type": "object",
            "properties": {
                "leave_id":   {"type": "string", "description": "The leave request ID to approve"},
                "manager_id": {"type": "string", "description": "The approving manager's employee ID"},
            },
            "required": ["leave_id", "manager_id"],
        },
    },
    {
        "name": "list_leaves",
        "description": "List leave requests, optionally filtered by employee ID.",
        "input_schema": {
            "type": "object",
            "properties": {
                "employee_id": {"type": "string", "description": "Filter by employee ID (optional)"},
            },
        },
    },
]

TOOL_MAP = {
    "apply_leave": apply_leave,
    "approve_leave": approve_leave,
    "list_leaves": list_leaves,
}


def run_leave_subagent(user_message: str, employee_id: str) -> str:
    """Agentic loop for leave management."""
    messages = [{"role": "user", "content": user_message}]
    system = LEAVE_APPROVAL_SKILL + f"\n\nCurrent user employee_id: {employee_id}"

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=system,
            tools=LEAVE_TOOLS,
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            text_blocks = [b for b in response.content if hasattr(b, "text")]
            return text_blocks[0].text if text_blocks else "Leave request processed."

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
