const {Router}=require('express')
const authController=require('../controllers/authController')
const router=Router()
const {requireAuth}=require('../middlewares/authmiddlewares')

router.post('/signup',authController.signup_Post)
router.post('/login',authController.login_Post)
router.get('/logout',authController.logout_Get)
router.post('/deleteAccount',requireAuth,authController.delAccount_Post)
router.post('/addAmount',requireAuth,authController.addAmount_Post)
router.post('/addItems',requireAuth,authController.addItems_Post)
router.get('/edit/:id',requireAuth,authController.edit_Get)
router.post('/edit/:id',requireAuth,authController.edit_Post)
router.get('/deleteItem/:id',requireAuth,authController.delItem_Get)
router.post('/save',requireAuth,authController.save_Post)
router.post('/help',requireAuth,authController.help_Post)
router.get('/clearFields',requireAuth,authController.clear_Get)
router.get('/history',requireAuth,authController.history_Get)
router.get('/view/:id',requireAuth,authController.view_Get)
router.get('/deleteBill/:id',requireAuth,authController.delBill_Get)

module.exports=router