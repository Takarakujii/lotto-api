import { Router } from 'express';

import accountRouter from './accountRoutes.js';
import topupRouter from './topUpRoutes.js';


const v1 = new Router();


// account
v1.use('/account', accountRouter);
v1.use('/topup', topupRouter);




export default v1;