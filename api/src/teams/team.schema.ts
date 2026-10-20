import { z } from 'zod';
import type { PlayerSummary } from '../players/player.schema.js';

export interface Team {
  id: number;
  name: string;
  tag: string;
  country: string;
}

export interface TeamWithPlayers extends Team {
  players: PlayerSummary[];
}

export const TeamSchema = z.object({
  name: z.string().trim().min(2).max(50),
  tag: z.string().regex(/^[A-Z0-9]{2,5}$/),
  country: z.string().regex(/^[A-Z]{2}$/),
});

export type TeamInput = z.infer<typeof TeamSchema>;
export const TeamPatchSchema = TeamSchema.partial();
export const TeamQuerySchema = z.object({
  country: z.string().regex(/^[A-Za-z]{2}$/).transform((s) => s.toUpperCase()).optional(),
});
export type TeamQuery = z.infer<typeof TeamQuerySchema>;
