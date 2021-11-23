'use strict';

const ENTER = 13;

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

module.exports = Input;
