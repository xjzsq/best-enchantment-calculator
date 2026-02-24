import type { Enchantment } from '../data/enchantments';
import { ENCHANTMENTS } from '../data/enchantments';

export interface EnchantLevel {
  enchantmentId: string;
  level: number;
}

export interface Item {
  id: string;
  label: string;
  isBook: boolean;
  enchantments: EnchantLevel[];
  penalty: number; // work penalty count (0-based, actual cost = 2^penalty - 1)
}

export interface ForgeStep {
  target: Item;
  sacrifice: Item;
  result: Item;
  cost: number; // XP levels
}

export interface CalcResult {
  steps: ForgeStep[];
  totalCost: number;
  calcTimeMs?: number;
}

function getEnchantById(id: string): Enchantment | undefined {
  return ENCHANTMENTS.find(e => e.id === id);
}

function hasConflict(enchId: string, otherEnchId: string): boolean {
  const ench = getEnchantById(enchId);
  if (!ench) return false;
  return ench.conflicts.includes(otherEnchId);
}

function penaltyCost(penalty: number): number {
  return Math.pow(2, penalty) - 1;
}

/** Calculate the enchantment cost of an item as sacrifice (ignoring penalty) */
function calcSacrificeCost(item: Item): number {
  let cost = 0;
  for (const e of item.enchantments) {
    const data = getEnchantById(e.enchantmentId);
    if (!data) continue;
    const multiplier = item.isBook ? data.bookMultiplier : data.itemMultiplier;
    cost += multiplier * e.level;
  }
  return cost;
}

export function preForge(
  target: Item,
  sacrifice: Item,
  isJava: boolean
): { result: Item; cost: number } {
  let cost = 0;

  // Enchantment costs
  const resultEnchantments: EnchantLevel[] = [...target.enchantments];

  for (const bEnch of sacrifice.enchantments) {
    const bEnchData = getEnchantById(bEnch.enchantmentId);
    if (!bEnchData) continue;

    // Check conflict with any enchantment in target
    const conflictsWithTarget = target.enchantments.some(aEnch =>
      hasConflict(bEnch.enchantmentId, aEnch.enchantmentId) ||
      hasConflict(aEnch.enchantmentId, bEnch.enchantmentId)
    );

    const multiplier = sacrifice.isBook ? bEnchData.bookMultiplier : bEnchData.itemMultiplier;

    if (conflictsWithTarget) {
      if (isJava) cost += 1;
      // Bedrock: no cost for conflict
      continue;
    }

    const existingIdx = resultEnchantments.findIndex(e => e.enchantmentId === bEnch.enchantmentId);
    if (existingIdx >= 0) {
      const aLvl = resultEnchantments[existingIdx].level;
      const bLvl = bEnch.level;
      let combinedLevel: number;
      if (aLvl === bLvl && aLvl < bEnchData.maxLevel) {
        combinedLevel = aLvl + 1;
      } else {
        combinedLevel = Math.max(aLvl, bLvl);
      }
      if (isJava) {
        cost += multiplier * combinedLevel;
      } else {
        cost += multiplier * (combinedLevel - aLvl);
      }
      resultEnchantments[existingIdx] = { enchantmentId: bEnch.enchantmentId, level: combinedLevel };
    } else {
      cost += multiplier * bEnch.level;
      resultEnchantments.push({ enchantmentId: bEnch.enchantmentId, level: bEnch.level });
    }
  }

  // Penalty cost
  cost += penaltyCost(target.penalty) + penaltyCost(sacrifice.penalty);

  const resultPenalty = Math.max(target.penalty, sacrifice.penalty) + 1;

  const result: Item = {
    id: `${target.id}+${sacrifice.id}`,
    label: '',
    isBook: target.isBook,
    enchantments: resultEnchantments,
    penalty: resultPenalty,
  };

  return { result, cost };
}

let itemCounter = 0;
function newItemId(): string {
  return `item_${++itemCounter}`;
}

/** Build pool of items: weapon + enchanted books with level optimization */
function buildPool(
  weapon: Item,
  targetEnchantments: EnchantLevel[],
): Item[] {
  const pool: Item[] = [{ ...weapon, id: newItemId() }];

  for (const e of targetEnchantments) {
    let bookLevel = e.level;
    // Optimization: if weapon already has this enchantment at level N-1,
    // create a book at level N-1 so combining N-1 + N-1 = N (cheaper)
    const existing = weapon.enchantments.find(we => we.enchantmentId === e.enchantmentId);
    if (existing && e.level - existing.level === 1) {
      const enchData = getEnchantById(e.enchantmentId);
      if (enchData && e.level <= enchData.maxLevel) {
        bookLevel = e.level - 1;
      }
    }

    pool.push({
      id: newItemId(),
      label: '',
      isBook: true,
      enchantments: [{ enchantmentId: e.enchantmentId, level: bookLevel }],
      penalty: 0,
    });
  }

  return pool;
}

/** Find the weapon (non-book) index in the pool */
function findWeaponIndex(pool: Item[]): number {
  return pool.findIndex(item => !item.isBook);
}

/** Sort pool: by penalty ascending, then by enchant cost descending for books */
function sortPool(pool: Item[]): void {
  pool.sort((a, b) => {
    if (a.penalty !== b.penalty) return a.penalty - b.penalty;
    // Within same penalty: non-book items (weapon) stay in place,
    // books are sorted by sacrifice cost descending
    if (a.isBook && b.isBook) {
      return calcSacrificeCost(b) - calcSacrificeCost(a);
    }
    return 0;
  });
}

/** Find the range of indices in pool with a given penalty */
function penaltyRange(pool: Item[], penalty: number): { begin: number; end: number } {
  let begin = -1, end = -1;
  for (let i = 0; i < pool.length; i++) {
    if (pool[i].penalty === penalty) {
      if (begin === -1) begin = i;
      end = i;
    }
  }
  return { begin, end };
}

