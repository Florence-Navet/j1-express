import { query } from '../db.js';
import { BaseRepository } from '../repository.js';
import type { Team, TeamWithPlayers } from './team.schema.js';
import { playerRepository } from '../players/player.repository.js';

class TeamRepository extends BaseRepository<Team> {
  constructor() {
    super('team', ['id', 'name', 'tag', 'country'], 'name');
  }

  findByCountry(country?: string): Promise<Team[]> {
    if (country === undefined) {
      return query<Team>('SELECT id, name, tag, country FROM team ORDER BY name');
    }
    return query<Team>(
      'SELECT id, name, tag, country FROM team WHERE country = $1 ORDER BY name',
      [country],
    );
  }

  async findOneWithPlayers(id: number): Promise<TeamWithPlayers | null> {
    const team = await this.findOne(id);
    if (!team) return null;
    const players = await playerRepository.findByTeam(id);
    return { ...team, players };
  }
}


export const teamRepository = new TeamRepository();
export const teams = new TeamRepository();
