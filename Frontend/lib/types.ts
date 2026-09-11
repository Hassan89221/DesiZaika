export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'extra-hot';

export type MenuCategory =
  | 'starters'
  | 'main-courses'
  | 'biryani-rice'
  | 'breads'
  | 'desserts'
  | 'drinks';

export type Allergen =
  | 'dairy'
  | 'gluten'
  | 'nuts'
  | 'soy'
  | 'eggs'
  | 'shellfish';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  spiceLevel: SpiceLevel;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  allergens: Allergen[];
  prepTime: string;
  calories: number;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  hours: {
    day: string;
    open: string;
    close: string;
    closed?: boolean;
  }[];
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  deliveryFee: number;
  minOrder: number;
  estimatedDeliveryTime: string;
}

export interface CategoryInfo {
  id: MenuCategory;
  label: string;
  icon: string;
  description: string;
}
