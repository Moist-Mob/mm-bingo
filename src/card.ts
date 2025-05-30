import { alea, PRNG } from 'seedrandom';
import { SeedParams } from './params';
import { BingoItem, choices, common, rare } from './bingo.data';

const horizWins = [
  0b11111_00000_00000_00000_00000, 0b00000_11111_00000_00000_00000,
  0b00000_00000_11111_00000_00000, 0b00000_00000_00000_11111_00000,
  0b00000_00000_00000_00000_11111,
];
const vertWins = [
  0b10000_10000_10000_10000_10000, 0b01000_01000_01000_01000_01000,
  0b00100_00100_00100_00100_00100, 0b00010_00010_00010_00010_00010,
  0b00001_00001_00001_00001_00001,
];
const diagWins = [
  0b10000_01000_00100_00010_00001, 0b00001_00010_00100_01000_10000,
];
export const checkWin = (checked: number, masks: number[]): number => {
  let bits = 0;
  for (let i = 0; i < masks.length; i++) {
    const mask = masks[i];
    if ((checked & mask) == mask) bits |= mask;
  }
  return bits;
};

export const ALWAYS_CHECKED = 0b00000_00000_00100_00000_00000;

export const shuffle = <T>(arr: T[], rng: PRNG): T[] => {
  let i = arr.length,
    j,
    temp;
  while (--i > 0) {
    j = Math.floor(rng.double() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

// prettier-ignore
const onFreeLine = (rng: PRNG) => shuffle([
  0,       2,      4,
       6,  7,  8,
  10, 11,     12, 13,
      15, 16, 17,
  19,     21,     23,
], rng);

// prettier-ignore
const offFreeLine = (rng: PRNG) => shuffle([
       1,      3,
   5,              9,

  14,             18,
      20,     22,
], rng);

type Rarity = { idx: number; item: BingoItem };
const genRarities = (rng: PRNG): Rarity[] => {
  const onFree = onFreeLine(rng);
  const offFree = offFreeLine(rng);

  const rarities = shuffle(
    rare
      .map(item => ({
        idx: onFree.pop()!,
        item: { ...item, uncommon: true },
      }))
      .concat(
        common.map(item => ({
          idx: offFree.pop()!,
          item: { ...item, uncommon: true },
        }))
      ),
    rng
  );

  // when we splice an item in, everything _after_
  // where we spliced will shift. ensure we insert
  // from left-to-right so that the items go in the
  // index where they are supposed to, without getting
  // moved by later inserts
  rarities.sort((a, b) => b.idx - a.idx);

  return rarities;
};

export const genCard = (seed: string): BingoItem[] => {
  const rng = alea(seed);
  const card = shuffle(choices.slice(), rng);

  let rarities: Rarity[] | undefined = undefined;

  // 30% chance to insert a rare/common
  for (let i = 0; rng.double() < 0.3 && i < 2; i++) {
    rarities ??= genRarities(rng);
    const { idx, item } = rarities.pop()!;
    card.splice(idx, 0, item);
  }

  return card
    .slice(0, 24)
    .map(item =>
      Array.isArray(item) ? item[Math.floor(rng.double() * item.length)] : item
    );
};

export const getHorizBits = (bits: number) =>
  checkWin(bits, horizWins) | checkWin(bits, diagWins);
export const getVertBits = (bits: number) =>
  checkWin(bits, vertWins) | checkWin(bits, diagWins);
