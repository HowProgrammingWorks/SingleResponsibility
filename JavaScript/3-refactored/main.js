'use strict';

const Database = require('./database.js');
const Input = require('./input.js');
const config = require('./config.js');
const parser = require(`./${config.format}.js`);

const main = async () => {
  const checkPasswordStrength = (password) => password.length >= 7;

  const userToString = ({ name, login, email }) =>
    `User: ${login} (${name}) <${email}>`;

  const db = new Database(parser);
  const user = await db.read(2073);
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
