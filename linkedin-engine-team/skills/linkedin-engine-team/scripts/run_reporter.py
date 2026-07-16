"""Run Reporter — Delta analysis and reporting"""
from dataclasses import dataclass, field
from typing import Dict
from datetime import datetime

@dataclass
class PipelineSnapshot:
    timestamp: str
    total_prospects: int
    by_stage: Dict = field(default_factory=dict)
    label: str = ""

@dataclass
class PipelineRunReport:
    run_date: str
    reconciliation: Dict = field(default_factory=dict)
    messages_staged: Dict = field(default_factory=dict)
    tracker_updates: Dict = field(default_factory=dict)
    delta: Dict = field(default_factory=dict)
    next_action: str = ""

class PipelineRunReporter:
    def __init__(self):
        self.snapshots = {}
    def capture_snapshot(self, label="", timestamp=None, prospects=None):
        return PipelineSnapshot(datetime.now().isoformat(), len(prospects) if prospects else 0, {}, label)
    def compare_snapshots(self, before, after, run_date=""):
        return PipelineRunReport(run_date)
