const express = require('express');
const router = express.Router();
const validatorMiddleware = require('../../middleware/Validator');
const authGuardMiddleware = require('../../middleware/AuthGuard');
const adminGuardMiddleware = require('../../middleware/AdminGuard');
const Schemas = require('../../libs/Schemas');
const usersController = require('../../controllers/users-controller');

router.post('/auth', validatorMiddleware(Schemas.users.credential, 'body'),
  usersController.authen);
router.post('/new', validatorMiddleware(Schemas.users.object, 'body'),
  authGuardMiddleware, adminGuardMiddleware,
  usersController.create);
router.get('/all',
  authGuardMiddleware, adminGuardMiddleware,
  usersController.readAll);
router.put('/:id/upd', validatorMiddleware(Schemas.users.object, 'body'),
  authGuardMiddleware, adminGuardMiddleware,
  usersController.update);
router.delete('/:id/del',
  authGuardMiddleware, adminGuardMiddleware,
  usersController.delete);

module.exports = router;