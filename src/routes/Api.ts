// Dependencies
import { Router } from 'express';

// Controllers
import TestController from '../controllers/test-controller';

const router = Router();

router.post('/test', TestController.perform);

export default router;
