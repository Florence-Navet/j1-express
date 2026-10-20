import { z } from 'zod';

export interface Team {
  id: number;
  name: string;
  tag: string;
  country: string;
}


export const TeamQuerySchema = z.object({
  country: z.string().length(2).transform((s) => s.toUpperCase()).optional(),
});
export type TeamQuery = z.infer<typeof TeamQuerySchema>;
