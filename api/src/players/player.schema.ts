import { z } from 'zod';


export interface Player {
  id: number;
  nickname: string;
  country: string;
  role: string | null;
  rating: number;
  birthDate: string | null;
  teamId: number | null;
}

export interface PlayerView {
  id: number;
  nickname: string;
  country: string;
  role: string | null;
  rating: number;
  team: { id: number; name: string; tag: string } | null;
}

export interface PlayerSummary {
  id: number;
  nickname: string;
  role: string | null;
  rating: number;
}

function isAtLeast13(birthDate: string): boolean {
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() - 13);
  return new Date(birthDate) <= limit;
}

export const PlayerSchema = z.object({
  nickname: z.string().trim().min(2).max(30),
  country: z.string().regex(/^[A-Z]{2}$/, 'must be a 2-letter uppercase country code'),
  role: z.string().trim().max(30).nullish(),
  rating: z.number().int().min(0).max(3000).optional(),
  birthDate: z.iso.date().refine(isAtLeast13, 'must be at least 13 years old').optional(),
  teamId: z.number().int().positive().nullish(),
});
export type PlayerInput = z.infer<typeof PlayerSchema>;
export const PlayerPatchSchema = PlayerSchema.partial();


