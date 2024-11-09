'use strict';

const Database = require('./database.js');
const Input = require('./input.js');
const config = require('./config.js');
const parser = require(`./${config.format}.js`);

const main = async () => {
  const REQUIRED_LEN = 7;
  const checkPasswordStrength = (password) => password.length >= REQUIRED_LEN;

  const userToString = ({ name, login, email }) =>
    `User: ${login} (${name}) <${email}>`;

  const db = new Database(parser);
  const userId = 2073;
  const user = await db.read(userId);
  console.log(userToString(user));

  const password = await new Input('Enter new password: ', '*');
  const enough = checkPasswordStrength(password);
  if (enough) {
    user.password = password;
    await db.save(user);
    console.log('Your password is strong enough');
  } else {
    console.log('Your password is not strong enough');
  }
  console.log(userToString(user));
  process.exit(0);
};

main();
