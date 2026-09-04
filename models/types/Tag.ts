// Tags live in the CLOUD (Supabase), unlike meals/health/pets which are local
// SQLite — a tag has to be reachable by a stranger's browser, so it can't be
// device-local. The pet's display fields are snapshotted onto the tag (see the
// 0004 migration) so the public finder page needs no cloud pets table.

export type TagDeviceType = 'passive' | 'gps';
export type TagScanSource = 'scan' | 'gps';

export interface Tag {
  id: string;
  code: string; // short printable ref, e.g. "K7M2Q9"
  petId: string | null; // local pet id (no cloud FK)
  petName: string | null;
  petSpecies: string | null;
  petPhoto: string | null;
  deviceType: TagDeviceType;
  label: string | null;
  active: boolean;
  lost: boolean;
  contactPhone: string | null;
  contactNote: string | null;
  activatedAt: string;
  createdAt: string;
}

export interface TagScan {
  id: string;
  tagId: string;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  source: TagScanSource;
  note: string | null;
  scannedAt: string;
}

export interface CreateTagInput {
  petId: string;
  petName: string;
  petSpecies?: string | null;
  petPhoto?: string | null;
  contactPhone?: string | null;
  contactNote?: string | null;
}
