'use strict';

const fs = require('fs').promises;

const CTRL_C = 3;
const ENTER = 13;

class User {
  constructor(id, data) {
    this.id = id;
    this.data = data;
  }

  static async read(id) {
    const json = await fs.readFile(`./user${id}.json`, 'utf8');
    const data = JSON.parse(json);
    return new User(id, data);
  }

  async save() {
    const { id, data } = this;
    const json = JSON.stringify(data);
    await fs.writeFile(`./user${id}.json`, json);
  }

  toString() {
    const { name, login, email } = this.data;
    return `User: ${login} (${name}) <${email}>`;
  }

  static isPasswordValid(password) {
    return password.length >= 7;
  }

  async changePassword() {
    process.stdin.setRawMode(true);
    process.stdout.write('Enter new password: ');
    let resolve = null;
    const input = [];
    const done = () => {
      process.stdin.removeAllListeners('data');
      process.stdin.setRawMode(false);
      resolve();
    };
    process.stdin.on('data', chunk => {
      process.stdout.write('*');
      const key = chunk[0];
      if (key === CTRL_C) done();
      if (key === ENTER) {
        process.stdout.write('\n');
        const password = Buffer.concat(input).toString();
        const valid = User.isPasswordValid(password);
        if (valid) this.data.password = password;
        console.log('Password:', valid ? 'is valid' : 'is not valid');
        done();
      }
      input.push(chunk);
    });
    return new Promise(r => {
      resolve = r;
    });
  }
}

// Usage

(async () => {
  const user = await User.read(2073);
  console.log(`${user}`);
  await user.changePassword();
  await user.save();
  process.exit(0);
})();
