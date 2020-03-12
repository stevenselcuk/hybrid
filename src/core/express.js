import { Router } from 'express';

import Aircraft from '~/app/aircraft/aircraft.route'
import User from '~/app/main/user/user.route'
import Auth from '~/app/main/auth/auth.route'

const router = Router();


router.use('/auth', Auth)
router.use('/user', User)
router.use('/aircraft', Aircraft)

router.use('*', (req, res) => {
  res.status(404).json({
    errors: {
      msg: 'ENDPOINT_NOT_FOUND'
    }
  })
})


export default router;
