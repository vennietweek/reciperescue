
const { gql } = require('apollo-server-express');

const typeDefs = gql`

type User {
    id: ID!
    shoppingList: ShoppingList
}

type Recipe {
    id: ID!
    title: String!
    image: String
    ingredients: [Ingredient!]!
    ingredientAmounts: [String!]!
    isVegetarian: Boolean
    isVegan: Boolean
    isDairyFree: Boolean
    totalCookingTime: Int
    prepTime: Int
    cookingTime: Int
    calories: Int
    instructions: [String!]!
    tips: [String]
}

type Ingredient {
    id: ID!
    name: String!
    image: String
    nutrition: Nutrition
}

type Nutrition {
    calories: Int
    protein: Int
    fat: Int
    carbs: Int
}

type ShoppingList {
    id: ID!
    user: User!
    products: [Product!]!
    totalPrice: Int!
}

type Product {
    id: ID!
    name: String!
    image: String
    cost: Int!
}

type Query {
    # User queries
    getUser(id: ID!): User
    getUsers: [User!]!

    # Recipe queries
    getRecipe(id: ID!): Recipe
    getRecipesByUser(userId: ID!): [Recipe!]!
    getAllRecipes: [Recipe!]!

    # Ingredient queries
    getIngredient(id: ID!): Ingredient
    getAllIngredients: [Ingredient!]!

    # ShoppingList queries
    getShoppingList(userId: ID!): ShoppingList

    # Product queries
    getProduct(id: ID!): Product
    getAllProducts: [Product!]!
}

type Mutation {
    # User mutations
    createUser(username: String!, email: String!): User
    updateUser(id: ID!, username: String, email: String): User
    deleteUser(id: ID!): Boolean

    # Recipe mutations
    createRecipe(title: String!, ingredients: [ID!]!, userId: ID!): Recipe
    updateRecipe(id: ID!, title: String, ingredients: [ID!]): Recipe
    deleteRecipe(id: ID!): Boolean

    # Ingredient mutations
    createIngredient(name: String!, image: String, nutrition: NutritionInput): Ingredient
    updateIngredient(id: ID!, name: String, image: String, nutrition: NutritionInput): Ingredient
    deleteIngredient(id: ID!): Boolean

    # ShoppingList mutations
    createShoppingList(userId: ID!): ShoppingList
    addProductToShoppingList(shoppingListId: ID!, productId: ID!): ShoppingList
    removeProductFromShoppingList(shoppingListId: ID!, productId: ID!): Boolean
    deleteShoppingList(id: ID!): Boolean

    # Product mutations
    createProduct(name: String!, image: String, cost: Int!): Product
    updateProduct(id: ID!, name: String, image: String, cost: Int): Product
    deleteProduct(id: ID!): Boolean
}

input NutritionInput {
    calories: Int
    protein: Int
    fat: Int
    carbs: Int
}

`;

module.exports = typeDefs;

