'use strict';

class JsonParser {
  constructor() {
    this.name = 'json';
  }

  parse(data) {
    return JSON.parse(data);
  }

  serialize(obj) {
    return JSON.stringify(obj);
  }
}

module.exports = JsonParser;
