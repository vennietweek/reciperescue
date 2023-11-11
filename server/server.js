const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const { ApolloServer } = require('apollo-server-express');
// const { GraphQLScalarType } = require('graphql');
// const resolvers = require('./graphql/resolvers.js');
// const { connectDB, db } = require('./db/connectDB.js');
// const typeDefs = require('./graphql/schema.js');
// const { MongoClient } = require('mongodb');
const axios = require('axios');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: "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",
});

// const mongoURI = 'mongodb://localhost:27017/recipeRescue';
// const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect();
// console.log('Connected to MongoDB at', mongoURI);
// const db = client.db('recipeRescue')

// const newRecipe = new recipe({
//     id: r.id,
//     name: r.title,
//     image: r.image,
//       servings: r.servings,
//       readyInMinutes: r.readyInMinutes,
//       analyzedInstructions: r.analyzedInstructions,
//       extendedIngredients: r.extendedIngredients,
//   });

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const IngredientSchema = new mongoose.Schema({
  dbingredient: String,
  price: String,
  quantity: String,
  image: String,
});

const Item = mongoose.model('shoppinglist', IngredientSchema);

app.post('/api/ingredients', async (req, res) => {
  const { dbingredient, price, quantity, image } = req.body;
  const newItem = new Item({ dbingredient, price, quantity, image });
  await newItem.save();
  res.json(newItem);
});

app.get('/api/ingredients', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

const RecipeSchema = new mongoose.Schema({
    id: String,
    title: String,
    image: String,
    ingredients: [IngredientSchema],
    ingredientAmounts: [String],
    isVegetarian: Boolean,
    isVegan: Boolean,
    isDairyFree: Boolean,
    totalCookingTime: Number,
    prepTime: Number,
    cookingTime: Number,
    calories: Number,
    instructions: [String],
    tips: [String],
    });
  
  const Recipe = mongoose.model('recipe', RecipeSchema);
  
  app.post('/api/recipes', async (req, res) => {
    const { dbingredient, price, quantity, image } = req.body;
    const newItem = new Recipe({ dbingredient, price, quantity, image });
    await newItem.save();
    res.json(newItem);
  });
  
  app.get('/api/recipes', async (req, res) => {
    const items = await Recipe.find();
    console.log('Retrieved items:', items); // Add this line for debugging
    res.json(items);
  });

app.get('/api/randomRecipes', async (req, res) => {
    try {
      const apiResponse = await axios.get('https://api.spoonacular.com/recipes/random?apiKey=22c4658fa9554f018d280795e9459795&number=8');

      results = apiResponse.data.recipes.map((recipe) => {
        return {
          id: recipe.id,
          name: recipe.title,
          image: recipe.image,
          link: "/recipe/".concat(recipe.id),
        };
      });
      console.log(results);

      res.json({ results });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error retrieving data' });
    }
});

app.get('/api/recipeSearch', async (req, res) => {
    try {
      const ingredients = req.query.ingredients;
      const apiResponse = await axios.get('https://api.spoonacular.com/recipes/findByIngredients?apiKey=22c4658fa9554f018d280795e9459795&ranking=1&limitLicense=true&ingredients='.concat(ingredients));

      results = apiResponse.data.map((recipe) => {
        return {
          id: recipe.id,
          name: recipe.title,
          image: recipe.image,
          link: "/recipe/".concat(recipe.id),
        };
      });

      res.json({ results });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error retrieving data' });
    }
});

app.get('/api/recipeGet', async (req, res) => {
    try {
      const id = req.query.id;
      const apiResponse = await axios.get('https://api.spoonacular.com/recipes/' + id.toString() + '/information?apiKey=22c4658fa9554f018d280795e9459795');
      const apiResponse2 = await axios.get('https://api.spoonacular.com/recipes/' + id.toString() + '/nutritionWidget.json?apiKey=22c4658fa9554f018d280795e9459795');

      const data = apiResponse.data;
      const nutrition = apiResponse2.data;

      let counter = 0;

      recipe = {
        id: data.id,
        title: data.title,
        image: data.image,
        servingSize: data.servings,
        description: data.summary.split('.')[0].replace(/<[^>]*>/g, '') + '.',
        isVegetarian: data.vegetarian,
        isVegan: data.vegan,
        isDairyFree: data.dairyFree,
        isGlutenFree: data.glutenFree,
        totalCookingTime: data.readyInMinutes,
        calories: nutrition.calories,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        protein: nutrition.protein,
        instructions: data.instructions.replace(/<[^>]*>/g, '').split(/[.\n]/).filter((instruction) => {return instruction !== ''}),
        ingredients: data.extendedIngredients.map((ingredient) => {
            counter++;
            return {id: counter, name: ingredient.originalName};            
        }),
        ingredientAmounts: data.extendedIngredients.map((ingredient) => ingredient.amount.toString() + ' ' + ingredient.unit),
        tips: "",
      };

      res.json({ recipe });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error retrieving data' });
    }
});

app.post('/api/get-chat-completion', async (req, res) => {
  console.log(req.body);
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.message }]
    });
    
    res.json(completion.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(4000, function () {
    console.log('Server started on port 4000');
});
