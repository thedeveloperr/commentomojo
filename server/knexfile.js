// Update with your config settings.

module.exports = {
 production: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './prod.sqlite3'
    },
    pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb)
    },
  },
 },
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
};
