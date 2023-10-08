//
// Variables
//

// Valid main ingredients lists in an array
// currently 573 ingredients entries for https://www.themealdb.com/api/json/v1/1/list.php?i=list
// takes way too long to fetch before prompting user to enter an ingredient choice so had to use
// hard coded solution
const fullIngredientList = [
  "chicken",
  "salmon",
  "beef",
  "pork",
  "avocado",
  "apple_cider_vinegar",
  "asparagus",
  "aubergine",
  "baby_plum_tomatoes",
  "bacon",
  "baking_powder",
  "balsamic_vinegar",
  "basil",
  "basil_leaves",
  "basmati_rice",
  "bay_leaf",
  "bay_leaves",
  "beef_brisket",
  "beef_fillet",
  "beef_gravy",
  "beef_stock",
  "bicarbonate_of_soda",
  "biryani_masala",
  "black_pepper",
  "black_treacle",
  "borlotti_beans",
  "bowtie_pasta",
  "bramley_apples",
  "brandy",
  "bread",
  "breadcrumbs",
  "broccoli",
  "brown_lentils",
  "brown_rice",
  "brown_sugar",
  "butter",
  "cacao",
  "cajun",
  "canned_tomatoes",
  "cannellini_beans",
  "cardamom",
  "carrots",
  "cashew_nuts",
  "cashews",
  "caster_sugar",
  "cayenne_pepper",
  "celeriac",
  "celery",
  "celery_salt",
  "challots",
  "charlotte_potatoes",
  "cheddar_cheese",
  "cheese",
  "cheese_curds",
  "cherry_tomatoes",
  "chestnut_mushroom",
  "chicken_breast",
];
const completeOrdersArray = [];
const incompleteOrdersArray = [];
const mainIngredientFilter =
  "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
let ordersArr = [];
let ordersStatusArr = [];
let orderNumber = 0;
let lastOrderNumber = 0;
let meal_description = "";
let final_message = "";

//
// Order Class
//
class Order {
  constructor(
    meal_description,
    order_number,
    completion_status = "incomplete"
  ) {
    this.meal_description = meal_description;
    this.order_number = order_number;
    this.completion_status = completion_status;
    ordersArr.push(this);

    // Store orders in Session Storage in JSON array
    sessionStorage.setItem("orders", JSON.stringify(ordersArr));
    // Store last order number in Session Storage
    sessionStorage.setItem(
      "last_order_number",
      (lastOrderNumber = ordersArr.length)
    );
  }
}

//
// Generate test data
//
const avocado1 = new Order("Chocolate Avocado Mousse", 1, "completed");
const avocado2 = new Order("Crock Pot Chicken Baked Tacos", 2, "completed");
const salmon1 = new Order("Salmon Avocado Salad", 3, "completed");
const salmon2 = new Order("Honey Teriyaki Salmon", 4, "completed");
const salmon3 = new Order("Salmon Prawn Risotto", 5, "completed");
const salmon4 = new Order("Salmon Prawn Risotto", 6, "incomplete");

let mainIngredientPrompt = prompt(
  "What is the main ingredient you would like to use eg(chicken, beef, salmon, pork, avocado)?"
);

// Adding underscores for spaces learned from
/*
  (1955) Replacing spaces with underscores in JavaScript?, Stack Overflow. 
  Available at: https://stackoverflow.com/questions/441018/replacing-spaces-with-underscores-in-javascript (Accessed: 18 September 2023). 
  */
// Handle entries like "Bicarbonate Of Soda" so it becomes bicarbonate_of_soda
// alternate solution would be using "replaceAll" mainIngredientPrompt.replaceAll(" ", "_").toLowerCase()
let mainIngredient = mainIngredientPrompt.toLowerCase().split(" ").join("_");

// Call user to re-enter their order due to an error
const callForIngredientAgain = () => {
  mainIngredientPrompt = prompt(
    "Please enter a valid ingredient eg(chicken, beef, salmon, pork, avocado)?"
  );
  mainIngredient = mainIngredientPrompt.toLowerCase().split(" ").join("_");
};

// Call if user enters wrong number for order
const callForOrderNumberAgainIncomplete = () => {
  incompleteOrders = prompt(
    `Incomplete orders are ${incompleteOrdersArray} \n please enter an order you wish to mark as "Complete"`
  );
};

