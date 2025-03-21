import { Router } from 'express';

import accountRouter from './accountRoutes.js';
import topupRouter from './topUpRoutes.js';
import betRouter from './betRoutes.js';


const v1 = new Router();


// account
v1.use('/account', accountRouter);
v1.use('/topup', topupRouter);
v1.use('/bet', betRouter);




export default v1;