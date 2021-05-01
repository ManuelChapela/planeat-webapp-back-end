const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

//OK
router.post('/signup', loginController.signUp);

//OK
router.post('/login', loginController.login);

//OK
router
  .route('/logout')
  .get(loginController.authUser)
  .get(loginController.logout);

//OK
router.post('/newpass', loginController.newPass);
//OK
router.post('/changepass', loginController.changePass);

//OK
router
  .route('/authuser')
  .get(loginController.authUser)
  //si pasa la autenticación devolvemos que todo ha ido bien
  .get((req, res) => {
    res.send({
      OK: 1,
      message: 'authorized user',
    });
  });




//TODO: Modificar y dejar la funcionalidad necesaria para el OAUTH de google
//endpoint para pasar a back el código de solo un uso
//del OAuth de google
router.route('/google-oauth').get(loginController.googleOAuth);
//endpoint para generar link de OAuth Google
router.get('/google-link/:action', loginController.googleLink);
module.exports = router;

router.post('/vincular', loginController.vincularGoogle);
