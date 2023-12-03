# Project Information

**Demo Video**: https://youtu.be/cTAuM-L-vf8

**Project Report**: https://docs.google.com/document/d/1gIaefDHC8ORelAfmzk4qbDVxrx48ZdpkaZWmFa3oGFk/edit?usp=sharing

**Application specifications**: [Recipe Rescue PRD.pdf](https://github.com/IT5007-2310/course-project-reciperescue/files/12909002/Recipe.Rescue.PRD.pdf)

**Wireframes**: https://whimsical.com/recipe-rescue-lofi-wireframes-FFpDajuwzxosZFSmmSsHrL

# Key Features

**Home page**
* **Browse Recipes**: Explore popular recipes
* **Ingredient-Based Search**: Search for recipes based on ingredients you have in your fridge.

**Recipe Information Page**
* **Recipe Information Display**: View a recipe's details, including nutritional information, instructions, and ingredients. 
* **Recipe tips**: Browse through recipe tips generated by ChatGPT.
* **Ingredient customisation**: Toggle between imperial or metric measurement systems and customise serving sizes. Add the customised ingredients to your shopping list.

**Shopping List**
* **Shopping List**: View, add, and edit quantities of items in your shopping list. 
* **Ingredient Cost Estimation**: See the estimated cost of ingredients from a local supermarket, and select your preferred item.

**Backend Features**
* **API Integration**: Call upon 4 different external APIs for
  * (1) Getting a list of recipes,
  * (2) Getting the details within a specific recipe,
  * (3) Calling ChatGPT to request for tips on recipe,
  * (4) Calling an API to convert the ingredients into grams.
* **Fairprice Website Scraping**: Scrap the Fairprice Website (a local supermarket) to obtain list of items available for specific ingredients, using a NLP package to parse the ingredients to extract a specific item. Identify the specific portion in the website that we would want to extract for our shopping list feature. Also built in function to eliminate bugs from the scrapper (e.g. some data cannot be scrapped if part of the webpage is not loaded)
* **Data caching**: Caching of data called by both APIs and scraper into our database so that it will reduce loading time for repeated loading of similar data.
* **Database**: Database to (1) save ingredients in recipe so that it could be pulled for display in shopping list (2) save manually added ingredients to shopping list
