const express = require('express');
const cors = require('cors');
const nlp = require('compromise');
const mongoose = require('mongoose');
const axios = require('axios');
const { OpenAI } = require('openai');
const puppeteer = require('puppeteer');
require('dotenv').config();

// load the api keys from the .env file
const spoonacularKey = "apiKey=" + process.env.spoonacularKey;
const spoonacularKey2 = "apiKey=" + process.env.spoonacularKey2;
const app = express();

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Setup the various schemas for the database

const recipeBasicSchema = new mongoose.Schema({
  id: String,
  name: String,
  image: String,
  link: String,
});

const recipeSchema = new mongoose.Schema({
  id: String,
  title: String,
  image: String,
  servingSize: String,
  description: String,
  isVegetarian: String,
  isVegan: String,
  isDairyFree: String,
  isGlutenFree: String,
  totalCookingTime: String,
  calories: String,
  carbs: String,
  fat: String,
  protein: String,
  instructions: [String],
  ingredients: [{ id: String, name: String }], 
  ingredientAmounts: [String],
  tips: [String],
});

const recipe = mongoose.model('recipes', recipeSchema);

const recipeListSchema = new mongoose.Schema({
  date: String,
  searchTerm: String,
  recipes: [recipeBasicSchema],
});

const recipeList = mongoose.model('recipelists', recipeListSchema);

const ingredientImgSchema = new mongoose.Schema({
  dbingredient: String,
  image: String,
});

const ingredImg = mongoose.model('ingredientlist', ingredientImgSchema);


const ingredientWeightSchema = new mongoose.Schema({
  ingredientName: String,
  sourceUnit: String,
  amountInGram: Number,
});

const ingredWeight = mongoose.model('ingredientWeight', ingredientWeightSchema);

const IngredientSchema = new mongoose.Schema({
  dbingredient: String,
  price: String,
  quantity: String,
  measurement: String,
  image: String,
});

const Item = mongoose.model('shoppinglist', IngredientSchema);

const fairpriceItemSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    quantity: String,
    link: String,
});

const fairpriceSchema = new mongoose.Schema({
  search: String,
  productList: [fairpriceItemSchema],
});

const fairpriceItems = mongoose.model('fairpriceitems', fairpriceSchema);

app.use(cors());

app.use(express.json());

