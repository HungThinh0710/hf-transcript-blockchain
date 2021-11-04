const express = require('express');
const router = express.Router();
const validatorMiddleware = require('../../middleware/Validator');
const authGuardMiddleware = require('../../middleware/AuthGuard');
const adminGuardMiddleware = require('../../middleware/AdminGuard');
const Schemas = require('../../libs/Schemas');
const tasksController = require('../../controllers/tasks-controller');

router.post('/new', validatorMiddleware(Schemas.tasks.object, 'body'),
  authGuardMiddleware, adminGuardMiddleware,
  tasksController.create);
router.get('/:prj_id/all',
  authGuardMiddleware,
  tasksController.readByProject);
router.put('/:tsk_id/upd', validatorMiddleware(Schemas.tasks.object, 'body'),
  authGuardMiddleware, adminGuardMiddleware,
  tasksController.update);
router.delete('/:tsk_id/del',
  authGuardMiddleware, adminGuardMiddleware,
  tasksController.delete);

module.exports = router;