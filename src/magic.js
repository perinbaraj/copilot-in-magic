// Magic utilities and core functionality

class MagicSpell {
  constructor(name) {
    this.name = name;
    this.power = 0;
  }

  cast() {
    return `✨ Casting ${this.name}... Power: ${this.power}`;
  }

  amplify(boost) {
    this.power += boost;
    return this;
  }
}

module.exports = { MagicSpell };