//api to save ingredients (added from recipe) in the database
app.post('/api/ingredients', async (req, res) => { 
  const { dbingredient, quantity } = req.body;
  for (let i = 0; i < dbingredient.length; i++) { 
    const amount = Math.ceil(quantity[i].split(' ')[0]); 
    const measurement = quantity[i].split(' ')[1] ? quantity[i].split(' ')[1] : '';
    const existing = await Item.findOne({ dbingredient: dbingredient[i], measurement: measurement });
    if (existing) {
      const newQuantity = parseInt(existing.quantity) + parseInt(amount);
      const newPrice = existing.price != '' ? (parseFloat(existing.price) / parseInt(existing.quantity) * newQuantity).toFixed(2) : '';
      await Item.updateOne({ dbingredient: dbingredient[i] }, { quantity: newQuantity.toString(), price: newPrice });
    } else {
      const ingredient = await ingredImg.findOne({ dbingredient: dbingredient[i] });
      console.log(ingredient);
      const newItem = new Item({ dbingredient: dbingredient[i], price: '', quantity: amount, image: (ingredient && ingredient.image) ? ingredient.image : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/1200px-Icon-round-Question_mark.svg.png', measurement: measurement });
      await newItem.save();
    }
  }
  const items = await Item.find();

  res.json(items);
});

//api for user to add ingredients manually in shopping list 
app.post('/api/add-ingredient', async (req, res) => {
  const { dbingredient, quantity, measurement, price } = req.body;
  const newItem = new Item({ dbingredient: dbingredient, price: price, quantity: quantity, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/1200px-Icon-round-Question_mark.svg.png', measurement: measurement });
  await newItem.save();
  //retrieve all ingredients 
  const items = await Item.find();
  //send list of ingredients back to database
  res.json(items);
});

//api to get all ingredients from database so that the saved ingredients are displayed in shopping list
app.get('/api/ingredients', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

//api to update changes made in modal of the shopping list
app.put('/api/update-ingredient/:id', async (req, res) => {
  const itemId = req.params.id;
  const { name, price, listingqty, qty, image } = req.body;

  try {
    // Update the item with the new name and price
    await Item.updateOne({ _id: itemId }, { dbingredient: name, price: price, measurement: listingqty, quantity: qty, image: image });

  } catch (error) {
    console.error('Error increasing quantity:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//api to increase the quantity of ingredient in shopping list using '+' button
app.put('/api/increase-quantity/:id', async (req, res) => {
  const itemId = req.params.id;
  try {
    // Find the item by ID 
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    // Increase the quantity (Math.min is used to ensure it doesn't go above 999) 
    const newQuantity = Math.min(999, parseInt(item.quantity, 10) + 1);
    // Update the item with the new quantity 
    await Item.updateOne({ _id: itemId }, { quantity: newQuantity.toString() });
    // Respond with the updated item or a success message 
    res.json({ message: 'Quantity increased successfully', updatedItem: { ...item.toObject(), quantity: newQuantity } });
  } catch (error) {
    console.error('Error increasing quantity:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//api to decreate the quantity of inredient in shopping list using '-' button
app.put('/api/decrease-quantity/:id', async (req, res) => { 
  const itemId = req.params.id; 
  try { 
    // Find the item by ID 
    const item = await Item.findById(itemId); 
    if (!item) { 
      return res.status(404).json({ message: 'Item not found' }); 
    } 
    // Decrease the quantity (Math.max is used to ensure it doesn't go below 1) 
    const newQuantity = Math.max(1, parseInt(item.quantity, 10) - 1); 
    // Update the item with the new quantity 
    await Item.updateOne({ _id: itemId }, { quantity: newQuantity.toString() }); 
    // Respond with the updated item or a success message 
    res.json({ message: 'Quantity decreased successfully', updatedItem: { ...item.toObject(), quantity: newQuantity } }); 
  } catch (error) { 
    console.error('Error decreasing quantity:', error); 
    res.status(500).json({ message: 'Internal Server Error' }); 
  } 
}); 

//delete ingredient from shopping list by ID using the trash button
app.delete('/api/del-ingredients/:id', async (req, res) => { 
  const itemId = req.params.id; 
  try { 
    // Find the item by ID and delete it 
    const result = await Item.deleteOne({ _id: itemId }); 
    if (result.deletedCount === 0) { 
      return res.status(404).json({ message: 'Item not found' }); 
    } 
    // Respond with a success message or any other relevant data 
    res.json({ message: 'Item deleted successfully' }); 
  } catch (error) { 
    console.error('Error deleting ingredient:', error); 
    res.status(500).json({ message: 'Internal Server Error' }); 
  } 
}); 

//delete ingredients from shopping list by using 'clear list' button
app.delete('/api/clear-ingredients', async (req, res) => { 
  try { 
    // Remove all items from the database 
    await Item.deleteMany({}); 
    // Respond with a success message or any other relevant data 
    res.json({ message: 'All items deleted successfully' }); 
  } catch (error) { 
    console.error('Error clearing ingredients:', error); 
    res.status(500).json({ message: 'Internal Server Error' }); 
  } 
}); 


app.get('/api/randomRecipes', async (req, res) => {
  try {
    const today = new Date();
    //Check if the api has been already called today, if so retrieve from database
    const check = await recipeList.findOne({ date: today.toDateString() });
    if ( check ) {
      res.json( check.recipes );
    } else {
      const apiResponse = await axios.get('https://api.spoonacular.com/recipes/random?number=8' + '&' + spoonacularKey);
      const results = apiResponse.data.recipes.map((recipe) => {
        return {
          id: recipe.id,
          name: recipe.title,
          image: recipe.image,
          link: "/recipe/".concat(recipe.id),
        };
      });
      // Cache the daily random recipes in the database
      const newRecipeList = new recipeList({ date: today.toDateString(), recipes: results });
      await newRecipeList.save();

      res.json( results );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving data' });
  }
});

app.get('/api/recipeSearch', async (req, res) => {
  try {
    const ingredients = req.query.ingredients;
    //Check if the search has been done before, if so retrieve from database
    const check = await recipeList.findOne({ searchTerm: ingredients });
    if (check) { 
      res.json( check.recipes );
    } else {
      const apiResponse = await axios.get('https://api.spoonacular.com/recipes/findByIngredients?limitLicense=true&ingredients='.concat(ingredients) + '&' + spoonacularKey);

      results = apiResponse.data.map((recipe) => {
        return {
          id: recipe.id,
          name: recipe.title,
          image: recipe.image,
          link: "/recipe/".concat(recipe.id),
        };
      });

      // Cache the search results in the database
      const newRecipeList = new recipeList({ searchTerm: ingredients, recipes: results });
      await newRecipeList.save();

      res.json( results );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving data' });
  }
});

app.get('/api/recipeGet', async (req, res) => {
  try {
    const id = req.query.id;
    //Check if we already have the receipe in the database, if so retrieve from database
    const check = await recipe.findOne({ id: id });
    if (check) {  
      res.json(check);
    } else {
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

      // Cache the recipe in the database
      const newRecipe = {
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
        instructions: data.instructions.replace(/<[^>]*>/g, '').split(/[.\n]/).filter((instruction) => { return instruction !== '' }),
        ingredients: data.extendedIngredients.map((ingredient) => {
          counter++;
          return { id: counter, name: ingredient.originalName };
        }),
        ingredientAmounts: data.extendedIngredients.map((ingredient) => ingredient.amount.toString() + ' ' + ingredient.unit),
        tip: [],
      };

      new recipe(newRecipe).save();

      res.json( newRecipe );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving data' });
  }
});

app.get('/api/convertWeight', async (req, res) => {
  try {
    const ingredient = req.query.ingredient;
    const amount = req.query.amount.split(' ');
    const sourceUnit = amount[1];
    // Check for error in conversion
    if (sourceUnit == 'serving') {
      // if error, return 0 grams
      res.json( 0 + ' ' + 'grams' );
    }
    else {
      const quantity = parseFloat(amount[0]);
      //Check if we already have the conversion in the database, if so retrieve from database
      const check = await ingredWeight.findOne({ ingredientName: ingredient, sourceUnit: sourceUnit });
      if (check) { 
        const newAmount = quantity * check.amountInGram;
        res.json( newAmount.toFixed(1) + ' ' + 'grams' );
      } else {
        // Call API to convert the units of ingredient to grams
        const apiResponse = await axios.get('https://api.spoonacular.com/recipes/convert?ingredientName=' + ingredient + '&sourceAmount=' + quantity.toString() + '&sourceUnit=' + sourceUnit + '&targetUnit=grams&' + spoonacularKey);
        const data = apiResponse.data;
        // Cache the conversion in the database
        const newIngredWeight = new ingredWeight({ ingredientName: ingredient, sourceUnit: sourceUnit, amountInGram: parseFloat((data.targetAmount / quantity).toFixed(1)) });
        await newIngredWeight.save();
        res.json( data.targetAmount.toString() + ' ' + 'grams' );
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving data' });
  }
});

const openai = new OpenAI({
  apiKey: process.env.openAIKey,
});

app.get('/api/getTips', async (req, res) => {
  const id = req.query.id;
  try {
    const check = await recipe.findOne({ id: id }, { tips: 1 });
    //Check if we have already queried Chatgpt for tips before, if so retrieve from database
    if ( check.tips.length > 0 ) {  
      res.json( check.tips );
    } else {
      const search = await recipe.findOne({ id: id });
      const prompt = `Generate 10 cooking tips for the recipe: ${search.title}. 
      Deliver your response as an array of unordered strings that allows direct parsing into JSON code. 
      Do not provide any other response before or after the code. 
      The tips should be short and sweet, at most two lines, and should be slightly more interesting, lesser-known, or expert tips. 
      The ingredients are ${search.ingredients.map((ingredient) => ingredient.name ).toString()}. 
      The instructions are ${search.instructions.toString()}. 
      Remember, do not use any form of numbered bullet points.`;

      async function main() {
        const chatCompletion = await openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-3.5-turbo',
        });
        const data = JSON.parse(chatCompletion.choices[0].message.content)
        // Cache the tips in the database
        await recipe.updateOne({ id: id }, { $set: { tips: data } }); 
        res.send(data);
      }
      main();     
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const scrape = async (searchTerm) => {
  // Start a Puppeteer session with no browser
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  // Go to the Fairprice website and wait until loaded
  await page.goto("https://www.fairprice.com.sg/search?query=" + searchTerm, {
    waitUntil: "load",
  });

  // Scroll the page and wait to ensure that we can load 10 items from the page
  for(let i = 0; i < 5; i++) {
    await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
    });
    page.waitForTimeout(1000);
  }

  // Get page data
  const products = await page.evaluate(() => {
    const productSection = document.querySelector(".productCollection");
    const productNameList = productSection.querySelectorAll('.ctPXx');
    if (productNameList.length == 0) {
      return [];
    }
    const productName = Array.from(productNameList).map((elem) => { return elem.innerText; });
    const productPriceList = productSection.querySelectorAll('.cXCGWM');
    const productPrice = Array.from(productPriceList).map((elem) => { return elem.innerText; });
    const productAmtList = productSection.querySelectorAll('.cURkuH');
    const productAmt = Array.from(productAmtList).map((elem) => { return elem.innerText; });
    const productImgList = productSection.getElementsByTagName('img');
    const productImg = Array.from(productImgList).map((elem) => { return elem.getAttribute("src") ; });
    const linkElements = productSection.getElementsByTagName("a")
    const link = Array.from(linkElements).map((elem) => { return elem.getAttribute("href") ; })
    let results = [];
    for (i = 0; i < (productName.length >= 10 ? 10 : productName.length); i++) { //adjust the max i value to limit the number of results returned
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

// used to sieve out adjectives or non-ingredient words in the search term for scrapping
function findNouns(phrase) {
  const doc = nlp(phrase);
  const nouns = doc.nouns().out('array').join(' ');
  return nouns
}

app.get('/api/getFairpriceItems', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const cleanSearchTerm = findNouns(searchTerm);
    console.log(cleanSearchTerm);
    //Check if we have already scrap Fariprice before, if so retrieve from database
    const check = await fairpriceItems.findOne({ search: cleanSearchTerm });
    console.log(check);
    if ( check ) {  
      res.json( check.productList );
    } else {
      const productList = await scrape(cleanSearchTerm);
      if (productList.length == 0) {
        res.status(404).json({ success: false, message: 'No products found' });
      }
      //Cache the scraped results in the database
      const newFairpriceItems = new fairpriceItems({ search: cleanSearchTerm, productList: productList });
      await newFairpriceItems.save();
      res.json( productList );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving data' });
  }
});

app.listen(4000, function () {
  console.log('Server started on port 4000');
});