import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Pet } from '@/models/types/Pet';
import { Tag, TagScan } from '@/models/types/Tag';
import { PetRepository } from '@/models/repositories/PetRepository';
import { TagService } from '@/services/TagService';
import { useActivePetStore } from '@/store/activePetStore';

interface Selectors {
  pet: Pet | null;
  tags: Tag[];
  scansByTag: Record<string, TagScan[]>;
  isLoading: boolean;
  error: string | null;
}

interface Handlers {
  createTag: () => Promise<void>;
  toggleLost: (tag: Tag, lost: boolean) => Promise<void>;
  saveContact: (tag: Tag, phone: string, note: string) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  refresh: () => void;
}

// The public finder page only renders http(s) photos (a device-local file:// path
// means nothing to a stranger's browser), so only snapshot a usable URL.
const usablePhoto = (photo?: string | null): string | null =>
  typeof photo === 'string' && photo.startsWith('http') ? photo : null;

const speciesLabel = (pet: Pet): string => pet.breed || pet.species;

export const useViewModel = (): { selectors: Selectors; handlers: Handlers } => {
  const { activePetId } = useActivePetStore();
  const [pet, setPet] = useState<Pet | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [scansByTag, setScansByTag] = useState<Record<string, TagScan[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!activePetId) {
      setPet(null);
      setTags([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setPet(PetRepository.getById(activePetId));
      const list = await TagService.listByPet(activePetId);
      setTags(list);
      const scanEntries = await Promise.all(
        list.map(async (t) => [t.id, await TagService.listScans(t.id)] as const),
      );
      setScansByTag(Object.fromEntries(scanEntries));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }, [activePetId]);

  useEffect(() => {
    load();
  }, [load]);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const createTag = useCallback(async () => {
    if (!activePetId) return;
    const p = PetRepository.getById(activePetId);
    if (!p) return;
    setError(null);
    try {
      await TagService.create({
        petId: p.id,
        petName: p.name,
        petSpecies: speciesLabel(p),
        petPhoto: usablePhoto(p.photo),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [activePetId, load]);

  const toggleLost = useCallback(async (tag: Tag, lost: boolean) => {
    setTags((prev) => prev.map((t) => (t.id === tag.id ? { ...t, lost } : t)));
    try {
      await TagService.setLost(tag.id, lost);
    } catch (e) {
      // revert on failure
      setTags((prev) => prev.map((t) => (t.id === tag.id ? { ...t, lost: !lost } : t)));
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const saveContact = useCallback(async (tag: Tag, phone: string, note: string) => {
    const p = phone.trim() || null;
    const n = note.trim() || null;
    setTags((prev) =>
      prev.map((t) => (t.id === tag.id ? { ...t, contactPhone: p, contactNote: n } : t)),
    );
    try {
      await TagService.updateContact(tag.id, { phone: p, note: n });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const deleteTag = useCallback(async (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    try {
      await TagService.remove(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      load();
    }
  }, [load]);

  return {
    selectors: { pet, tags, scansByTag, isLoading, error },
    handlers: { createTag, toggleLost, saveContact, deleteTag, refresh: load },
  };
};
