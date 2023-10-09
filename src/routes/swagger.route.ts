import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../documentation/swagger.json';

const router = Router();

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none } .try-out { display: none }',
  customSiteTitle: 'HelloBuddy API Documentation'
};

router.use(
  ['/documentation', '/docs'],
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default router;
