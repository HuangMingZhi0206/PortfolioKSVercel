import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const hash = bcrypt.hashSync('admin123', 10);
const client = new pg.Client(process.env.DATABASE_URL);

client.connect()
  .then(() => client.query('UPDATE admin_users SET password = $1 WHERE email = $2', [hash, 'admin@kevinsyonin.com']))
  .then(() => {
    console.log('Password reset successfully');
    client.end();
  })
  .catch(e => {
    console.error(e);
    client.end();
  });

