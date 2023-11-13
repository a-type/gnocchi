/** @generated - do not modify this file. */

// src/client/schemaVersions/v39.ts
import { collection, schema } from "@verdant-web/store";
import cuid from "cuid";
import { removeStopwords } from "stopword";
function fullTextIndex(str) {
  return removeStopwords(str.split(/\s+/)).map((s) => s.toLowerCase());
}
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
    },
    /**
     * An estimate of how long items in this category
     * take to expire. If not specified, items will not
     * auto-expire.
     */
    expirationDays: {
      type: "number",
      nullable: true
    },
    /**
     * Users can claim a category to be responsible for
     * it. This is a reference to the user who claimed
     * it by their ID. Claims expire after 24 hours.
     */
    claim: {
      type: "object",
      nullable: true,
      properties: {
        claimedBy: {
          type: "string"
        },
        claimedAt: {
          type: "number"
        }
      }
    }
  }
});
var foods = collection({
  name: "food",
  primaryKey: "canonicalName",
  fields: {
    canonicalName: {
      type: "string"
    },
    alternateNames: {
      type: "array",
      items: {
        type: "string"
      }
    },
    categoryId: {
      type: "string",
      indexed: true,
      nullable: true
    },
    expiresAfterDays: {
      type: "number",
      nullable: true
    },
    lastPurchasedAt: {
      type: "number",
      nullable: true
    },
    inInventory: {
      type: "boolean",
      default: false
    },
    /**
     * This can be, and is, set in the future at the time of purchase
     * based on expiration.
     */
    expiresAt: {
      type: "number",
      nullable: true
    },
    purchaseIntervalGuess: {
      type: "number",
      nullable: true
    },
    lastAddedAt: {
      type: "number",
      nullable: true
    },
    purchaseCount: {
      type: "number",
      default: 0
    },
    defaultListId: {
      type: "string",
      nullable: true
    },
    pluralizeName: {
      type: "boolean",
      default: false
    },
    doNotSuggest: {
      type: "boolean",
      default: false
    }
  },
  synthetics: {
    nameLookup: {
      type: "string[]",
      compute: (food) => Array.from(
        new Set(
          [food.canonicalName, ...food.alternateNames].map(fullTextIndex)
        )
      ).flat()
    },
    anyName: {
      type: "string[]",
      compute: (food) => [food.canonicalName, ...food.alternateNames]
    },
    repurchaseAfter: {
      type: "number",
      compute: (food) => {
        if (!food.lastPurchasedAt || !food.purchaseIntervalGuess || food.purchaseCount < 4)
          return Number.MAX_SAFE_INTEGER;
        const lastAdded = food.lastAddedAt || 0;
        return Math.max(food.lastPurchasedAt, lastAdded) + food.purchaseIntervalGuess;
      }
    },
    purchasedAndExpiresAt: {
      type: "number",
      compute: (food) => {
        if (!food.lastPurchasedAt)
          return Number.MAX_SAFE_INTEGER;
        return food.expiresAt || Number.MAX_SAFE_INTEGER;
      }
    },
    // if no purchased time is recorded, sorts to the bottom instead
    // of the top.
    lastPurchasedAtOrZero: {
      type: "number",
      compute: (food) => {
        return food.lastPurchasedAt || 0;
      }
    }
  },
  compounds: {
    // allows showing recently purchased items in pages under category sections
    // on the purchased page.
    categoryId_lastPurchasedAt: {
      of: ["categoryId", "lastPurchasedAtOrZero"]
    },
    inInventory_categoryId_lastPurchasedAt: {
      of: ["inInventory", "categoryId", "lastPurchasedAtOrZero"]
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
    unit: {
      type: "string"
    },
    food: {
      type: "string",
      indexed: true
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
          },
          multiplier: {
            type: "number",
            nullable: true
          },
          recipeId: {
            type: "string",
            nullable: true
          },
          quantity: {
            type: "number",
            nullable: true
          }
        }
      }
    },
    /**
     * Mark this when the item is purchased. It moves to the pantry.
     */
    purchasedAt: {
      type: "number",
      nullable: true,
      indexed: true
    },
    /**
     * If assigned to a list, this ID will be
     */
    listId: {
      type: "string",
      nullable: true
    },
    /**
     * Shows up below the item, useful for reminders or notes
     * about a brand, etc.
     */
    comment: {
      type: "string",
      nullable: true
    },
    /**
     * If set, this will be used instead of the food's name
     * or input text.
     */
    textOverride: {
      type: "string",
      nullable: true
    }
  },
  synthetics: {
    purchased: {
      type: "string",
      compute: (doc) => !!doc.purchasedAt ? "yes" : "no"
    },
    listId: {
      type: "string",
      compute: (doc) => doc.listId
    }
  },
  compounds: {
    // used when adding items to find items with the same food
    // and list that aren't purchased, and if so, add the quantity
    // instead of creating a new item.
    purchased_food_listId: {
      of: ["purchased", "food", "listId"]
    }
  }
});
var lists = collection({
  name: "list",
  primaryKey: "id",
  fields: {
    id: {
      type: "string",
      default: () => cuid()
    },
    name: {
      type: "string"
    },
    color: {
      type: "string"
    }
  }
});
var collaborationInfo = collection({
  name: "collaborationInfo",
  pluralName: "collaborationInfo",
  primaryKey: "id",
  fields: {
    id: {
      type: "string",
      default: "default"
    },
    meetup: {
      type: "object",
      nullable: true,
      properties: {
        createdAt: {
          type: "number",
          default: () => Date.now()
        },
        location: {
          type: "string"
        }
      }
    }
  }
});
var recipes = collection({
  name: "recipe",
  primaryKey: "id",
  fields: {
    id: {
      type: "string",
      default: () => cuid()
    },
    slug: {
      type: "string",
      indexed: true,
      default: () => cuid.slug()
    },
    multiplier: {
      type: "number",
      default: 1
    },
    title: {
      type: "string",
      default: "New Recipe"
    },
    createdAt: {
      type: "number",
      default: () => Date.now()
    },
    updatedAt: {
      type: "number",
      default: () => Date.now(),
      indexed: true
    },
    prepTimeMinutes: {
      type: "number",
      nullable: true
    },
    cookTimeMinutes: {
      type: "number",
      nullable: true
    },
    totalTimeMinutes: {
      type: "number",
      nullable: true
    },
    servings: {
      type: "number",
      nullable: true
    },
    prelude: {
      type: "any",
      default: {
        type: "doc",
        content: []
      }
    },
    note: {
      type: "string",
      nullable: true
    },
    ingredients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            default: () => cuid()
          },
          text: {
            type: "string"
          },
          unit: {
            type: "string",
            nullable: true
          },
          food: {
            type: "string",
            nullable: true
          },
          quantity: {
            type: "number",
            default: 1
          },
          comments: {
            type: "array",
            items: {
              type: "string"
            }
          },
          note: {
            type: "string",
            nullable: true
          },
          isSectionHeader: {
            type: "boolean",
            default: false
          }
        }
      }
    },
    instructions: {
      type: "any",
      default: {
        type: "doc",
        content: []
      }
      /**
       * Potential instructions schema
       * for ProseMirror
      type: 'object',
      properties: {
      	type: {
      		type: 'string',
      		default: 'doc',
      	},
      	content: {
      		type: 'array',
      		items: {
      			type: 'object',
      			properties: {
      				type: {
      					type: 'string',
      				},
      				content: {
      					type: 'any',
      				},
      				attrs: {
      					type: 'map',
      					values: {
      						type: 'string'
      					}
      				}
      			},
      		},
      	}
      }
       */
    },
    url: {
      type: "string",
      nullable: true
    },
    session: {
      type: "object",
      nullable: true,
      properties: {
        startedAt: {
          type: "number",
          default: () => Date.now()
        },
        completedInstructions: {
          type: "array",
          items: {
            type: "string"
          }
        },
        completedIngredients: {
          type: "array",
          items: {
            type: "string"
          }
        },
        instructionAssignments: {
          type: "map",
          values: {
            type: "string"
          }
        },
        ingredientAssignments: {
          type: "map",
          values: {
            type: "string"
          }
        }
      }
    },
    /**
     * String literal tags. Recipes can be filtered by tags.
     * Before assigning, tags should always be made lowercase.
     */
    tags: {
      type: "array",
      items: {
        type: "string"
      }
    },
    mainImage: {
      type: "file",
      nullable: true
    },
    cookCount: {
      type: "number",
      default: 0
    },
    lastCookedAt: {
      type: "number",
      nullable: true
    },
    lastAddedAt: {
      type: "number",
      nullable: true
    },
    addIntervalGuess: {
      type: "number",
      nullable: true
    },
    pinnedAt: {
      type: "number",
      nullable: true,
      indexed: true
    }
  },
  synthetics: {
    // makes tags indexable individually
    tag: {
      type: "string[]",
      compute: (recipe) => {
        return recipe.tags;
      }
    },
    // similar algorithm to food recommendation engine,
    // but only tracking adding to shopping list
    suggestAfter: {
      type: "number",
      compute: (recipe) => {
        if (!recipe.lastAddedAt || !recipe.addIntervalGuess || recipe.cookCount < 2)
          return Number.MAX_SAFE_INTEGER;
        return recipe.lastAddedAt + recipe.addIntervalGuess;
      }
    },
    food: {
      type: "string[]",
      compute: (recipe) => {
        return recipe.ingredients.map((i) => i.food).filter((f) => !!f).map((f) => f.toLowerCase());
      }
    },
    titleMatch: {
      type: "string[]",
      compute: (recipe) => fullTextIndex(recipe.title)
    },
    sessionStartedAt: {
      type: "number",
      compute: (recipe) => {
        return recipe.session?.startedAt || 0;
      }
    }
  }
});
var recipeTagMetadata = collection({
  name: "recipeTagMetadata",
  primaryKey: "name",
  pluralName: "recipeTagMetadata",
  fields: {
    name: {
      type: "string"
    },
    color: {
      type: "string",
      nullable: true
    },
    icon: {
      type: "string",
      nullable: true
    }
  }
});
var v39_default = schema({
  version: 39,
  collections: {
    categories,
    items,
    foods,
    lists,
    collaborationInfo,
    recipes,
    recipeTagMetadata
  }
});
export {
  v39_default as default
};