/**
 * DifficultyFirst algorithm - reference: Dinosaur-MC/BestEnchSeq
 *
 * Key principles:
 * 1. Merge items at the same penalty level first (minimizes penalty costs)
 * 2. Higher-cost items are merged as sacrifices first (when penalty is low)
 * 3. Weapon is ALWAYS the target (left side of anvil)
 * 4. When no same-penalty pairs exist, merge remaining items with weapon as target
 */
export function calcDifficultyFirst(
  weapon: Item,
  targetEnchantments: EnchantLevel[],
  isJava: boolean
): CalcResult {
  itemCounter = 0;
  const pool = buildPool(weapon, targetEnchantments);
  const steps: ForgeStep[] = [];

  let curPenalty = pool[0].penalty; // Start with weapon's penalty
  let mode = 0;

  while (pool.length > 1) {
    sortPool(pool);
    const { begin, end } = penaltyRange(pool, curPenalty);

    if (mode === 0) {
      // Mode 0: merge items at the same penalty level
      if (begin === -1 || end - begin === 0) {
        // 0 or 1 item at this penalty level
        const maxPen = Math.max(...pool.map(p => p.penalty));
        if (curPenalty >= maxPen) {
          curPenalty = Math.min(...pool.map(p => p.penalty));
          mode = 1;
        } else {
          curPenalty++;
        }
        continue;
      }

      // At least 2 items at curPenalty
      const w = findWeaponIndex(pool);

      if (w !== -1 && pool[w].penalty === curPenalty) {
        // Weapon is at current penalty level
        // Merge weapon (target) + first non-weapon at curPenalty (sacrifice)
        let sacrificeIdx = begin;
        if (w === begin) sacrificeIdx = begin + 1;

        const target = pool[w];
        const sacrifice = pool[sacrificeIdx];
        const { result, cost } = preForge(target, sacrifice, isJava);
        result.id = newItemId();
        result.label = `步骤${steps.length + 1}结果`;
        steps.push({ target, sacrifice, result, cost });

        // Replace weapon with result, remove sacrifice
        pool[w] = result;
        pool.splice(sacrificeIdx, 1);
      } else {
        // Weapon is NOT at current penalty level
        // Merge two items at curPenalty (first = target, second = sacrifice)
        const target = pool[begin];
        const sacrifice = pool[begin + 1];
        const { result, cost } = preForge(target, sacrifice, isJava);
        result.id = newItemId();
        result.label = `步骤${steps.length + 1}结果`;
        steps.push({ target, sacrifice, result, cost });

        // Replace second item with result, remove first
        pool[begin + 1] = result;
        pool.splice(begin, 1);
      }
    } else {
      // Mode 1: merge remaining items, weapon always as target
      const w = findWeaponIndex(pool);
      let targetIdx: number, sacrificeIdx: number;

      if (w === 1) {
        targetIdx = 1; // weapon
        sacrificeIdx = 0;
      } else {
        targetIdx = 0; // weapon (at 0 or weapon not found, use 0)
        sacrificeIdx = 1;
      }

      const target = pool[targetIdx];
      const sacrifice = pool[sacrificeIdx];
      const { result, cost } = preForge(target, sacrifice, isJava);
      result.id = newItemId();
      result.label = `步骤${steps.length + 1}结果`;
      steps.push({ target, sacrifice, result, cost });

      // Keep result at lower index, remove higher index
      const minIdx = Math.min(targetIdx, sacrificeIdx);
      const maxIdx = Math.max(targetIdx, sacrificeIdx);
      pool[minIdx] = result;
      pool.splice(maxIdx, 1);

      // Check if any penalty level has 2+ items to switch back to mode 0
      const maxPen = pool.length > 0 ? Math.max(...pool.map(p => p.penalty)) : 0;
      for (let i = 0; i <= maxPen; i++) {
        const range = penaltyRange(pool, i);
        if (range.begin !== -1 && range.end - range.begin > 0) {
          curPenalty = i;
          mode = 0;
          break;
        }
      }
    }
  }

  const totalCost = steps.reduce((sum, s) => sum + s.cost, 0);
  return { steps, totalCost };
}

/**
 * Hamming algorithm - binary tree merge
 *
 * Arranges items in a sequence (weapon first, then books by cost descending)
 * and merges them pairwise bottom-up in a binary tree structure.
 * The weapon at position 0 ensures it is always the target (left side).
 */
export function calcHamming(
  weapon: Item,
  targetEnchantments: EnchantLevel[],
  isJava: boolean
): CalcResult {
  itemCounter = 0;
  const pool = buildPool(weapon, targetEnchantments);
  const steps: ForgeStep[] = [];

  if (pool.length <= 1) {
    return { steps, totalCost: 0 };
  }

  // Weapon stays first; sort books by sacrifice cost descending
  const weaponItem = pool[0];
  const books = pool.slice(1).sort((a, b) => calcSacrificeCost(b) - calcSacrificeCost(a));
  let currentLevel = [weaponItem, ...books];

  while (currentLevel.length > 1) {
    const nextLevel: Item[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const target = currentLevel[i];
        const sacrifice = currentLevel[i + 1];
        const { result, cost } = preForge(target, sacrifice, isJava);
        result.id = newItemId();
        result.label = `步骤${steps.length + 1}结果`;
        steps.push({ target, sacrifice, result, cost });
        nextLevel.push(result);
      } else {
        nextLevel.push(currentLevel[i]);
      }
    }
    currentLevel = nextLevel;
  }

  const totalCost = steps.reduce((sum, s) => sum + s.cost, 0);
  return { steps, totalCost };
}
