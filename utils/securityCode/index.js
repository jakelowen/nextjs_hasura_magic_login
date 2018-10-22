const sample = require('lodash/sample');
const uniq = require('lodash/uniq');
const { adjectives, nouns } = require('./vocab');
// import { adjectives, nouns } from "./vocab";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const generateSecurityCode = () => {
  const noun = sample(uniq(nouns));
  const adjective = sample(uniq(adjectives));
  const number = getRandomInt(99) + 1;
  return `${number} ${adjective} ${noun}`;
};

module.exports = generateSecurityCode;
