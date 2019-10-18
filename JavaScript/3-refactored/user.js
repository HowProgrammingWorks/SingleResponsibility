'use strict';

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

module.exports = User;
