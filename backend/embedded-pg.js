const path = require('path');
const fs = require('fs');
const EmbeddedPostgres = require('embedded-postgres').default;

const dbDir = path.resolve(__dirname, 'data/pg_data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const pg = new EmbeddedPostgres({
  databaseDir: dbDir,
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  persistent: true
});

async function startDatabase() {
  try {
    const isInit = fs.existsSync(path.join(dbDir, 'PG_VERSION'));
    if (!isInit) {
      console.log('Initializing embedded PostgreSQL cluster in', dbDir);
      await pg.initialise();
    }
    console.log('Starting PostgreSQL on port 5432...');
    await pg.start();
    console.log('PostgreSQL server is running on localhost:5432');

    // Ensure foodbridge_db database exists
    try {
      await pg.createDatabase('foodbridge_db');
      console.log('Database foodbridge_db created or already exists.');
    } catch (dbErr) {
      if (!dbErr.message?.includes('already exists')) {
        console.log('Database creation note:', dbErr.message);
      }
    }
    return pg;
  } catch (err) {
    console.error('Failed to start embedded PostgreSQL:', err);
    throw err;
  }
}

if (require.main === module) {
  startDatabase().then(() => {
    console.log('Embedded PostgreSQL daemon ready.');
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { pg, startDatabase };
