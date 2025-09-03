import express from "express";
import { google, signin, signout, signup, verifyEmail } from "../controllers/auth.controller.js";
const router = express.Router();
import { adminSignin } from "../controllers/auth.controller.js";


router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get('/signout', signout)
router.get('/verify-email/:token', verifyEmail)
router.post("/admin-signin", adminSignin);

export default router;
