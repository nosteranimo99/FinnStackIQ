import type {
  Accessory,
  Avatar,
  Hair,
  HairColor,
  ItemCategory,
  ItemId,
  JobId,
  MissionId,
  Outfit,
  RedFlagId,
  Shoes,
  Skin,
  ZoneId,
} from "./types";

export const STARTING_UPS = 20;

// ---------- Missions ----------

export interface MissionDef {
  id: MissionId;
  world: "hustle" | "scamaland";
  number: number;
  title: string;
  tagline: string;
}

export const MISSIONS: MissionDef[] = [
  { id: "find-a-hustle", world: "hustle", number: 1, title: "Find a Hustle", tagline: "Make your Muv. Earn your first UP$." },
  { id: "make-your-move", world: "hustle", number: 2, title: "Make Your Move", tagline: "You've got cash. What's the play?" },
  { id: "block-needs-you", world: "hustle", number: 3, title: "The Block Needs You", tagline: "The court is busted. You could change that." },
  { id: "your-next-move", world: "hustle", number: 4, title: "Your Next Move", tagline: "Your goal. Your money. Your block." },
  { id: "too-good-to-be-true", world: "scamaland", number: 1, title: "Too Good to Be True", tagline: "Someone says you can make $500 today." },
  { id: "shark-bank", world: "scamaland", number: 2, title: "The Shark Bank", tagline: "\"Need $100? Easy!\"" },
  { id: "get-out", world: "scamaland", number: 3, title: "Get Out", tagline: "Something went wrong. Get out clean." },
];

export const missionById = (id: MissionId) => MISSIONS.find((m) => m.id === id)!;

// ---------- Jobs ----------

export interface JobDef {
  id: JobId;
  name: string;
  reward: number;
  effort: "Low" | "Medium" | "High";
  time: string;
  pitch: string;
  icon: string;
}

export const JOBS: Record<JobId, JobDef> = {
  delivery: {
    id: "delivery",
    name: "Delivery Run",
    reward: 8,
    effort: "Low",
    time: "Quick",
    pitch: "Grab a package, run it across the block, drop it off.",
    icon: "📦",
  },
  shop: {
    id: "shop",
    name: "Shop Assist",
    reward: 12,
    effort: "Medium",
    time: "Medium",
    pitch: "Stock the Corner Shop shelves. Everything in its place.",
    icon: "🛒",
  },
  flyer: {
    id: "flyer",
    name: "Flyer Run",
    reward: 15,
    effort: "High",
    time: "Long",
    pitch: "Hit every door on the block with a flyer for the Hub.",
    icon: "📰",
  },
  ref: {
    id: "ref",
    name: "Ref the Pickup Game",
    reward: 10,
    effort: "Medium",
    time: "Medium",
    pitch: "The court is back. Keep score for the pickup game.",
    icon: "🏀",
  },
  sweep: {
    id: "sweep",
    name: "Court Cleanup",
    reward: 6,
    effort: "Low",
    time: "Quick",
    pitch: "Clean up the Block Court. Dee chips in a few UP$.",
    icon: "🧹",
  },
};

export const BIKE_PRICE = 20;
export const SNEAKER_PRICE = 30;
export const SNACK_PACK_PRICE = 8;
export const RETURN_FEE = 4;
export const COURT_CONTRIBUTION = 10;
export const HEADPHONES_PRICE = 25;
export const MURAL_PRICE = 10;
export const PAYDAY = 10;

// ---------- Zones ----------

export interface ZoneDef {
  id: ZoneId;
  name: string;
  theme: string;
  color: string;
  icon: string;
}

export const ZONES: ZoneDef[] = [
  { id: "hustle-block", name: "Hustle Block", theme: "EARN", color: "#b8ff3c", icon: "💸" },
  { id: "the-jar", name: "The Jar", theme: "SAVE", color: "#5ee7ff", icon: "🫙" },
  { id: "market-tower", name: "Market Tower", theme: "INVEST", color: "#ffd23f", icon: "📈" },
  { id: "founders-lab", name: "Founder's Lab", theme: "BUILD", color: "#ff8a3d", icon: "🛠️" },
  { id: "city-hall", name: "City Hall", theme: "LEAD", color: "#a58bff", icon: "🏛️" },
  { id: "boardroom", name: "Boardroom", theme: "CAREERS", color: "#7cc4ff", icon: "💼" },
  { id: "the-tank", name: "The Tank", theme: "PITCH", color: "#ff5fa2", icon: "🦈" },
  { id: "ripple-center", name: "Ripple Center", theme: "GIVE BACK", color: "#3ce0b0", icon: "🌊" },
];

// ---------- Scamaland ----------

export interface RedFlagDef {
  id: RedFlagId;
  name: string;
  tell: string;
}

