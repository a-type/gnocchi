/** @generated - do not modify this file. */

// src/client/schemaVersions/v6.ts
import { collection, schema } from "@verdant-web/store";
import cuid from "cuid";
var categories = collection({
  name: "category",
  pluralName: "categories",
  primaryKey: "id",
  fields: {
    id: {
      type: "string",
      default: () => cuid()
    },
    name: {
      type: "string"
    },
    sortKey: {
      type: "string",
      indexed: true,
      default: "a0"
    }
  }
});
var foodCategoryAssignments = collection({
  name: "foodCategoryAssignment",
  primaryKey: "id",
  fields: {
    id: {
      type: "string",
      default: () => cuid()
    },
    foodName: {
      type: "string",
      indexed: true
    },
    categoryId: {
      type: "string",
      indexed: true
    },
    remote: {
      type: "boolean"
    }
  }
});
var items = collection({
  name: "item",
  primaryKey: "id",
  fields: {
    id: {
      type: "string",
      default: () => cuid()
    },
    categoryId: {
      type: "string",
      indexed: true,
      nullable: true
    },
    createdAt: {
      type: "number",
      default: () => Date.now()
    },
    totalQuantity: {
      type: "number"
    },
    purchasedQuantity: {
      type: "number",
      default: 0
    },
    unit: {
      type: "string"
    },
    food: {
      type: "string",
      indexed: true
    },
    sortKey: {
      type: "string"
    },
    inputs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: {
            type: "string"
          },
          url: {
            type: "string",
            nullable: true
          },
          title: {
            type: "string",
            nullable: true
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
var v6_default = schema({
  version: 6,
  collections: {
    categories,
    items,
    foodCategoryAssignments
  }
});
export {
  v6_default as default
};
