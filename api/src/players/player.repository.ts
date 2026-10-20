import { query } from '../db.js';
import { BaseRepository } from '../repository.js';
import type { Player, PlayerSummary, PlayerView } from './player.schema.js';



const VIEW = `
  SELECT p.id, p.nickname, p.country, p.role, p.rating,
         CASE WHEN t.id IS NULL THEN NULL
              ELSE json_build_object('id', t.id, 'name', t.name, 'tag', t.tag) END AS team
  FROM player p
         LEFT JOIN team t ON t.id = p.team_id`;
class PlayerRepository extends BaseRepository<Player> {
  constructor() {
    super(
      'player',
      ['id', 'nickname', 'country', 'role', 'rating', 'birth_date::text AS "birthDate"', 'team_id AS "teamId"'],
      'nickname',
    );
  }

  async findView(id: number): Promise<PlayerView | null> {
    const [player] = await query<PlayerView>(`${VIEW} WHERE p.id = $1`, [id]);
    return player ?? null;
  }

  findViews(): Promise<PlayerView[]> {
    return query<PlayerView>(`${VIEW} ORDER BY p.nickname`);
  }

  findByTeam(teamId: number): Promise<PlayerSummary[]> {
    return query<PlayerSummary>(
      'SELECT id, nickname, role, rating FROM player WHERE team_id = $1 ORDER BY nickname',
      [teamId],
    );
  }
}



export const playerRepository = new PlayerRepository();