export const RED_FLAGS: Record<RedFlagId, RedFlagDef> = {
  guaranteed: { id: "guaranteed", name: "Guaranteed returns", tell: "Nobody can promise money with zero risk." },
  pressure: { id: "pressure", name: "Pressure to act", tell: "Rushing you so you don't stop and think." },
  upfront: { id: "upfront", name: "Upfront payment", tell: "You pay first. The money never comes." },
  secrecy: { id: "secrecy", name: "Secrecy", tell: "Real opportunities don't need to be secret." },
  "fake-authority": { id: "fake-authority", name: "Fake authority", tell: "A title or badge doesn't make it legit." },
  links: { id: "links", name: "Suspicious links", tell: "Weird links can steal info or install junk." },
  "personal-info": { id: "personal-info", name: "Requests for personal info", tell: "Your info is worth money to scammers." },
};

export const RED_FLAG_ORDER: RedFlagId[] = [
  "guaranteed",
  "pressure",
  "upfront",
  "secrecy",
  "fake-authority",
  "links",
  "personal-info",
];

// ---------- Items ----------

export interface ItemDef {
  id: ItemId;
  name: string;
  category: ItemCategory;
  icon: string;
  how: string;
  equip?: { slot: "shoes"; value: Shoes } | { slot: "accessory"; value: Accessory };
}

export const ITEMS: Record<ItemId, ItemDef> = {
  "drop-sneakers": {
    id: "drop-sneakers",
    name: "Fresh Drop Sneakers",
    category: "sneakers",
    icon: "👟",
    how: "Bought at the Corner Shop",
    equip: { slot: "shoes", value: "drop-sneakers" },
  },
  "hustle-runners": {
    id: "hustle-runners",
    name: "Hustle Runners",
    category: "sneakers",
    icon: "⚡",
    how: "Earned by finishing your first hustles",
    equip: { slot: "shoes", value: "hustle-runners" },
  },
  "studio-headphones": {
    id: "studio-headphones",
    name: "Studio Headphones",
    category: "headphones",
    icon: "🎧",
    how: "Your Next Move: funded your personal goal",
    equip: { slot: "accessory", value: "headphones" },
  },
  "block-pack": {
    id: "block-pack",
    name: "Block Legend Backpack",
    category: "backpacks",
    icon: "🎒",
    how: "Completed Hustle Block",
    equip: { slot: "accessory", value: "backpack" },
  },
  "court-lights": {
    id: "court-lights",
    name: "Court Lights",
    category: "neighborhood",
    icon: "💡",
    how: "You helped restore the Block Court",
  },
  "block-mural": {
    id: "block-mural",
    name: "Block Mural",
    category: "neighborhood",
    icon: "🎨",
    how: "You chipped in for the mural",
  },
  "badge-first-hustle": { id: "badge-first-hustle", name: "First Hustle", category: "badges", icon: "🥇", how: "Finished Mission 1" },
  "badge-comeback": { id: "badge-comeback", name: "Comeback", category: "badges", icon: "🔁", how: "Recovered from a DOWN$" },
  "badge-ripple-maker": { id: "badge-ripple-maker", name: "Ripple Maker", category: "badges", icon: "🌊", how: "Changed the neighborhood" },
  "badge-made-movz": { id: "badge-made-movz", name: "Made Movz", category: "badges", icon: "🏆", how: "Completed Hustle Block" },
  "badge-scam-spotter": { id: "badge-scam-spotter", name: "Scam Spotter", category: "badges", icon: "🚩", how: "Too Good to Be True" },
  "badge-shark-proof": { id: "badge-shark-proof", name: "Shark Proof", category: "badges", icon: "🦈", how: "Read the Shark Bank fine print" },
  "badge-got-out": { id: "badge-got-out", name: "Got Out", category: "badges", icon: "🛡️", how: "Completed Scamaland" },
};

export const COLLECTION_CATEGORIES: { id: ItemCategory; label: string }[] = [
  { id: "sneakers", label: "Sneakers" },
  { id: "headphones", label: "Headphones" },
  { id: "backpacks", label: "Backpacks" },
  { id: "neighborhood", label: "Neighborhood" },
  { id: "badges", label: "Badges" },
];

// ---------- Avatar options ----------

export const SKIN_TONES: Record<Skin, string> = {
  s1: "#f6d3b8",
  s2: "#e8b48f",
  s3: "#c98c5f",
  s4: "#a5693f",
  s5: "#7b4a2a",
  s6: "#4e2d1a",
};

export const HAIR_COLORS: Record<HairColor, string> = {
  black: "#1b1b22",
  brown: "#5a3622",
  blonde: "#e7c26b",
  auburn: "#9c3d1f",
  blue: "#3a7bff",
  pink: "#ff5fa2",
};

export const HAIRSTYLES: { id: Hair; label: string }[] = [
  { id: "fade", label: "Fade" },
  { id: "puffs", label: "Puffs" },
  { id: "braids", label: "Braids" },
  { id: "curls", label: "Curls" },
  { id: "bun", label: "Bun" },
  { id: "locs", label: "Locs" },
];

