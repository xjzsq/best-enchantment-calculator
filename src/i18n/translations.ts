export type Locale = 'zh' | 'en';

export interface Translations {
  // App
  appTitle: string;
  footerText: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  weaponLabel: string;
  viewOnGitHub: string;
  craftedBy: string;
  craftedByPost: string;
  poweredByLabel: string;
  poweredByPost: string;

  // Common table columns
  colSelect: string;
  colEnchant: string;
  colMaxLevel: string;
  conflicted: string;

  // Step1
  colLevel: string;
  labelEdition: string;
  javaEdition: string;
  bedrockEdition: string;
  labelWeapon: string;
  labelPenalty: string;
  labelInitialEnchants: string;
  nextStep: string;

  // Step2
  labelAlgorithm: string;
  difficultyFirst: string;
  hamming: string;
  labelOptions: string;
  ignorePenaltyLabel: string;
  labelTargetEnchants: string;
  colTargetLevel: string;
  prevStep: string;
  calculate: string;

  // Step3
  enchantSteps: (count: number) => string;
  tooExpensive: string;
  tooExpensiveDesc: string;
  step: (n: number) => string;
  costLabel: string;
  levelUnit: string;
  tooExpensiveTag: string;
  targetLabel: string;
  sacrificeLabel: string;
  resultLabel: string;
  enchantedBook: string;
  itemLabel: string;
  penaltyValue: string;
  noSteps: string;
  totalCost: string;
  versionLabel: string;
  algorithmLabel: string;
  calcTimeLabel: string;
  resetStep: string;
  javaEditionShort: string;
  bedrockEditionShort: string;
}

const zh: Translations = {
  appTitle: 'MC 最优附魔顺序计算器',
  footerText: 'MC 最优附魔顺序计算器',
  step1Title: '选择物品',
  step1Desc: '选择版本、物品和初始附魔',
  step2Title: '目标附魔',
  step2Desc: '选择算法和目标附魔',
  step3Title: '计算结果',
  step3Desc: '查看最优附魔顺序',
  weaponLabel: '物品',
  viewOnGitHub: '在 GitHub 上查看源码',
  craftedBy: 'Crafted with ❤ by',
  craftedByPost: ',',
  poweredByLabel: 'Powered by',
  poweredByPost: '',

  colSelect: '选择',
  colEnchant: '附魔',
  colMaxLevel: '最高',
  conflicted: '[冲突]',

  colLevel: '等级',
  labelEdition: '游戏版本',
  javaEdition: 'Java 版',
  bedrockEdition: '基岩版',
  labelWeapon: '物品类型',
  labelPenalty: '初始惩罚值（已使用铁砧次数）',
  labelInitialEnchants: '物品已有的附魔（可选）',
  nextStep: '下一步',

  labelAlgorithm: '计算算法',
  difficultyFirst: '难度优先 (DifficultyFirst)',
  hamming: '汉明算法 (Hamming)',
  labelOptions: '选项',
  ignorePenaltyLabel: '忽略累计惩罚',
  labelTargetEnchants: '目标附魔',
  colTargetLevel: '目标等级',
  prevStep: '上一步',
  calculate: '计算最优顺序',

  enchantSteps: (count) => `附魔步骤（共 ${count} 步）`,
  tooExpensive: '过于昂贵！',
  tooExpensiveDesc: '部分步骤的经验花费超过了39级，铁砧将无法完成这些操作。请尝试调整附魔组合或减少累计惩罚次数。',
  step: (n) => `第 ${n} 步`,
  costLabel: '花费:',
  levelUnit: '级经验',
  tooExpensiveTag: '过于昂贵!',
  targetLabel: '目标（铁砧左侧）',
  sacrificeLabel: '牺牲品（铁砧右侧）',
  resultLabel: '结果',
  enchantedBook: '附魔书',
  itemLabel: '物品',
  penaltyValue: '累计惩罚:',
  noSteps: '没有需要附魔的步骤。',
  totalCost: '总经验消耗:',
  versionLabel: '版本:',
  algorithmLabel: '算法:',
  calcTimeLabel: '计算用时:',
  resetStep: '重新开始',
  javaEditionShort: 'Java 版',
  bedrockEditionShort: '基岩版',
};

const en: Translations = {
  appTitle: 'MC Optimal Enchanting Order Calculator',
  footerText: 'MC Optimal Enchanting Order Calculator',
  step1Title: 'Select Item',
  step1Desc: 'Select edition, item, and initial enchantments',
  step2Title: 'Target Enchantments',
  step2Desc: 'Select algorithm and target enchantments',
  step3Title: 'Results',
  step3Desc: 'View optimal enchanting order',
  weaponLabel: 'Item',
  viewOnGitHub: 'View source on GitHub',
  craftedBy: 'Crafted with ❤ by',
  craftedByPost: ',',
  poweredByLabel: 'Powered by',
  poweredByPost: '',

  colSelect: 'Select',
  colEnchant: 'Enchantment',
  colMaxLevel: 'Max',
  conflicted: '[Conflict]',

  colLevel: 'Level',
  labelEdition: 'Minecraft Edition',
  javaEdition: 'Java Edition',
  bedrockEdition: 'Bedrock Edition',
  labelWeapon: 'Item Type',
  labelPenalty: 'Prior Work',
  labelInitialEnchants: 'Existing Enchantments on Item (Optional)',
  nextStep: 'Next',

  labelAlgorithm: 'Algorithm',
  difficultyFirst: 'Difficulty First',
  hamming: 'Hamming',
  labelOptions: 'Options',
  ignorePenaltyLabel: 'Ignore Prior Work',
  labelTargetEnchants: 'Target Enchantments',
  colTargetLevel: 'Target Level',
  prevStep: 'Back',
  calculate: 'Calculate Optimal Order',

  enchantSteps: (count) => `Enchanting Steps (${count} total)`,
  tooExpensive: 'Too Expensive!',
  tooExpensiveDesc: 'Some steps exceed 39 XP levels. The anvil cannot complete these operations. Try adjusting enchantment combinations or reducing the prior work.',
  step: (n) => `Step ${n}`,
  costLabel: 'Cost:',
  levelUnit: 'levels',
  tooExpensiveTag: 'Too Expensive!',
  targetLabel: 'Target (Anvil Left)',
  sacrificeLabel: 'Sacrifice (Anvil Right)',
  resultLabel: 'Result',
  enchantedBook: 'Enchanted Book',
  itemLabel: 'Item',
  penaltyValue: 'Prior Work:',
  noSteps: 'No enchanting steps needed.',
  totalCost: 'Total XP Cost:',
  versionLabel: 'Edition:',
  algorithmLabel: 'Algorithm:',
  calcTimeLabel: 'Calculation time:',
  resetStep: 'Start Over',
  javaEditionShort: 'Java Edition',
  bedrockEditionShort: 'Bedrock Edition',
};

export const translations: Record<Locale, Translations> = { zh, en };
