const {
  getBannedCategories,
  getBannedIngredients,
} = require('../utilities/profile/profile');

exports.searchRouter = async (req, res) => {
  const defaultPreferences = {
    ingredients: [],
    bannedCategories: [
      {
        id: 1,
        category: 'meat',
        title: 'Carne',
        value: false,
      },
      {
        id: 2,
        category: 'fish',
        title: 'Pescado',
        value: false,
      },
      {
        id: 3,
        category: 'shellfish',
        title: 'Marisco',
        value: false,
      },
      {
        id: 4,
        category: 'vegetable',
        title: 'Vegetales',
        value: false,
      },
      {
        id: 5,
        category: 'dairyProducts',
        title: 'Lácteos',
        value: false,
      },
      {
        id: 6,
        category: 'eggs',
        title: 'Huevos',
        value: false,
      },
    ],
    bannedIngredients: [],
    categories: [
      {
        id: 1,
        category: 'national',
        title: 'De aquí',
        value: false,
      },
      {
        id: 2,
        category: 'international',
        title: 'De allá',
        value: false,
      },
      {
        id: 3,
        category: 'appetizer',
        title: 'Aperitivos y tapas',
        value: false,
      },
      {
        id: 4,
        category: 'salads',
        title: 'Ensaladas',
        value: false,
      },
      {
        id: 5,
        category: 'soups',
        title: 'Sopas y cremas',
        value: false,
      },
      {
        id: 6,
        category: 'nofilter',
        title: 'Saltar',
        value: false,
      },
    ],
    cost: [
      {
        id: 1,
        category: 'cheap',
        title: 'Barato',
        value: false,
      },
      {
        id: 2,
        category: 'medium',
        title: 'Medio',
        value: false,
      },
    ],
    time: [
      {
        id: 1,
        category: 15,
        title: '15 min',
        value: false,
      },
      {
        id: 2,
        category: 30,
        title: '30 min',
        value: false,
      },
      {
        id: 3,
        category: 45,
        title: '45 min',
        value: false,
      },
    ],
    daily: [
      {
        id: 1,
        category: 'breakfast',
        title: 'Desayuno',
        value: false,
      },
      {
        id: 2,
        category: 'lunch',
        title: 'Desayuno',
        value: false,
      },
      {
        id: 3,
        category: 'dinner',
        title: 'Desayuno',
        value: false,
      },
    ],
  };

  const idUser = res.user;

  if (!idUser) {
    res.send({
      OK: 1,
      logged: false,
      searchPreferences: defaultPreferences,
    });
  }
  const categories = await getBannedCategories(idUser);
  const ingredients = await getBannedIngredients(idUser);

  const bannedCategories = defaultPreferences.bannedCategories.map((cat) => {
    categories.map((ban) => {
      if (ban.idCategory === cat.id) {
        cat.value = true;
      }
    });
    return cat;
  });
  const bannedIngredients = ingredients.map((el) => {
    return { idIngredient: el.idIngredient };
  });

  const newPreferences = {
    ...defaultPreferences,
    bannedCategories,
    bannedIngredients,
  };

  res.send(newPreferences);
};
