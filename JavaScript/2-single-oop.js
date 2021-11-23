'use strict';

const fs = require('fs').promises;

const ENTER = 13;

class User {
  constructor(id, data) {
    const { name, login, password, email } = data;
    this[Symbol.for('id')] = id;
    this.name = name;
    this.login = login;
    this.password = password;
    this.email = email;
  }
}

class Database {
  static async read(id) {
    const json = await fs.readFile(`./user${id}.json`, 'utf8');
    const data = JSON.parse(json);
    return new User(id, data);
  }

  static async save(user) {
    const id = user[Symbol.for('id')];
    const json = JSON.stringify(user);
    await fs.writeFile(`./user${id}.json`, json);
  }
}


class Input {
  constructor(prompt, mask) {
    process.stdin.setRawMode(true);
    process.stdout.write(prompt);
    this._resolve = null;
    this._input = [];

    process.stdin.on('data', (chunk) => {
      const key = chunk[0];
      if (key === ENTER) {
        process.stdout.write('\n');
        this.done();
        return;
      }
      process.stdout.write(mask);
      this._input.push(chunk);
    });

    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  done() {
    process.stdin.removeAllListeners('data');
    process.stdin.setRawMode(false);
    const value = Buffer.concat(this._input).toString();
    this._resolve(value);
  }
}

const isPasswordValid = (password) => password.length >= 7;

const userToString = (user) => {
  const { name, login, email } = user;
  return `User: ${login} (${name}) <${email}>`;
};

// Usage

(async () => {
  const user = await Database.read(2073);
  console.log(userToString(user));
  const password = await new Input('Enter new password: ', '*');
  const valid = isPasswordValid(password);
  if (valid) {
    user.password = password;
    await Database.save(user);
  }
  console.log('Password:', valid ? 'is valid' : 'is not valid');
  console.log(userToString(user));
  process.exit(0);
})();
