import { query } from '../db.js';
import { BaseRepository } from '../repository.js';
import type { Team } from './team.schema.js';

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
}



export const teams = new TeamRepository();
