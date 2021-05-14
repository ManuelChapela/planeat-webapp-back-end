const { TripleDES } = require('crypto-js');
const { doQuery } = require('../utilities/doQuery');
const {
  getBannedCategories,
  getBannedIngredients,
} = require('../utilities/profile/profile');

//Función para colocar en orden alfabético un array y quitar duplicados
function uniq(a) {
  return a.sort().filter(function (item, pos, ary) {
    return !pos || item != ary[pos - 1];
  });
}

const transformResult = (result, favs) => {
  const recipes = [];
  result.map((el) => {
    const recipe = {};
    if (el.IdTipo === 1) recipe.mainTitle = 'Aperitivos y tapas';
    else if (el.idCategoria === 2) recipe.type = 'Arroces y cereales';
    else if (el.idCategoria === 3) recipe.type = 'Carnes';
    else if (el.idCategoria === 5) recipe.type = 'Cocteles y bebidas';
    else if (el.idCategoria === 6) recipe.type = 'Ensaladas';
    else if (el.idCategoria === 7) recipe.type = 'Guisos y potajes';
    else if (el.idCategoria === 8) recipe.type = 'Huevos y lacteos';
    else if (el.idCategoria === 9) recipe.type = 'Legumbres';
    else if (el.idCategoria === 10) recipe.type = 'Mariscos';
    else if (el.idCategoria === 11) recipe.type = 'Pan y bollería';
    else if (el.idCategoria === 12) recipe.type = 'Pasta';
    else if (el.idCategoria === 13) recipe.type = 'Pescado';
    else if (el.idCategoria === 14) recipe.type = 'Postres';
    else if (el.idCategoria === 15) recipe.type = 'Salsas';
    else if (el.idCategoria === 16) recipe.type = 'Sopas y cremas';
    else if (el.idCategoria === 17) recipe.type = 'Verduras';

    recipe.title = el.Nombre;

    if (el.idTipo === 1) recipe.mainTitle = 'Desayuno';
    else if (el.idTipo === 2) recipe.mainTitle = 'Comida';
    else if (el.idTipo === 3) recipe.mainTitle = 'Cena';
    else recipe.mainTitle = 'Otros';

    if (el.idTiempo === 1) recipe.time = '10';
    if (el.idTiempo === 2) recipe.time = '15';
    if (el.idTiempo === 3) recipe.time = '30';

    recipe.img = el.Imagen;

    recipe.ingredients = el.ingredients.split(',');

    const prefs = el.prefs ? el.prefs.split(',') : [];

    if (prefs.includes('31')) recipe.price = 'Barato';
    else recipe.price = 'Medio';

    recipe.id = el.idReceta;

    recipe.fav = favs.filter((fav) => el.idReceta === recipe.id).length
      ? true
      : false;

    recipes.push(recipe);
  });

  return recipes;
};

const transformDetail = (result, favs) => {
  console.log('RESULT', result[0]);
  const recipe = {};
  recipe.title = result[0].Nombre;
  recipe.id = result[0].IdReceta;
  recipe.time = result[0].Tiempo;
  recipe.steps = result[0].pasos ? JSON.parse(result[0].pasos) : '';
  const prefs = result[0].prefs ? result[0].prefs.split(',') : [];

  if (prefs.includes('31')) recipe.costs = 'Barato';
  else recipe.costs = 'Medio';
  const recipes = [];
  Object.keys(recipe.steps).map(
    (step) => (recipes[parseInt(step) - 1] = recipe.steps[step]),
  );
  recipe.steps = recipes;

  recipe.ingredients = result[0].Ingredientes
    ? result[0].Ingredientes.split(',')
    : [];

  recipe.fav = favs.idReceta === recipe.id ? true: false;

  recipe.img = result[0].Imagen;

  return recipe;
};

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
      {
        id: 0,
        category: 'noFilter',
        title: 'Saltar',
        value: false,
      },
    ],
    bannedIngredients: [],
    categories: [
      {
        id: 91,
        category: 'national',
        title: 'De aquí',
        value: false,
      },
      {
        id: 203,
        category: 'international',
        title: 'De allá',
        value: false,
      },
      {
        id: 200,
        category: 'appetizer',
        title: 'Aperitivos y tapas',
        value: false,
      },
      {
        id: 201,
        category: 'soups',
        title: 'Sopas y cremas',
        value: false,
      },
      {
        id: 202,
        category: 'salads',
        title: 'Ensaladas',
        value: false,
      },
    ],
    cost: [
      {
        id: 31,
        category: 'cheap',
        title: 'Barato',
        value: false,
      },
      {
        id: 111,
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
        title: 'Comida',
        value: false,
      },
      {
        id: 3,
        category: 'dinner',
        title: 'Cena',
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
          return { idIngredient: el.idIngredient, title: el.Ingrediente };
        })
      : [];

    const newPreferences = {
      ...defaultPreferences,
      bannedCategories,
      bannedIngredients,
    };
    console.log('OK', newPreferences);
    res.json({
      OK: 1,
      searchPreferences: newPreferences,
      logged: true,
    });
  }
};

