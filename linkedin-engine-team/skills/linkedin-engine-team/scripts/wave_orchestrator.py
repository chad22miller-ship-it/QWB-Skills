"""Wave Orchestrator — Merge and build wave CSV"""
from dataclasses import dataclass
from typing import List, Dict, Optional

@dataclass
class WaveReport:
    updated_count: int
    added_count: int
    skipped_count: int
    changes_by_stage: Dict
    wave_filename: str
    wave_filepath: Optional[str] = None
    drive_file_id: Optional[str] = None
    error: Optional[str] = None

class WaveOrchestrator:
    def __init__(self, google_drive_api=None, qwb_folder_id=None):
        self.google_drive_api = google_drive_api
        self.qwb_folder_id = qwb_folder_id
    def ingest_state_machine_output(self, due_prospects):
        return 0
    def ingest_linkedin_reconciliation(self, linkedin_changes):
        return 0
    def merge_and_build_wave(self):
        return None
    def save_wave(self, filepath=None):
        return WaveReport(0, 0, 0, {}, "wave.csv")
