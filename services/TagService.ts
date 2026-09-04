import { supabase } from '@/services/supabase';
import type { CreateTagInput, Tag, TagScan } from '@/models/types/Tag';

/**
 * Client for the cloud tag tables (Supabase). Mirrors the AuthService pattern:
 * the store/viewModel holds state, this wraps every network call. supabase-js
 * attaches the signed-in user's JWT automatically, and RLS scopes every row to
 * that user — so no query here needs to filter by user_id defensively.
 */

// The finder web page (hosted on Vercel), not the Supabase function — Supabase
// forces text/plain on HTML, so presentation lives on the web host.
const FINDER_BASE = process.env.EXPO_PUBLIC_FINDER_BASE_URL ?? '';

function rowToTag(r: Record<string, any>): Tag {
  return {
    id: r.id,
    code: r.code,
    petId: r.pet_id ?? null,
    petName: r.pet_name ?? null,
    petSpecies: r.pet_species ?? null,
    petPhoto: r.pet_photo ?? null,
    deviceType: r.device_type,
    label: r.label ?? null,
    active: r.active,
    lost: r.lost,
    contactPhone: r.contact_phone ?? null,
    contactNote: r.contact_note ?? null,
    activatedAt: r.activated_at,
    createdAt: r.created_at,
  };
}

function rowToScan(r: Record<string, any>): TagScan {
  return {
    id: r.id,
    tagId: r.tag_id,
    lat: r.lat ?? null,
    lng: r.lng ?? null,
    accuracy: r.accuracy ?? null,
    source: r.source,
    note: r.note ?? null,
    scannedAt: r.scanned_at,
  };
}

export const TagService = {
  /** All tags linked to a given local pet, newest first. */
  listByPet: async (petId: string): Promise<Tag[]> => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('pet_id', petId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToTag);
  },

  /** Create (activate) a new tag for a pet; DB generates the short code. */
  create: async (input: CreateTagInput): Promise<Tag> => {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;
    if (!userId) throw new Error('Not signed in');
    const { data, error } = await supabase
      .from('tags')
      .insert({
        user_id: userId,
        pet_id: input.petId,
        pet_name: input.petName,
        pet_species: input.petSpecies ?? null,
        pet_photo: input.petPhoto ?? null,
        contact_phone: input.contactPhone ?? null,
        contact_note: input.contactNote ?? null,
      })
      .select('*')
      .single();
    if (error) throw error;
    return rowToTag(data);
  },

  /** Flip the "đang bị lạc" flag the public page keys off. */
  setLost: async (id: string, lost: boolean): Promise<void> => {
    const { error } = await supabase.from('tags').update({ lost }).eq('id', id);
    if (error) throw error;
  },

  /** Update the contact details shown to finders. */
  updateContact: async (
    id: string,
    contact: { phone?: string | null; note?: string | null },
  ): Promise<void> => {
    const { error } = await supabase
      .from('tags')
      .update({ contact_phone: contact.phone ?? null, contact_note: contact.note ?? null })
      .eq('id', id);
    if (error) throw error;
  },

  /** Refresh the pet display snapshot (call when the pet is renamed/re-photographed). */
  updateSnapshot: async (
    id: string,
    snapshot: { petName?: string; petSpecies?: string | null; petPhoto?: string | null },
  ): Promise<void> => {
    const { error } = await supabase
      .from('tags')
      .update({
        pet_name: snapshot.petName,
        pet_species: snapshot.petSpecies ?? null,
        pet_photo: snapshot.petPhoto ?? null,
      })
      .eq('id', id);
    if (error) throw error;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) throw error;
  },

  /** Sightings for a tag, newest first (scan today, GPS later — same table). */
  listScans: async (tagId: string): Promise<TagScan[]> => {
    const { data, error } = await supabase
      .from('tag_scans')
      .select('*')
      .eq('tag_id', tagId)
      .order('scanned_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToScan);
  },

  /** The URL to encode on the physical tag (QR/NFC) — the Vercel finder page. */
  publicUrl: (tag: Tag): string => `${FINDER_BASE}/t/${tag.code}`,
};