exports.search = async (req, res) => {
  const {
    ingredients,
    bannedCategories,
    bannedIngredients,
    categories,
    cost,
    time,
    daily,
  } = req.body;

  let sql = `SELECT DISTINCT tp.IdReceta AS idReceta, tp.idTipo as idTipo,
                    GROUP_CONCAT(DISTINCT ti.Ingrediente order by ti.Ingrediente ASC) as ingredients,
                    tp.Nombre as Nombre, tp.idCategoria as idCategoria,
                    tp.idTiempo as idTiempo, tp.Imagen as Imagen, GROUP_CONCAT(DISTINCT tpr.IdPreferencias) as prefs
             FROM TablaPrincipal AS tp
             JOIN TablaRecetaIngredientes AS tri
              	ON tp.IdReceta = tri.IdReceta
             JOIN TablaIngredientes AS ti
               	ON tri.IdIngrediente = ti.IdIngrediente
             JOIN TablaPreferenciasReceta AS tpr
                ON tp.IdReceta = tpr.IdReceta
             WHERE 1=1 `;

  const sqlArray = [];

  const sqlIngredients =
    ingredients.length !== 0
      ? `AND tp.IdReceta IN 
          (
	        SELECT DISTINCT tri2.IdReceta
               FROM TablaRecetaIngredientes AS tri2
               WHERE tri2.IdIngrediente IN (` +
        ingredients
          .map((el) => {
            sqlArray.push(el.idIngredient);
            return '?';
          })
          .join(',') +
        '))'
      : ' ';

  const sqlBannedIng =
    bannedIngredients.length !== 0
      ? `AND tp.IdReceta NOT IN 
          (
	        SELECT DISTINCT tri2.IdReceta
               FROM TablaRecetaIngredientes AS tri2
               WHERE tri2.IdIngrediente IN (` +
        bannedIngredients
          .map((el) => {
            sqlArray.push(el.idIngredient);
            return '?';
          })
          .join(',') +
        '))'
      : ' ';

  const sqlBannedCat =
    bannedCategories.filter((el) => el.value).length !== 0
      ? ' AND tp.IdCategoria NOT IN (' +
        bannedCategories
          .filter((el) => el.value)
          .map((el) => {
            sqlArray.push(el.id);
            return '?';
          })
          .join(',') +
        ') '
      : ' ';

  let sqlCost = '';
  const costSelection = cost.filter((el) => el.value);
  if (costSelection.length !== 0) {
    if (costSelection[0].id == 31) sqlCost += ',31';
    else if (costSelection[0].id == 111) sqlCost += ',31,111';
  }

  const sqlCategories =
    categories.filter((el) => el.value).length !== 0
      ? ' AND tpr.IdPreferencias IN (' +
        categories
          .filter((el) => el.value)
          .map((el) => {
            sqlArray.push(el.id);
            return '?';
          })
          .join(',') +
        sqlCost +
        ')'
      : ' ';

  let sqlTime = '';
  const timeSelection = time.filter((el) => el.value);
  if (timeSelection.length !== 0) {
    if (timeSelection[0].id == 1) sqlTime += ' AND tp.idTiempo = 1';
    if (timeSelection[0].id == 2) sqlTime += ' AND (tp.idTiempo IN (1,2))';
    if (timeSelection[0].id == 3) sqlTime += ' AND (tp.idTiempo IN (1,2,3))';
  }

  const sqlDaily =
    daily.filter((el) => el.value).length !== 0
      ? ' AND tp.idTipo IN (' +
        daily
          .filter((el) => el.value)
          .map((el) => {
            sqlArray.push(el.id);
            return '?';
          }) +
        ')'
      : ' ';

  sql +=
    sqlIngredients +
    sqlBannedIng +
    sqlBannedCat +
    sqlCategories +
    sqlTime +
    sqlDaily +
    'GROUP BY tp.IdReceta ORDER BY tp.IdReceta, ti.Ingrediente';

  console.log(sql, sqlArray);

  try {
    const result = await doQuery(sql, sqlArray);

    const recipes = transformResult(result, res.favs);

    //console.log('RESULT:', result);
    //console.log('RECIPES:', recipes);
    //console.log('FAVS', res.favs); //estos favoritos hay que unirlos con la búsqueda

    res.send({
      OK: 1,
      message: 'Búsqueda recetas',
      recipes: recipes,
    });
  } catch (error) {
    console.error('ERROR BUSQUEDA:', error);
    res.status(500).send({
      OK: 0,
      message: error.message,
    });
  }
};

exports.searchById = async (req, res) => {
  console.log('FAVS', res.favs); //estos favoritos hay que unirlos con la búsqueda

  const { id } = req.params;

  const sql = `SELECT tp.IdReceta, tt.Tiempo, tt.Tiempo, tp.Ingredientes, tp.Nombre, tp.Imagen,
               JSON_OBJECTAGG(tpa.Paso, tpa.Instruccion) as pasos, GROUP_CONCAT(DISTINCT tpa.Paso) as idPasos,
               GROUP_CONCAT(DISTINCT tpref.IdPreferencias) as prefs
                FROM TablaPrincipal AS tp
                INNER JOIN TablaTiempo AS tt
                  ON tp.IdTiempo = tt.IdTiempo
                INNER JOIN TablaPasos as tpa
                  ON tp.IdReceta = tpa.IdReceta
                INNER JOIN TablaPreferenciasReceta AS tpr
                  ON tp.IdReceta = tpr.IdReceta
                INNER JOIN TablaPreferencias as tpref
                  ON tpref.IdPreferencias = tpr.IdPreferencias
                WHERE tp.IdReceta = ? AND tpa.IdPaso<18328
                GROUP BY tp.IdReceta ORDER BY tpa.idPaso`;
  try {
    const result = await doQuery(sql, id);
    console.log(result);

    const recipe = transformDetail(result, res.favs);

    res.send({
      OK: 1,
      message: 'Detalle receta',
      recipe,
    });
  } catch (error) {
    res.status(500).send({
      OK: 0,
      message: error.message,
    });
  }
};
