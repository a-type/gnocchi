/** @generated - do not modify this file. */

// src/client/schemaVersions/v3.ts
import { collection, schema } from "@verdant-web/store";
var categoryCollection = collection({
  name: "categories",
  primaryKey: "id",
  fields: {
    id: {
      type: "string",
      indexed: true,
      unique: true
    },
    name: {
      type: "string",
      indexed: false,
      unique: false
    }
  },
  synthetics: {},
  compounds: {}
});
var foodCategoryAssignment = collection({
  name: "foodCategoryAssignments",
  primaryKey: "id",
  fields: {
    id: {
      type: "string",
      indexed: true,
      unique: true
    },
    foodName: {
      type: "string",
      indexed: true,
      unique: false
    },
    categoryId: {
      type: "string",
      indexed: true,
      unique: false
    },
    remote: {
      type: "boolean"
    }
  },
  synthetics: {},
  compounds: {}
});
var itemCollection = collection({
  name: "items",
  primaryKey: "id",
  fields: {
    id: {
      type: "string",
      indexed: true,
      unique: true
    },
    categoryId: {
      type: "string",
      indexed: true,
      unique: false
    },
    createdAt: {
      type: "number",
      indexed: false,
      unique: false
    },
    totalQuantity: {
      type: "number",
      indexed: false,
      unique: false
    },
    purchasedQuantity: {
      type: "number",
      indexed: false,
      unique: false
    },
    unit: {
      type: "string",
      indexed: false,
      unique: false
    },
    food: {
      type: "string",
      indexed: true,
      unique: false
    },
    sortKey: {
      type: "string",
      indexed: false,
      unique: false
    },
    inputs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: {
            type: "string"
          }
        }
      }
    }
  },
  synthetics: {
    purchased: {
      type: "string",
      compute: (doc) => doc.totalQuantity > 0 && doc.purchasedQuantity >= doc.totalQuantity ? "yes" : "no"
    }
  },
  compounds: {
    categoryId_sortKey: {
      of: ["categoryId", "sortKey"]
    }
  }
});
var v3_default = schema({
  version: 3,
  collections: {
    categories: categoryCollection,
    items: itemCollection,
    foodCategoryAssignments: foodCategoryAssignment
  }
});
export {
  categoryCollection,
  v3_default as default,
  foodCategoryAssignment,
  itemCollection
};
