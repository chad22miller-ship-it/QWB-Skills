"""Wave Generator — Changes-only CSV format"""
from datetime import datetime
from typing import List, Dict, Optional

class WaveGenerator:
    UPDATEABLE_COLUMNS = ['Status', 'Date of Last Touch', 'Next Follow-Up Date']
    def __init__(self, filename: Optional[str] = None):
        if filename is None:
            timestamp = datetime.now().strftime('%m%d%y_%H%M')
            filename = f'wave_pipeline_{timestamp}.csv'
        self.filename = filename
        self.rows = []
    def add_prospect(self, name: str, profile_url: str, **kwargs):
        self.rows.append({'Name': name, 'Profile URL': profile_url, **kwargs})
        return self
    def save(self, filepath: str = None):
        return filepath or self.filename
