import express from 'express';

import {
  register,
  registrationOptions,
  authenticate,
  authenticationOptions,
} from '../controllers/WebAuthn.js';
const router = express.Router();

router.get('/registration-options', registrationOptions);
router.post('/register', register);
router.get('/authentication-options', authenticationOptions);
router.post('/authenticate', authenticate);

export default router;
