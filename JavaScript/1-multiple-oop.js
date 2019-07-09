'use strict';

const fs = require('fs').promises;

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
    fs.writeFile(`./user${id}.json`, json);
  }

  toString() {
    const { name, login, email } = this.data;
    return `User: ${login} (${name}) <${email}>`;
  }
}

// Usage

(async () => {
  const user = await User.read(2073);
  console.log(`${user}`);
  user.save();
})();
