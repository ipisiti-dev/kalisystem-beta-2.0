// CATEGORY_GROUPS and GROUP_HIERARCHY moved here for reuse

export const CATEGORY_GROUPS = {
  Fresh: ['Cheese', 'Cream', 'Egg', 'Butter', 'Fish', 'Seafood', 'Veg', 'Fruits', 'Herbs (fresh)'],
  Frozen: ['French fries', 'Beef', 'Pork', 'Chicken', 'Butter'],
  Dry: ['Noodles', 'Baking', 'Can', 'Herbs & spices', 'Desserts'],
  'Soft drinks': ['Sodas', 'Juices', 'Water'],
  'Tea coffee milk': ['Coffee', 'Milk', 'Tea'],
  Alcohol: ['Spirits', 'Cig', 'Beers', 'Wines'],
  Cleaning: ['Cleaning', 'Cleaning for kitchen', 'Kitchen roll'],
  'Packing out': ['Box', 'Cup', 'Ustensils', 'Plastic bags', 'Kitchen roll'],
  Misc: ['Office'],
};

export const GROUP_HIERARCHY = {
  Food: ['Fresh', 'Frozen', 'Dry'],
  Beverages: ['Soft drinks', 'Tea coffee milk', 'Alcohol'],
  Households: ['Cleaning', 'Packing out', 'Misc'],
};
