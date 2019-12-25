import { DataSource } from 'apollo-datasource';
import { pagination } from '../utils';
import { pool } from '../utils';

class TowerAPI extends DataSource {
  constructor() {
    super();
  }

  async getTowers({
    // pagination
    pageSize = 40,
    after = 0,
    // select
    rarity = ['common', 'uncommon', 'rare', 'unique'],
    attackType = ['magic', 'decay', 'elemental', 'energy', 'physical', 'essence'],
    element = ['nature', 'ice', 'fire', 'darkness', 'astral', 'storm', 'iron'],
    notRarity = [],
    notAttackType = [],
    notElement = [],
    // range
    damage = [0, 10000],
    attackCd = [0, 10],
    rangeTower = [0, 10000],
    goldcost = [30, 10000],
    waveLvlUp = [0, 250],
    elementLvlUp = [0, 15],
  }) {
    let query: string = `
      SELECT 
        attack_type.attack_type_name,
        element.element_name,
        rarity.rarity_name,
        tower.tower_id,
        tower.icon,
        tower.tower_name,
        tower.goldcost,
        tower.wave_lvl_up,
        tower.element_lvl_up,
        tower.range_tower,
        tower.min_damage,
        tower.max_damage,
        tower.attack_cd,
        tower.tower_description,
        tower.specials,
        CONCAT(
            '[',
            GROUP_CONCAT(JSON_OBJECT(
              'ability_id', ability.ability_id,
              'ability_name', ability.ability_name,
              'ability_description', ability.ability_description,
              'lvl_bonus', ability.lvl_bonus,
              'ability_active', ability.ability_active
            )),
            ']'
          ) as abilities
      FROM tower
      INNER JOIN attack_type
        ON tower.attack_type_id=attack_type.attack_type_id
      INNER JOIN element
        ON element.element_id=tower.element_id
      INNER JOIN rarity
        ON rarity.rarity_id=tower.rarity_id
      LEFT JOIN tower_ability
        ON tower_ability.tower_id = tower.tower_id
      LEFT JOIN ability
        ON ability.ability_id = tower_ability.ability_id
      `;

    const selectCondition = [];
    const rangeCondition = `
      ((tower.goldcost >= ${goldcost[0]} and 
        tower.goldcost <= ${goldcost[1]}) 
        and (tower.wave_lvl_up >= ${waveLvlUp[0]} and 
          tower.wave_lvl_up <= ${waveLvlUp[1]}) 
        and (tower.element_lvl_up >= ${elementLvlUp[0]} and 
          tower.element_lvl_up <= ${elementLvlUp[1]}) 
        and (tower.range_tower >= ${rangeTower[0]} and 
          tower.range_tower <= ${rangeTower[1]}) 
        and (tower.min_damage >= ${damage[0]} and 
          tower.max_damage <= ${damage[1]}) 
        and (tower.attack_cd >= ${attackCd[0]} and 
          tower.attack_cd <= ${attackCd[1]}))`;

    // multiply if statements for select condition
    // RARITY
    if (rarity.length > 0) {
      const values = rarity.map(el => `'${el}'`).join(",");
      selectCondition.push(`rarity.rarity_name IN(${values})`);
    }

    // ELEMENT
    if (element.length > 0) {
      const values = element.map(el => `'${el}'`).join(",");
      selectCondition.push(`element.element_name IN(${values})`);
    }

    // ATTACK TYPE NAME
    if (attackType.length > 0) {
      const values = attackType.map(el => `'${el}'`).join(",");
      selectCondition.push(`attack_type.attack_type_name IN(${values})`);
    }

    // EXCLUDE VALUES FROM THE RESPONSE
    // NOT RARITY
    if (notRarity.length > 0) {
      const values = notRarity.map(el => `'${el}'`).join(",");
      selectCondition.push(`rarity.rarity_name NOT IN(${values})`);
    }

    // NOT ELEMENT
    if (notElement.length > 0) {
      const values = notElement.map(el => `'${el}'`).join(",");
      selectCondition.push(`element.element_name NOT IN(${values})`);
    }

    // NOT ATTACK TYPE NAME
    if (notAttackType.length > 0) {
      const values = notAttackType.map(el => `'${el}'`).join(",");
      selectCondition.push(`attack_type.attack_type_name NOT IN(${values})`);
    }

    if (selectCondition.length > 0) {
      query = query + ` WHERE ${selectCondition.join(' AND ')}`;
    }

    if (rangeCondition.length > 0 && selectCondition.length > 0) {
      query = query + ` AND ${rangeCondition}`;
    }


    if (rangeCondition.length > 0 && selectCondition.length <= 0) {
      query = query + ` WHERE ${rangeCondition}`;
    }

    let connection;

    try {
      connection = await pool.getConnection();
      const count = await connection.query(
        `SELECT MAX(tower_id) as count FROM (${query} GROUP BY tower.tower_id) as T;`
      );
      const result = await pagination({
        connection,
        pageSize,
        count: JSON.parse(JSON.stringify(count))[0].count,
        query,
        cursor: after,
        list: 'towers',
      });

      return result;

    } catch (error) {
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}

export default TowerAPI;
