import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/student', StudentController.store);
routes.put('/student', StudentController.update);

routes.post('/plan', PlanController.store);
routes.put('/plan/:planId', PlanController.update);
routes.get('/plan', PlanController.index);
routes.delete('/plan/:planId', PlanController.delete);

routes.post('/registration', RegistrationController.store);
routes.put('/registration/:registrationId', RegistrationController.update);
routes.get('/registration', RegistrationController.index);
routes.delete('/registration/:registrationId', RegistrationController.delete);

export default routes;
