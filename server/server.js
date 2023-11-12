const express = require('express');
const cors = require('cors');
// const { ApolloServer } = require('apollo-server-express');
// const { GraphQLScalarType } = require('graphql');
// const resolvers = require('./graphql/resolvers.js');
// const { connectDB, db } = require('./db/connectDB.js');
// const typeDefs = require('./graphql/schema.js');
const { MongoClient } = require('mongodb');
const axios = require('axios');
const { OpenAI } = require('openai');

const puppeteer = require('puppeteer');

const spoonacularKey = "apiKey=22c4658fa9554f018d280795e9459795";

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

app.get('/api/randomRecipes', async (req, res) => {
    try {

      const apiResponse = await axios.get('https://api.spoonacular.com/recipes/random?number=8' + '&' + spoonacularKey);

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
      const apiResponse = await axios.get('https://api.spoonacular.com/recipes/findByIngredients?limitLicense=true&ingredients='.concat(ingredients) + '&' + spoonacularKey);

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
      const apiResponse = await axios.get('https://api.spoonacular.com/recipes/' + id.toString() + '/information' + '?' + spoonacularKey);
      const apiResponse2 = await axios.get('https://api.spoonacular.com/recipes/' + id.toString() + '/nutritionWidget.json' + '?' + spoonacularKey);

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

const openai = new OpenAI({
  apiKey: "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",
});

app.get('/api/getTips', async (req, res) => {
  const prompt = `Generate 10 cooking tips for the recipe: ${req.query.name}. Deliver your response as an array of Strings without numbering or open and close brackets. Do not provide any other response before or after the code. The tips should be short and sweet, at most two lines, and should be slightly more interesting, lesser-known, or expert tips. The ingredients are ${req.query.ingredients}. The instructions are ${req.query.instructions}`;
  console.log(prompt);
  try {
    async function main() {
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });

      console.log(chatCompletion.choices[0].message.content)

      res.json(chatCompletion.choices[0].message.content.split('\n').map((tip) => tip.replace(/"/g, '')));
    }
    main();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(4000, function () {
    console.log('Server started on port 4000');
});
