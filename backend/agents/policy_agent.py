"""
Standalone policy Q&A agent — can be invoked directly for policy-only endpoints.
Delegates to the policy subagent.
"""
from subagents.policy_subagent import run_policy_subagent


def run_policy_agent(user_message: str) -> str:
    return run_policy_subagent(user_message)
