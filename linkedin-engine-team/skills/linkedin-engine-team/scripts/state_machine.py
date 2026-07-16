"""CCQTTC State Machine for QWB Pipeline"""
from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime

@dataclass
class MessageDraft:
    prospect_name: str
    profile_url: str
    current_status: str
    next_status: str
    message_to_send: str
    message_column: str
    due: bool
    reason: str
    silence_tag_to_add: Optional[str] = None

class CCQTTCStateMachine:
    def __init__(self):
        pass
    def process_prospect(self, prospect):
        return None
    def batch_process_prospects(self, prospects: List):
        return []
