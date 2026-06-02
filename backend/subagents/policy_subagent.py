import anthropic
from skills.policy_lookup_skill import POLICY_LOOKUP_SKILL
from tools.policy_tools import get_policy, list_policies

client = anthropic.Anthropic()

POLICY_TOOLS = [
    {
        "name": "get_policy",
        "description": "Retrieve a company policy by name.",
        "input_schema": {
            "type": "object",
            "properties": {
                "policy_name": {
                    "type": "string",
                    "description": "The policy key name (e.g. leave_policy, salary_policy, code_of_conduct, remote_work_policy, onboarding_policy)",
                },
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

TOOL_MAP = {"get_policy": get_policy, "list_policies": list_policies}


def run_policy_subagent(user_message: str) -> str:
    """Agentic loop for policy lookups."""
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=POLICY_LOOKUP_SKILL,
            tools=POLICY_TOOLS,
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            text_blocks = [b for b in response.content if hasattr(b, "text")]
            return text_blocks[0].text if text_blocks else "Policy lookup complete."

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
