// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './dev.sqlite3'
    },
    pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb)
    },
  },
  },
  integration_test: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './integration_test.sqlite3'
    },
    pool: {
      min: 1,
      max: 1,
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb)
    },
   }
  },
  test: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './test.sqlite3'
    },
    pool: {
      min: 1,
      max: 1,
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb)
    },
  },

  }
/*
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
*/
};
