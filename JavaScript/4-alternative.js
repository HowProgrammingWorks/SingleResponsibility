'use strict';

const fs = require('node:fs').promises;

const ENTER = 13;
const REQUIRED_LEN = 7;

const user = ({ id }) => {
  let data = null;
  let loaded = null;
  let changed = null;
  const input = [];

  const startInput = () => {
    process.stdin.setRawMode(true);
    process.stdout.write('Enter new password: ');
  };

  const endInput = () => {
    process.stdin.removeAllListeners('data');
    process.stdin.setRawMode(false);
    if (changed) changed();
  };

  fs.readFile(`./user${id}.json`, 'utf8')
    .then(JSON.parse)
    .then((user) => {
      data = user;
      data.toString = () => {
        const { name, login, email } = data;
        return `User: ${login} (${name}) <${email}>`;
      };
      if (loaded) loaded(data);
      startInput();
    });

  const save = () =>
    new Promise((resolve) => {
      changed = resolve;
    }).then(() => {
      const json = JSON.stringify(data);
      return fs.writeFile(`./user${id}.json`, json).then(() => data);
    });

  const checkPasswordStrength = (password) => password.length >= REQUIRED_LEN;

  const reader = {
    on: (event, callback) => {
      if (event === 'read') loaded = callback;
      return reader;
    },
    changePassword: () => ({ save }),
  };

  process.stdin.on('data', (chunk) => {
    const key = chunk[0];
    if (key === ENTER) {
      process.stdout.write('\n');
      const password = Buffer.concat(input).toString();
      const enough = checkPasswordStrength(password);
      if (enough) {
        data.password = password;
        console.log('Your password is strong enough');
      } else {
        console.log('Your password is not strong enough');
      }
      return void endInput();
    }
    process.stdout.write('*');
    input.push(chunk);
  });

  return reader;
};

// Usage

user({ id: 2073 })
  .on('read', (data) => {
    console.log(`${data}`);
  })
  .changePassword()
  .save()
  .then((data) => {
    console.log(`${data}`);
  })
  .finally(() => {
    process.exit(0);
  });
