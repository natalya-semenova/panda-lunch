import { curry } from 'ramda';
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default curry(getRandomInt);
