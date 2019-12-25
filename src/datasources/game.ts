import { DataSource } from 'apollo-datasource';
import { pool } from '../utils';

class GameAPI extends DataSource {
  constructor() {
    super();
  }

  async setConnection (query: string) {
    let connection;
  
    try {
      connection = await pool.getConnection();
      const rows = await connection.query(query);
      return rows;
  
    } catch (err) {
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }

  async getElements() {
    return await this.setConnection('SELECT * from element');
  }

  async getAttackTypes() {
    return await this.setConnection('SELECT * from attack_type');
  }

  async getRarities() {
    return await this.setConnection('SELECT * from rarity');
  }

  async getCreeps() {
    return await this.setConnection('SELECT * from creep');
  }

  async getCreepSizes() {
    return await this.setConnection('SELECT * from creep_size');
  }
}

export default GameAPI;
