import { Router } from 'express';
import { HttpError } from '../errors.js';
import { parseId } from '../middlewares/params.js';
import { validate } from '../middlewares/validate.js';
import { playerRepository } from './player.repository.js';

import { PlayerSchema, type PlayerInput, PlayerPatchSchema } from './player.schema.js';



export const playerRouter = Router();

// GET /api/players
playerRouter.get('/', async (_req, res) => {
  res.json(await playerRepository.findViews());
});

// GET /api/players/:id
playerRouter.get('/:id', async (req, res) => {
  const player = await playerRepository.findView(parseId(req.params.id, 'Player'));
  if (!player) throw new HttpError(404, 'Player not found');
  res.json(player);
});

// POST /api/players
playerRouter.post('/', validate(PlayerSchema), async (req, res) => {
  const created = await playerRepository.insert(req.body as PlayerInput);
  const player = await playerRepository.findView(created.id);
  res.status(201).location(`/api/players/${created.id}`).json(player);
});

// PATCH /api/players/:id
playerRouter.patch('/:id', validate(PlayerPatchSchema), async (req, res) => {
  const id = parseId(req.params.id, 'Player');
  const updated = await playerRepository.update(id, req.body as Partial<PlayerInput>);
  if (!updated) throw new HttpError(404, 'Player not found');
  res.json(await playerRepository.findView(id));
});

// DELETE /api/players/:id
playerRouter.delete('/:id', async (req, res) => {
  const deleted = await playerRepository.delete(parseId(req.params.id, 'Player'));
  if (!deleted) throw new HttpError(404, 'Player not found');
  res.sendStatus(204);
});
