/** @generated - do not modify this file. */

// src/client/schemaVersions/v23.ts
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
    isPerishable: {
      type: "boolean",
      // null means unknown
      nullable: true
    },
    isStaple: {
      type: "boolean"
    },
    expiresAfterDays: {
      type: "number",
      nullable: true
    }
  },
  synthetics: {
    nameLookup: {
      type: "string[]",
      compute: (food) => food.alternateNames
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
      nullable: true
    },
    /**
     * This can be, and is, set in the future at the time of purchase
     * based on category expiration settings.
     */
    expiredAt: {
      type: "number",
      nullable: true
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
    purchased_food_listId: {
      of: ["purchased", "food", "listId"]
    },
    purchased_listId: {
      of: ["purchased", "listId"]
    }
  }
});
var suggestions = collection({
  name: "suggestion",
  primaryKey: "text",
  fields: {
    text: {
      type: "string"
    },
    usageCount: {
      type: "number",
      default: 0,
      indexed: true
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
      default: () => cuid().slice(0, 8)
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
    prelude: {
      type: "any",
      default: {
        type: "doc",
        content: []
      }
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
            type: "string"
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
    }
  },
  synthetics: {
    // makes tags indexable individually
    tag: {
      type: "string[]",
      compute: (recipe) => {
        return recipe.tags;
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
var v23_default = schema({
  version: 23,
  collections: {
    categories,
    items,
    foods,
    suggestions,
    lists,
    collaborationInfo,
    recipes,
    recipeTagMetadata
  }
});
export {
  v23_default as default
};
