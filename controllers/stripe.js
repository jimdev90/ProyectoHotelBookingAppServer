import User from "../models/user";
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET);

export const createConnectAccount = async (req, res) => {
    console.log(req.headers.authorization);

    let user = await User.findById(req.auth._id).exec();
    if (!user.stripe_account_id) {
        const account = await stripe.accounts.create({
            type: 'express',
        });
        console.log("ACCOUNT =====>", account);
        user.stripe_account_id = account.id;
        user.save();
    }

    console.log(user);



   

   

    // try {




    // } catch (err) {
    //     console.log('LOGIN ERROR ', err)
    //     res.status(400).send('Inicio de sesión fallida');
    // }

}