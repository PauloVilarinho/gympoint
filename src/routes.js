import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrdersController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.post('/students/:studentId/checkins', CheckinController.store);
routes.get('/students/:studentId/checkins', CheckinController.index);

routes.post('/students/:studentId/help-orders', HelpOrdersController.store);
routes.get('/students/:studentId/help-orders', HelpOrdersController.index);
routes.put('/help-orders/:helpOrderId/answer', HelpOrdersController.update);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

routes.post('/plans', PlanController.store);
routes.put('/plans/:planId', PlanController.update);
routes.get('/plans', PlanController.index);
routes.delete('/plans/:planId', PlanController.delete);

routes.post('/registrations', RegistrationController.store);
routes.put('/registrations/:registrationId', RegistrationController.update);
routes.get('/registrations', RegistrationController.index);
routes.delete('/registrations/:registrationId', RegistrationController.delete);

export default routes;
