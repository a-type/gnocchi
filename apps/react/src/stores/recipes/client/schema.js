import { schema, collection } from '@lo-fi/web';
import cuid from 'cuid';
const collections = collection({
    name: 'collection',
    primaryKey: 'id',
    fields: {
        id: {
            type: 'string',
            default: ()=>cuid()
        },
        name: {
            type: 'string'
        }
    }
});
const recipes = collection({
    name: 'recipe',
    primaryKey: 'id',
    fields: {
        id: {
            type: 'string',
            default: ()=>cuid()
        },
        collectionId: {
            type: 'string',
            indexed: true,
            nullable: true
        },
        slug: {
            type: 'string',
            indexed: true,
            default: ()=>cuid().slice(0, 8)
        },
        multiplier: {
            type: 'number',
            default: 1
        },
        title: {
            type: 'string',
            default: 'New Recipe'
        },
        createdAt: {
            type: 'number',
            default: ()=>Date.now()
        },
        updatedAt: {
            type: 'number',
            default: ()=>Date.now(),
            indexed: true
        },
        ingredients: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        default: ()=>cuid()
                    },
                    text: {
                        type: 'string'
                    },
                    unit: {
                        type: 'string',
                        nullable: true
                    },
                    food: {
                        type: 'string'
                    },
                    quantity: {
                        type: 'number',
                        default: 1
                    },
                    comments: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        instructions: {
            type: 'any',
            default: {
                type: 'doc',
                content: []
            }
        },
        url: {
            type: 'string',
            nullable: true
        },
        session: {
            type: 'object',
            nullable: true,
            properties: {
                startedAt: {
                    type: 'number',
                    default: ()=>Date.now()
                },
                completedInstructions: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                completedIngredients: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                instructionAssignments: {
                    type: 'map',
                    values: {
                        type: 'string'
                    }
                },
                ingredientAssignments: {
                    type: 'map',
                    values: {
                        type: 'string'
                    }
                }
            }
        }
    }
});
export default schema({
    version: 7,
    collections: {
        recipes,
        collections
    }
});
