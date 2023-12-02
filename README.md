# System Design

Our application specifications can be found here: [Recipe Rescue PRD.pdf](https://github.com/IT5007-2310/course-project-reciperescue/files/12909002/Recipe.Rescue.PRD.pdf)


# Lo-fi wireframes

We have decided to start with lo-fi wireframes, focusing on the layout of the components and UX rather than UI. 

The wireframes can be viewed here: https://whimsical.com/recipe-rescue-lofi-wireframes-FFpDajuwzxosZFSmmSsHrL

We are still in the process of refining our designs and choosing between possible layouts.

# Key Features

1. **Display and Search for Recipes**: Display popular recipes and search for them based on ingredients. You can test this by accessing the homepage. 

2. **Recipe Information Display**: Display a recipe's details, including general information, instructions, ingredients and recipe tips. You can test this by clicking on one of the recipes, or typing in localhost:3000/recipe/1. There are 5 sample recipes to test.

3. **Shopping List**: Add ingredients to a shopping list. You can test this by clicking on the 'Shopping List' item in the Navigation Bar.

# Backend Features

1. Call upon 4 different APIs for (1) Getting a list of recipe, (2) Getting the details within a specific recipe, (3) Calling ChatGPT to request for tips on recipe, (4) Calling an api to convert the ingredients into grams

2. Scrap the Fairprice Website to obtain list of items available for specific ingredients

3. Caching of data called by both APIs and scraper into our database so that it will reduce loading time for repeated loading of similar data
