// SIGNED-SOURCE: <e2c4214d01951b0653392454e7d0e422>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */

// @ts-ignore
import * as path from "path";
// @ts-ignore
import * as fs from "fs";

// @ts-ignore
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [
  GroceryCategory,
  GroceryFoodCategoryLookup,
  GroceryInput,
  GroceryItem,
  GroceryList,
] = await Promise.all([
  fs.promises.readFile(path.join(__dirname, "GroceryCategory.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(
    path.join(__dirname, "GroceryFoodCategoryLookup.sqlite.sql"),
    { encoding: "utf8" }
  ),
  fs.promises.readFile(path.join(__dirname, "GroceryInput.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "GroceryItem.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "GroceryList.sqlite.sql"), {
    encoding: "utf8",
  }),
]);

export default {
  sqlite: {
    undefined: {
      GroceryCategory,
      GroceryFoodCategoryLookup,
      GroceryInput,
      GroceryItem,
      GroceryList,
    },
  },
};
