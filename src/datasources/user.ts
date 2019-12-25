import { DataSource } from 'apollo-datasource';
import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'ytd',
  password: process.env.DB_PASS || 'ytd',
  database: 'youtd_login',
  sessionVariables: {
    wait_timeout: 31536000,
  },
  acquireTimeout: 5000,
  connectionLimit: 8,
});

class UserAPI extends DataSource {
  pool: any;
  constructor() {
    super();
  }

  async signUp({ username, password, email }) {
    let connection;

    try {
      connection = await pool.getConnection();
      /**
       * check if email AND username exist
       * 
       */
      const checkUser = await connection.query(`
        SELECT username, email FROM accounts
        WHERE username="${username}" AND email="${email}";
      `);
      const parseCheckUser = JSON.parse(JSON.stringify(checkUser));

      if (parseCheckUser.length > 0) {
        throw new Error('User is already existed');
      } else {
        await connection.query(`
          INSERT IGNORE INTO accounts (username, password, email) VALUES
          ("${username}", "${password}", "${email}");
        `);
        const user = await connection.query(`
          SELECT id, username FROM accounts
          WHERE username="${username}";
      `);

        const res = JSON.parse(JSON.stringify(user))[0];

        return res;
      }

    } catch (error) {
      throw error;
    }
  }

  async signIn({ username, password }) {
    let connection;

    try {
      connection = await pool.getConnection();
      const user = await connection.query(`
        SELECT username, id FROM accounts
        WHERE username="${username}" AND password="${password}";
      `);
      const res = JSON.parse(JSON.stringify(user))

      if (res.length > 0) {
        return res[0];
      } else if (res.length < 0) {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      throw error;
    }
  }
}

export default UserAPI;
