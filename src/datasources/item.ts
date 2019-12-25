import { DataSource } from 'apollo-datasource';
import { pagination } from '../utils';
import { pool } from '../utils';

class ItemAPI extends DataSource {
  constructor() {
    super();
  }

  async getItems({
    // pagination
    pageSize = 40,
    after = 0,
    // select
    rarity = ['common', 'uncommon', 'rare', 'unique'],
    notRarity = [],
    // range
    waveLvlDrop = [0, 150],
    goldcost = [30, 10000]
  }) {
    let query = `
      SELECT
        rarity.rarity_name,
        item.item_id,
        item.item_name,
        item.icon,
        item.goldcost,
        item.wave_lvl_drop,
        item.item_description,
        item.specials,
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
      FROM item
      INNER JOIN rarity
        ON rarity.rarity_id=item.rarity_id
      LEFT JOIN item_ability
        ON item_ability.item_id = item.item_id
      LEFT JOIN ability
        ON ability.ability_id = item_ability.ability_id
    `;

    const selectCondition = [];
    const rangeCondition = `
      ((item.goldcost >= ${goldcost[0]} 
        AND item.goldcost <= ${goldcost[1]})
        AND (item.wave_lvl_drop >= ${waveLvlDrop[0]}
        AND item.wave_lvl_drop <= ${waveLvlDrop[1]}))`;

    if (rarity.length > 0) {
      const values = rarity.map(el => `'${el}'`).join(",");
      selectCondition.push(`rarity.rarity_name IN(${values})`);
    }

    if (notRarity.length > 0) {
      const values = notRarity.map(el => `'${el}'`).join(",");
      selectCondition.push(`rarity.rarity_name NOT IN(${values})`);
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
        `SELECT MAX(item_id) as count FROM (${query} GROUP BY item.item_id) as T;`
      );

      const result = await pagination({
        connection,
        pageSize,
        count: JSON.parse(JSON.stringify(count))[0].count,
        query,
        cursor: after,
        list: 'items',
      });

      return result;

    } catch (error) {
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}

export default ItemAPI;
