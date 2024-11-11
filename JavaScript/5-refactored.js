'use strict';

const fs = require('node:fs').promises;

const ENTER = 13;
const REQUIRED_LEN = 7;

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => v.then(f), Promise.resolve(x));

const readUser = ({ id }) =>
  fs
    .readFile(`./user${id}.json`, 'utf8')
    .then(JSON.parse)
    .then((user) => ({ [Symbol.for('id')]: id, ...user }));

const saveUser = async (user) => {
  const id = user[Symbol.for('id')];
  const json = JSON.stringify(user);
  await fs.writeFile(`./user${id}.json`, json);
};

const checkPasswordStrength = (password) => password.length >= REQUIRED_LEN;

const input = async (prompt, mask) => {
  process.stdin.setRawMode(true);
  process.stdout.write(prompt);
  let resolve = null;
  const input = [];

  const done = () => {
    process.stdin.removeAllListeners('data');
    process.stdin.setRawMode(false);
    const value = Buffer.concat(input).toString();
    resolve(value);
  };

  process.stdin.on('data', (chunk) => {
    const key = chunk[0];
    if (key === ENTER) {
      process.stdout.write('\n');
      return void done();
    }
    process.stdout.write(mask);
    input.push(chunk);
  });

  return new Promise((r) => {
    resolve = r;
  });
};

const changePassword = async (user) => {
  const password = await input('Enter new password: ', '*');
  const enough = checkPasswordStrength(password);
  if (enough) {
    console.log('Your password is strong enough');
    return { ...user, password };
  } else {
    console.log('Your password is not strong enough');
    return user;
  }
};

const logStep = async (user) => {
  const { name, login, email } = user;
  console.log(`User: ${login} (${name}) <${email}>`);
  return user;
};

// Usage

const main = pipe(readUser, logStep, changePassword, logStep, saveUser);

main({ id: 2073 }).then(process.exit);
