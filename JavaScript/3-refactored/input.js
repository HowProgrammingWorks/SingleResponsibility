'use strict';

const ENTER = 13;

class Input {
  #resolve = null;
  #input = [];

  constructor(prompt, mask) {
    process.stdin.setRawMode(true);
    process.stdout.write(prompt);

    process.stdin.on('data', (chunk) => {
      const key = chunk[0];
      if (key === ENTER) {
        process.stdout.write('\n');
        this.done();
        return;
      }
      process.stdout.write(mask);
      this.#input.push(chunk);
    });

    return new Promise((resolve) => {
      this.#resolve = resolve;
    });
  }

  done() {
    process.stdin.removeAllListeners('data');
    process.stdin.setRawMode(false);
    const value = Buffer.concat(this.#input).toString();
    this.#resolve(value);
  }
}

module.exports = Input;
