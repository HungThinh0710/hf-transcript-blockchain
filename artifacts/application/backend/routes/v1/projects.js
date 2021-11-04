const express = require('express');
const router = express.Router();
const validatorMiddleware = require('../../middleware/Validator');
const authGuardMiddleware = require('../../middleware/AuthGuard');
const Schemas = require('../../libs/Schemas');
const projectsController = require('../../controllers/projects-controller');

router.post('/new', validatorMiddleware(Schemas.projects.object, 'body'),
  authGuardMiddleware,
  projectsController.create);
router.get('/all',
  authGuardMiddleware,
  projectsController.readAll);
router.put('/:id/upd', validatorMiddleware(Schemas.projects.object, 'body'),
  authGuardMiddleware,
  projectsController.update);
router.delete('/:id/del',
  authGuardMiddleware,
  projectsController.delete);

module.exports = router;