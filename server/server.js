const express = require('express');
const cors = require('cors');
// const { ApolloServer } = require('apollo-server-express');
// const { GraphQLScalarType } = require('graphql');
// const resolvers = require('./graphql/resolvers.js');
// const { connectDB, db } = require('./db/connectDB.js');
// const typeDefs = require('./graphql/schema.js');
const mongoose = require('mongoose');
const axios = require('axios');
const { OpenAI } = require('openai');
const puppeteer = require('puppeteer');

const spoonacularKey = "apiKey=22c4658fa9554f018d280795e9459795";
const spoonacularKey2 = "apiKey=1580ffd925e2485e9a7238eadd6a16c9";
const app = express();

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ingredientImg = new mongoose.Schema({
  dbingredient: String,
  image: String,
});

const ingredImg = mongoose.model('ingredientlist', ingredientImg);

const IngredientSchema = new mongoose.Schema({
  dbingredient: String,
  price: String,
  quantity: String,
  measurement: String,
  image: String,
});

const Item = mongoose.model('shoppinglist', IngredientSchema);

app.use(cors());

app.use(express.json());

app.post('/api/ingredients', async (req, res) => {
  const { dbingredient, quantity } = req.body;
  for (let i = 0; i < dbingredient.length; i++) {
    const amount = quantity[i].split(' ')[0];
    const measurement = quantity[i].split(' ')[1] ? quantity[i].split(' ')[1] : '';
    const existing = await Item.findOne({ dbingredient: dbingredient[i], measurement: measurement });
    if (existing) {
      const newQuantity = parseInt(existing.quantity) + parseInt(amount);
      const newPrice = existing.price != '' ? (parseFloat(existing.price) / parseInt(existing.quantity) * newQuantity).toFixed(2) : '';
      await Item.updateOne({ dbingredient: dbingredient[i] }, { quantity: newQuantity.toString(), price: newPrice });
    } else {
      const ingredient = await ingredImg.findOne({ dbingredient: dbingredient[i] });
      console.log(ingredient);
      const newItem = new Item({ dbingredient: dbingredient[i], price: '', quantity: amount, image: ingredient.image ? ingredient.image : '', measurement: measurement });
      await newItem.save();
    }
  }
  const items = await Item.find();

  res.json(items);
});

app.get('/api/ingredients', async (req, res) => {
  const items = await Item.find();
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

      const imageURL = "https://spoonacular.com/cdn/ingredients_250x250/";

      data.extendedIngredients.forEach(async (ingredient) => {
        const existing = await ingredImg.findOne({ dbingredient: ingredient.originalName });
        if (!existing) {
          const newIngred = new ingredImg({ dbingredient: ingredient.originalName, image: imageURL.concat(ingredient.image) });
          await newIngred.save();
        }
      });

      let recipe = {
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
  const prompt = `Generate 10 cooking tips for the recipe: ${req.query.name}. Deliver your response as an array of unordered strings that allows direct parsing into JSON code. Do not provide any other response before or after the code. The tips should be short and sweet, at most two lines, and should be slightly more interesting, lesser-known, or expert tips. The ingredients are ${req.query.ingredients}. The instructions are ${req.query.instructions}. Remember, do not use any form of numbered bullet points.`;
  try {
    async function main() {
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });
      data = JSON.parse(chatCompletion.choices[0].message.content)
      res.send(data);
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
    const productNameList = productSection.querySelectorAll('.ctPXx');
    const productName = Array.from(productNameList).map((elem) => { return elem.innerText; });
    const productPriceList = productSection.querySelectorAll('.cXCGWM');
    const productPrice = Array.from(productPriceList).map((elem) => { return elem.innerText; });
    const productAmtList = productSection.querySelectorAll('.cURkuH');
    const productAmt = Array.from(productAmtList).map((elem) => { return elem.innerText; });
    const productImgList = productSection.querySelectorAll('img');
    const productImg = Array.from(productImgList).map((elem) => { return elem.src; });
    const linkElements = productSection.querySelectorAll("a")
    const link = Array.from(linkElements).map((elem) => {return elem.href})
    console.log(productName);
    console.log(productPrice);
    console.log(productAmt);
    let results = [];
    for(i = 0; i < (productName.length >= 10 ? 10 : productName.length); i++) { //adjust the max i value to limit the number of results returned
      results.push({
        name: productName[i],
        price: productPrice[i],
        image: productImg[i],
        quantity: productAmt[i],
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
