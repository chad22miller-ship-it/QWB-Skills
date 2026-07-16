"""
Chad's Voice & DNA — Locked-in patterns for message drafting and decision-making.

This module encodes Chad Miller's communication style, decision framework, and DNA
into the LinkedIn pipeline engine. Every message drafts in his voice; every decision
routes through his framework.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class ChadVoiceAndDNA:
    """Encodes Chad's voice patterns, tone, and decision framework."""

    # Voice Patterns
    OPENING_CONNECT = "Hey {name}, came across your profile and your background in {field} stood out. Would love to connect."

    STEP_2_CONVERSE = "Thanks for connecting, {name}. I'm curious, what got you into {field} in the first place?"

    STEP_2_NUDGE = "No worries if you've been slammed, {name}. Just genuinely curious what drew you to {field}, always interested to hear how people got started."

    STEP_3_QUALIFY = "That's awesome. I'm curious, do you see yourself doing that long-term? Reason I ask, if there was a way to earn additional income on the side, without quitting or risking your full-time job, would you be open to a conversation?"

    STEP_3_VOSS = "Hey {name}, totally fine if now's not the right time. Did I catch you at a bad moment, or is this just not something you're open to exploring? Either answer's completely cool."

    LANE_A_CONTEXT = "Awesome. Quick bit of context so it's not a total mystery. We're a financial services company built around financial education. We teach families how to create freedom, security, and peace with their money, and we give that education away at no cost. It's a 1099 role, so most people start part-time alongside their current career, fully remote over Zoom. We're expanding across North America fast and I'm looking for driven people who want to help build and lead as we grow. I can't promise anything, we'd need to actually talk and see if it's even a fit. Best way to start is a quick 15-minute call, no pressure, no big pitch, just a conversation. How's Tuesday or Thursday, 6 or 7 better for you?"

    # DNA: Decision Framework (Alex Hormozi's outcome-obsessed approach)
    SILENCE_NUDGE_THRESHOLD_DAYS = 5  # Silent 5+ days after Step 2 connect → send nudge
    SILENCE_VOSS_THRESHOLD_DAYS = 14  # Silent 14+ days after Step 3 Qualify → send Voss
    WITHDRAWAL_THRESHOLD_DAYS = 14    # Pending 14+ days → withdraw (they said no)

    CONNECT_QUEUE_DAILY_CAP = 25      # Max 25 connects per day
    MOVE_FAST_ON_CLARITY = True       # Clear no = move on, don't chase ghosts
    EVERY_MESSAGE_HAS_PURPOSE = True  # No filler, structured progression
    VOLUME_AND_VELOCITY = True        # Quality + scale, not perfection
    PERSONAL_TOUCH = True             # Reference something specific about them

    def get_message(self, step: str, prospect_name: str, field: Optional[str] = None) -> str:
        """
        Get the exact message for a given stage.

        Args:
            step: One of "connect", "step2_converse", "step2_nudge", "step3_qualify", "step3_voss", "lane_a"
            prospect_name: Prospect's name
            field: Optional field/industry for personalization

        Returns:
            Exact message text, personalized for the prospect
        """
        field = field or "your industry"

        if step == "connect":
            return self.OPENING_CONNECT.format(name=prospect_name, field=field)
        elif step == "step2_converse":
            return self.STEP_2_CONVERSE.format(name=prospect_name, field=field)
        elif step == "step2_nudge":
            return self.STEP_2_NUDGE.format(name=prospect_name, field=field)
        elif step == "step3_qualify":
            return self.STEP_3_QUALIFY.format(name=prospect_name)
        elif step == "step3_voss":
            return self.STEP_3_VOSS.format(name=prospect_name)
        elif step == "lane_a":
            return self.LANE_A_CONTEXT.format(name=prospect_name)
        else:
            raise ValueError(f"Unknown step: {step}")

    def should_nudge(self, days_since_last_touch: int) -> bool:
        """Chad's DNA: Nudge after 5+ days of silence."""
        return days_since_last_touch >= self.SILENCE_NUDGE_THRESHOLD_DAYS

    def should_voss(self, days_since_step_3: int) -> bool:
        """Chad's DNA: Voss question after 14+ days of silence in Step 3."""
        return days_since_step_3 >= self.SILENCE_VOSS_THRESHOLD_DAYS

    def should_withdraw(self, days_pending: int) -> bool:
        """Chad's DNA: Withdraw pending invites after 14+ days (clear no)."""
        return days_pending >= self.WITHDRAWAL_THRESHOLD_DAYS

    def get_decision_reasoning(self, scenario: str) -> str:
        """
        Get Chad's decision reasoning for a given scenario.

        Scenario options:
        - "silent_5_days": What to do when prospect hasn't replied for 5 days
        - "silent_14_days": What to do when prospect hasn't replied for 14 days
        - "pending_14_days": What to do with a pending invite that's 14+ days old
        - "clear_yes": What to do when prospect is clearly interested
        - "clear_no": What to do when prospect is clearly not interested
        """
        reasoning = {
            "silent_5_days": "Silence isn't rejection, just timing. Send a nudge that shows genuine curiosity, not pushiness.",
            "silent_14_days": "This is the Voss moment. Give them an out, but keep it real. Either they'll clarify or you'll know it's a no.",
            "pending_14_days": "14 days pending = they ghosted the invite. That's a clear no. Withdraw and move on. Time is your scarcest resource.",
            "clear_yes": "Accelerate. They're warm. Send Lane A context immediately and lock the 15-min call.",
            "clear_no": "Move on. Don't chase ghosts. There are 1000 other prospects. Volume + velocity wins.",
        }
        return reasoning.get(scenario, "No reasoning available for this scenario")


# Global instance — locked in Chad's voice/DNA
CHAD = ChadVoiceAndDNA()


def get_chad_message(step: str, prospect_name: str, field: Optional[str] = None) -> str:
    """Convenience function to get Chad's message for a stage."""
    return CHAD.get_message(step, prospect_name, field)


def get_chad_reasoning(scenario: str) -> str:
    """Convenience function to get Chad's decision reasoning."""
    return CHAD.get_decision_reasoning(scenario)