export const OUTFITS: { id: Outfit; label: string }[] = [
  { id: "hoodie", label: "Hoodie" },
  { id: "jersey", label: "Jersey" },
  { id: "jacket", label: "Jacket" },
  { id: "tee", label: "Tee" },
];

export const OUTFIT_COLORS = ["#b8ff3c", "#5ee7ff", "#ff5fa2", "#ffd23f", "#a58bff", "#ff8a3d", "#f4f4f8", "#24243a"];

export const SHOE_OPTIONS: { id: Shoes; label: string; requires?: ItemId }[] = [
  { id: "hightops", label: "High-Tops" },
  { id: "runners", label: "Runners" },
  { id: "slides", label: "Slides" },
  { id: "hustle-runners", label: "Hustle Runners", requires: "hustle-runners" },
  { id: "drop-sneakers", label: "Fresh Drops", requires: "drop-sneakers" },
];

export const ACCESSORY_OPTIONS: { id: Accessory; label: string; requires?: ItemId }[] = [
  { id: "none", label: "None" },
  { id: "cap", label: "Cap" },
  { id: "glasses", label: "Glasses" },
  { id: "beanie", label: "Beanie" },
  { id: "headphones", label: "Headphones", requires: "studio-headphones" },
  { id: "backpack", label: "Backpack", requires: "block-pack" },
];

export const DEFAULT_AVATAR: Avatar = {
  name: "",
  skin: "s3",
  hair: "puffs",
  hairColor: "black",
  outfit: "hoodie",
  outfitColor: "#b8ff3c",
  shoes: "hightops",
  accessory: "none",
};

// ---------- Cast ----------
// NPCs reuse the avatar renderer with fixed looks so the whole cast shares one visual system.

export interface CharacterDef {
  name: string;
  role: string;
  look: Avatar;
  world: "block" | "scamaland";
}

export const CAST = {
  benny: {
    name: "Benny",
    role: "Neighborhood Guide",
    world: "block",
    look: { name: "Benny", skin: "s4", hair: "fade", hairColor: "black", outfit: "jacket", outfitColor: "#ffd23f", shoes: "hightops", accessory: "cap" },
  },
  penny: {
    name: "Penny",
    role: "Benny's counterpart",
    world: "block",
    look: { name: "Penny", skin: "s2", hair: "bun", hairColor: "auburn", outfit: "hoodie", outfitColor: "#a58bff", shoes: "runners", accessory: "glasses" },
  },
  dee: {
    name: "Dee",
    role: "Runs the Hustle Hub",
    world: "block",
    look: { name: "Dee", skin: "s5", hair: "locs", hairColor: "black", outfit: "tee", outfitColor: "#ff8a3d", shoes: "runners", accessory: "beanie" },
  },
  ray: {
    name: "Mr. Ray",
    role: "Corner Shop owner",
    world: "block",
    look: { name: "Mr. Ray", skin: "s3", hair: "fade", hairColor: "brown", outfit: "jacket", outfitColor: "#24243a", shoes: "slides", accessory: "glasses" },
  },
  vera: {
    name: "Vera",
    role: "Your Scamaland guide",
    world: "scamaland",
    look: { name: "Vera", skin: "s6", hair: "braids", hairColor: "blue", outfit: "jacket", outfitColor: "#5ee7ff", shoes: "hightops", accessory: "none" },
  },
  flexx: {
    name: "Flexx",
    role: "Influencer-style promoter",
    world: "scamaland",
    look: { name: "Flexx", skin: "s1", hair: "curls", hairColor: "blonde", outfit: "jersey", outfitColor: "#ff5fa2", shoes: "drop-sneakers", accessory: "glasses" },
  },
  sal: {
    name: "Sharky Sal",
    role: "Shark Bank lender",
    world: "scamaland",
    look: { name: "Sal", skin: "s2", hair: "fade", hairColor: "black", outfit: "jacket", outfitColor: "#3a3a5a", shoes: "slides", accessory: "glasses" },
  },
} satisfies Record<string, CharacterDef>;

export type CastId = keyof typeof CAST;

/** Block residents. They show up as the neighborhood improves. */
export const RESIDENTS: Avatar[] = [
  { name: "Ms. Lou", skin: "s5", hair: "curls", hairColor: "black", outfit: "jacket", outfitColor: "#ff5fa2", shoes: "slides", accessory: "glasses" },
  { name: "Tre", skin: "s4", hair: "braids", hairColor: "black", outfit: "jersey", outfitColor: "#5ee7ff", shoes: "hightops", accessory: "none" },
  { name: "Mia", skin: "s2", hair: "puffs", hairColor: "brown", outfit: "hoodie", outfitColor: "#ffd23f", shoes: "runners", accessory: "none" },
  { name: "Jojo", skin: "s1", hair: "bun", hairColor: "pink", outfit: "tee", outfitColor: "#3ce0b0", shoes: "runners", accessory: "cap" },
  { name: "Kai", skin: "s3", hair: "locs", hairColor: "brown", outfit: "hoodie", outfitColor: "#ff8a3d", shoes: "hightops", accessory: "beanie" },
];
