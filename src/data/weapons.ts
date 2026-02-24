export interface Weapon {
  id: string;
  nameZh: string;
  nameEn: string;
  index: number;
  icon: string;
}

export const WEAPONS: Weapon[] = [
  { id: 'sword', nameZh: '剑', nameEn: 'Sword', index: 0, icon: '/icons/netherite_sword.png' },
  { id: 'pickaxe', nameZh: '镐', nameEn: 'Pickaxe', index: 1, icon: '/icons/netherite_pickaxe.png' },
  { id: 'axe', nameZh: '斧', nameEn: 'Axe', index: 2, icon: '/icons/netherite_axe.png' },
  { id: 'shovel', nameZh: '铲', nameEn: 'Shovel', index: 3, icon: '/icons/netherite_shovel.png' },
  { id: 'hoe', nameZh: '锄', nameEn: 'Hoe', index: 4, icon: '/icons/netherite_hoe.png' },
  { id: 'helmet', nameZh: '头盔', nameEn: 'Helmet', index: 5, icon: '/icons/netherite_helmet.png' },
  { id: 'chestplate', nameZh: '胸甲', nameEn: 'Chestplate', index: 6, icon: '/icons/netherite_chestplate.png' },
  { id: 'leggings', nameZh: '护腿', nameEn: 'Leggings', index: 7, icon: '/icons/netherite_leggings.png' },
  { id: 'boots', nameZh: '靴', nameEn: 'Boots', index: 8, icon: '/icons/netherite_boots.png' },
  { id: 'bow', nameZh: '弓', nameEn: 'Bow', index: 9, icon: '/icons/bow.png' },
  { id: 'crossbow', nameZh: '弩', nameEn: 'Crossbow', index: 10, icon: '/icons/crossbow_standby.png' },
  { id: 'trident', nameZh: '三叉戟', nameEn: 'Trident', index: 11, icon: '/icons/trident.png' },
  { id: 'fishing_rod', nameZh: '钓鱼竿', nameEn: 'Fishing Rod', index: 12, icon: '/icons/fishing_rod.png' },
  { id: 'mace', nameZh: '重锤', nameEn: 'Mace', index: 13, icon: '/icons/mace.png' },
];

export const ENCHANTED_BOOK_ICON = '/icons/enchanted_book.png';
