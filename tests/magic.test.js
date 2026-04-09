// Tests for magic module
const { MagicSpell } = require("../src/magic");

console.log("Running tests...");

const spell = new MagicSpell("Fireball");
spell.amplify(50);
console.log(spell.cast());

console.log("✅ Tests passed!");
