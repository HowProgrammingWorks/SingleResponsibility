'use strict';

const fs = require('fs').promises;

const User = require('./user.js');

class Database {
  constructor(parser) {
    this._parser = parser;
  }

  fileName(id) {
    console.dir(this);
    return `./user${id}.${this._parser.name}`;
  }

  async read(id) {
    const data = await fs.readFile(this.fileName(id), 'utf8');
    const obj = this._parser.parse(data);
    return new User(id, obj);
  }

  async save(user) {
    const data = this._parser.serialize(user);
    const id = user[Symbol.for('id')];
    await fs.writeFile(this.fileName(id), data);
  }
}

module.exports = Database;
