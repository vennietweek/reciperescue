const resolvers = {
    Query: {
        getUser: (parent, args, context, info) => {
            // Example: Fetch a user by ID from a database or other data source
            return database.getUserById(args.id);
        },
        getRecipe: (parent, args, context, info) => {
            return database.getRecipeById(args.id);
        },
        // ... other query resolvers
    },
    Mutation: {
        createUser: (parent, args, context, info) => {
            // Example: Add a new user to the database and return the created user
            return database.createUser(args);
        },
        createRecipe: (parent, args, context, info) => {
            return database.createRecipe(args);
        },
        // ... other mutation resolvers
    },
    
};

module.exports = resolvers;
