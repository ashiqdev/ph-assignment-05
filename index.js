const form = document.getElementById('form');

const searchInput = document.getElementById('searchInput');

const btn = document.getElementById('form-btn');

const recipeContainer = document.getElementById('recipes');

const singleRecipe = document.querySelector('.single-recipe');

const singleRecipeImage = document.querySelector('.single-image');

const singleRecipeName = document.querySelector('.recipe-name');

const ingredientsHeader = document.querySelector('.slogan');

const ingredientsList = document.querySelector('.ingredients-list');

const alertOfNull = document.querySelector('.info-wrapper');

const message = document.querySelector('.message');

const warningImage = document.querySelector('.warning-image');

const initialImage = document.querySelector('.initial');

/**
 * @name fetchResults - fetch meals from api
 * @param {String} inputValue
 * @returns {Array} - returns array of meals
 */
const fetchResults = async (inputValue) => {
  const url = ` https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`;
  const { meals } = await (await fetch(url)).json();

  return meals;
};

/**
 * @name displayMeals -  display array of meals in the DOM
 * @param {String} meal
 */
const displayMeals = (meal) => {
  const html = ` 
    <div data-id=${meal.idMeal} class="card pb-3 cursor">
    <div class="extra-wrapper">
    <img
    src=${meal.strMealThumb}
    class="card-img-top extra"
    alt="meal"
  />
    </div>
     
      <div class="card-body">
        <h5 class="card-title">${meal.strMeal}</h5>
      </div>
    </div>`;

  recipeContainer.insertAdjacentHTML('beforeend', html);
};

/**
 * @name getMealDetail - fetch single meal from api
 * @param {String} id
 * @returns {Object} returns single meal
 */
const getMealDetail = async (id) => {
  const url = ` https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  const singleMeal = await (await fetch(url)).json();
  return singleMeal.meals[0];
};

/**
 * @name displayDetail - display details of a meal on DOM
 * @param {Object} meal
 */
const displayDetail = async (meal) => {
  singleRecipe.classList.remove('hidden');
  singleRecipeImage.src = meal.strMealThumb;
  singleRecipeName.innerText = meal.strMeal;
  ingredientsHeader.innerText = 'Ingredients:';

  meal.ingredients.forEach((ingredient) => {
    const html = ` <li class="ingredients-list-item">${ingredient}</li>`;
    ingredientsList.insertAdjacentHTML('beforeend', html);
  });
};

// event handlers
searchInput.addEventListener('input', (e) => {
  if (e.target.value === '') {
    btn.disabled = true;
  } else {
    btn.disabled = false;
  }
});

const clearUI = () => {
  singleRecipe.classList.add('hidden');

  recipeContainer.innerHTML = '';

  initialImage.classList.add('hidden');
};

// filter the truthy values
const filterIngredients = (ingredients) => {
  return ingredients.filter(
    (ingredient) =>
      ingredient.trim() !== '' &&
      ingredient !== 'null null' &&
      ingredient.trim() !== 'null'
  );
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  clearUI();

  //   fetch meals
  const meals = await fetchResults(searchInput.value);

  if (!meals) {
    singleRecipe.classList.add('hidden');
    warningImage.classList.remove('hidden');
    message.innerHTML = ` Your search -<span class="highlight">${searchInput.value}-</span>  did not match any recipe resuls.`;
  } else {
    warningImage.classList.add('hidden');
    message.innerHTML = '';
  }

  //   display meals
  meals?.forEach(displayMeals);

  searchInput.value = '';
  btn.disabled = true;

  const loadedMeals = [...document.querySelectorAll('.card')];

  //   click handler
  loadedMeals.forEach((meal) => {
    meal.addEventListener('click', async function (e) {
      ingredientsList.innerHTML = '';

      mealWrapper = e.target.closest('.card');

      const { id } = mealWrapper.dataset;

      const singleMeal = await getMealDetail(id);

      const ingredients = [
        singleMeal.strMeasure1 + ' ' + singleMeal.strIngredient1,
        singleMeal.strMeasure2 + ' ' + singleMeal.strIngredient2,
        singleMeal.strMeasure3 + ' ' + singleMeal.strIngredient3,
        singleMeal.strMeasure4 + ' ' + singleMeal.strIngredient4,
        singleMeal.strMeasure5 + ' ' + singleMeal.strIngredient5,
        singleMeal.strMeasure6 + ' ' + singleMeal.strIngredient6,
        singleMeal.strMeasure7 + ' ' + singleMeal.strIngredient7,
        singleMeal.strMeasure8 + ' ' + singleMeal.strIngredient8,
        singleMeal.strMeasure9 + ' ' + singleMeal.strIngredient9,
        singleMeal.strMeasure10 + ' ' + singleMeal.strIngredient10,
        singleMeal.strMeasure11 + ' ' + singleMeal.strIngredient11,
        singleMeal.strMeasure12 + ' ' + singleMeal.strIngredient12,
        singleMeal.strMeasure13 + ' ' + singleMeal.strIngredient13,
        singleMeal.strMeasure14 + ' ' + singleMeal.strIngredient14,
        singleMeal.strMeasure15 + ' ' + singleMeal.strIngredient15,
        singleMeal.strMeasure16 + ' ' + singleMeal.strIngredient16,
        singleMeal.strMeasure17 + ' ' + singleMeal.strIngredient17,
        singleMeal.strMeasure18 + ' ' + singleMeal.strIngredient18,
        singleMeal.strMeasure19 + ' ' + singleMeal.strIngredient19,
        singleMeal.strMeasure20 + ' ' + singleMeal.strIngredient20,
      ];

      const filteredIngredients = filterIngredients(ingredients);

      const updatedSingleMeal = {
        ...singleMeal,
        ingredients: filteredIngredients,
      };

      displayDetail(updatedSingleMeal);
    });
  });
});
