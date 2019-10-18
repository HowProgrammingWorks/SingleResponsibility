'use strict';

const Database = require('./database.js');
const Input = require('./input.js');
const config = require('./config.js');
const Parser = require(`./${config.format}.js`);

(async () => {
  const isPasswordValid = password => password.length >= 7;

  const userToString = ({ name, login, email }) =>
    `User: ${login} (${name}) <${email}>`;

  const parser = new Parser();
  const db = new Database(parser);
  const user = await db.read(2073);
  console.log(userToString(user));

  const password = await new Input('Enter new password: ', '*');
  const valid = isPasswordValid(password);
  if (valid) {
    user.password = password;
    await db.save(user);
  }

  console.log('Password:', valid ? 'is valid' : 'is not valid');
  console.log(userToString(user));

  process.exit(0);
})();