const callForOrderNumberAgainComplete = () => {
  completeOrders = prompt(
    `Complete orders are ${completeOrdersArray} \n please enter an order you wish to mark as "Incomplete"`
  );
};

while (true) {
  if (!fullIngredientList.includes(mainIngredient)) {
    // If user enters an ingredient that doesn't exist eg a null entry
    callForIngredientAgain();
  } else {
    break;
  }
}

// Use "for of" loop to iterate through the array and add incomplete orders
// Learned from MDN Web Docs https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
const iterateIncompleteOrders = (ordersStatusArr) => {
  for (let order of ordersStatusArr) {
    if (order.completion_status === "incomplete") {
      incompleteOrdersArray.push(
        "\n" + order.order_number + " " + order.meal_description
      );
    }
  }
};

const iterateCompleteOrders = (ordersStatusArr) => {
  for (let order of ordersStatusArr) {
    if (order.completion_status === "completed") {
      completeOrdersArray.push(
        "\n" + order.order_number + " " + order.meal_description
      );
    }
  }
};

// Url we are searching for with main ingredient added to query
let mainIngredientAnswer = mainIngredientFilter + mainIngredient;

//
// Fetch from API
//
// Get all meals based off main ingredient
const fetchMainIngredientMeals = async () => {
  try {
    const response = await fetch(mainIngredientAnswer);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

const meal = fetchMainIngredientMeals();

// Promise gets resolved
meal.then(function (result) {
  // Get meals array from Object
  const mealsList = result.meals;

  const mealNames = mealsList.map((meal) => meal.strMeal);

  // Math.random() learned from
  // MDN Web Docs https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  randomMeal = Math.floor(Math.random() * (mealNames.length - 1));
  alert(`Your meal will be ${mealNames[randomMeal]}`);

  // Since orders are never deleted we can use the length of the array rather than something like a uuid
  orderNumber = ordersArr.length + 1;

  // Create new Order
  let order = new Order(mealNames[randomMeal], orderNumber, "incomplete");

  // Take Session Storage data for orders and put in an array
  ordersStatusArr = JSON.parse(sessionStorage.getItem("orders"));

  iterateIncompleteOrders(ordersStatusArr);

  //
  // Ask to change orders to completed
  //
  incompleteOrders = prompt(
    `Incomplete orders are ${incompleteOrdersArray} \n Please enter an order number you wish to mark as "Completed" or "0" to skip`
  );

  while (true) {
    if (
      // It is impossible to have a negative order number or one greater than the last order number
      Number(incompleteOrders) > -1 &&
      Number(incompleteOrders) <= lastOrderNumber
    ) {
      break;
    } else {
      alert("Sorry that order number was wrong please try again.");
      // Called if user doesn't enter a valid order number
      callForOrderNumberAgainIncomplete();
    }
  }

  ordersArr = JSON.parse(sessionStorage.getItem("orders"));

  // Change status of the specific order the user chose
  for (order of ordersArr) {
    if (Number(incompleteOrders) === order.order_number) {
      order.completion_status = "completed";
    }
  }

  ordersStatusArr = JSON.parse(sessionStorage.getItem("orders"));
  iterateCompleteOrders(ordersStatusArr);

  //
  // Ask to change orders to incomplete
  //
  completeOrders = prompt(
    `Complete orders are ${completeOrdersArray} \n Please enter an order number you wish to mark as "Incomplete" or "0" to skip"`
  );

  while (true) {
    if (
      Number(completeOrders) > -1 &&
      Number(completeOrders) <= lastOrderNumber
    ) {
      break;
    } else {
      alert("Sorry that order number was wrong please try again.");
      callForOrderNumberAgainComplete();
    }
  }

  for (order of ordersArr) {
    if (Number(completeOrders) === order.order_number) {
      order.completion_status = "incomplete";
    }
  }

  //
  // Final Output
  //
  sessionStorage.setItem("orders", JSON.stringify(ordersArr));
  ordersArr = JSON.parse(sessionStorage.getItem("orders"));

  for (order of ordersArr) {
    final_message +=
      order.order_number +
      " - " +
      order.meal_description +
      " - " +
      order.completion_status +
      "\n";
  }

  lastOrderNumber = sessionStorage.getItem("last_order_number");

  alert(
    `Full list of orders \n${final_message}\nLast order number is ${lastOrderNumber}`
  );
});
