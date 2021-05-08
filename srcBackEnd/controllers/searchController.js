const {
  getBannedCategories,
  getBannedIngredients,
} = require('../utilities/profile/profile');

exports.searchPrefs = async (req, res) => {
  const defaultPreferences = {
    ingredients: [],
    bannedCategories: [
      {
        id: 3,
        category: 'meat',
        title: 'Carne',
        value: false,
      },
      {
        id: 13,
        category: 'fish',
        title: 'Pescado',
        value: false,
      },
      {
        id: 10,
        category: 'shellfish',
        title: 'Marisco',
        value: false,
      },
      {
        id: 8,
        category: 'dairyAndEggs',
        title: 'Lácteos y huevos',
        value: false,
      },
      {
        id: 17,
        category: 'vegetable',
        title: 'Verduras',
        value: false,
      },
      {
        id: 11,
        category: 'breadAndPastry',
        title: 'Pan y bollería',
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
  console.log('USER', idUser);
  if (!idUser) {
    console.log('NO REGISTRADO'); 
    res.send({
      OK: 1,
      searchPreferences: defaultPreferences,
      logged: false,
    });
  } else {
    const categories = await getBannedCategories(idUser);
    const ingredients = await getBannedIngredients(idUser);

    const bannedCategories = await defaultPreferences.bannedCategories.map(
      (cat) => {
        categories.map((ban) => {
          if (ban.idCategory === cat.id) {
            cat.value = true;
          }
        });
        return cat;
      },
    );

    const bannedIngredients = ingredients
      ? ingredients.map((el) => {
          return { idIngredient: el.idIngredient, title: el.title };
        })
      : [];

    const newPreferences = {
      ...defaultPreferences,
      bannedCategories,
      bannedIngredients,
    };
    console.log("OK", newPreferences)
    res.json({
      OK: 1,
      searchPreferences: newPreferences,
      logged: true,
    });
  }
};

exports.search = (req, res) => {
  const {
    ingredients,
    bannedCategories,
    bannedIngredients,
    categories,
    cost,
    time,
    daily,
  } = req.bodys.searchPrefs;
};
