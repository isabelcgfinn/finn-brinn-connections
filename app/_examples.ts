import { Category } from "./_types";

// `level` only sets the colour of a solved group (see getWordColor in
// _utils.ts): 1 red, 2 purple, 3 orange, 4 pink. The game has no notion of
// difficulty, so the Hard/Medium/Easy labels are recorded here as comments.
export const categories: Category[] = [
  {
    // Hard · Purple
    category: "STREETS WE'VE CALLED HOME, MINUS THE SUFFIX",
    items: ["DARTMOUTH PARK", "AVENUE", "SHEFFIELD", "MOUNT VIEW"],
    level: 2,
  },
  {
    // Medium · Red
    category: "IMPERIAL UNITS",
    items: ["PINT", "POUND", "ACRE", "YARD"],
    level: 1,
  },
  {
    // Easy · Orange
    category: "OUR BIG TRIPS",
    items: ["VIETNAM", "UTAH", "KENYA", "MOROCCO"],
    level: 3,
  },
  {
    // Easy · Pink
    category: "OUR SPORTING ALLEGIANCES",
    items: ["WALES", "SWANSEA", "ARSENAL", "TEAM GB"],
    level: 4,
  },
];
