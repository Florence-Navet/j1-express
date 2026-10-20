import { Router } from 'express';
import { HttpError } from '../errors.js';
import { parseId } from '../middlewares/params.js';
import { validate, validateQuery } from '../middlewares/validate.js';
import { teams } from './team.repository.js';
import { TeamQuerySchema, TeamPatchSchema, TeamSchema, type TeamInput, type TeamQuery } from './team.schema.js';
import { teamRepository } from './team.repository.js';


export const teamRouter = Router();

// GET /api/teams[?country=FR]
teamRouter.get('/', validateQuery(TeamQuerySchema), async (_req, res) => {
  const {country} = res.locals.query as TeamQuery;
  res.json(await teams.findByCountry(country));
});


// GET /api/teams/:id
teamRouter.get('/:id', async (req, res) => {
  // const team = await teams.findOne(parseId(req.params.id, 'Team'));
  const team = await teamRepository.findOneWithPlayers(parseId(req.params.id, 'Team'));
  if (!team) throw new HttpError(404, 'Team not found');
  res.json(team);
});

// POST /api/teams
teamRouter.post('/', validate(TeamSchema), async (req, res) => {
  const team = await teams.insert(req.body as TeamInput);
  res.status(201).location(`/api/teams/${team.id}`).json(team);
});

// PATCH /api/teams/:id
teamRouter.patch('/:id', validate(TeamPatchSchema), async (req, res) => {
  const team = await teamRepository.update(parseId(req.params.id, 'Team'), req.body as Partial<TeamInput>);
  if (!team) throw new HttpError(404, 'Team not found');
  res.json(team);
});

// DELETE /api/teams
teamRouter.delete('/:id', async (req, res) => {
  const deleted = await teamRepository.delete(parseId(req.params.id, 'Team'));
  if (!deleted) throw new HttpError(404, 'Team not found');
  res.sendStatus(204);
});
