import express from "express";
//Controladores
import {createConnectAccount} from "../controllers/stripe";
import { requireSignin } from "../middlewares";

const router = express.Router()


router.post('/create-connect-account', requireSignin, createConnectAccount)


module.exports = router