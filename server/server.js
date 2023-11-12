const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const { ApolloServer } = require('apollo-server-express');
// const { GraphQLScalarType } = require('graphql');
// const resolvers = require('./graphql/resolvers.js');
// const typeDefs = require('./graphql/schema.js');
const axios = require('axios');
const { OpenAI } = require('openai');
const puppeteer = require('puppeteer');

const spoonacularKey = "apiKey=22c4658fa9554f018d280795e9459795";

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
      const apiResponse = await axios.get('https://api.spoonacular.com/recipes/random?number=8' + '&' + spoonacularKey);

      results = apiResponse.data.recipes.map((recipe) => {
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

const scrape = async (searchTerm) => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto("https://www.fairprice.com.sg/search?query=" + searchTerm, {
    waitUntil: "domcontentloaded",
  });

  // Get page data
  const products = await page.evaluate(() => {
    const productSection = document.querySelector(".productCollection");
    const productNameList = productSection.querySelectorAll('[data-testid="product-name-and-metadata"]');
    const productName = Array.from(productNameList).map((elem) => { return elem.innerText; });
    const productPriceList = productSection.querySelectorAll('.cXCGWM');
    const productPrice = Array.from(productPriceList).map((elem) => { return elem.innerText; });
    const productImgList = productSection.querySelectorAll('img');
    const productImg = Array.from(productImgList).map((elem) => { return elem.src; });
    const linkElements = productSection.querySelectorAll("a")
    const link = Array.from(linkElements).map((elem) => {return elem.href})

    let results = [];

    for(i = 0; i < (productName.length >= 10 ? 10 : productName.length); i++) {
      results.push({
        name: productName[i],
        price: productPrice[i],
        image: productImg[i],
        link: link[i],
      });
    }

    return results;
    // });
  });

  await browser.close();

  return products;
};

app.get('/api/getFairpriceItems', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const productList = await scrape(searchTerm);
    res.json({ productList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving data' });
  }
});

app.listen(4000, function () {
    console.log('Server started on port 4000');
});
