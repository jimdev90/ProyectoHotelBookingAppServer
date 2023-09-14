import User from "../models/user";
import Stripe from 'stripe';
import queryString from "query-string";

const stripe = Stripe(process.env.STRIPE_SECRET);

export const createConnectAccount = async (req, res) => {
    console.log(req.headers.authorization);

    let user = await User.findById(req.auth._id).exec();
    if (!user.stripe_account_id) {
        const account = await stripe.accounts.create({
            type: 'standard',
        });
        console.log("ACCOUNT =====>", account);
        user.stripe_account_id = account.id;
        user.save();
    }
    console.log('USER', user);
    let accountLink = await stripe.accountLinks.create({
        account: user.stripe_account_id,
        refresh_url: process.env.STRIPE_REDIRECT_URL,
        return_url:  process.env.STRIPE_REDIRECT_URL,
        type: 'account_onboarding'
    });

    // accountLink = Object.assign({
    //     'stripe_user[email]': user.email || undefined,
    // });

    // console.log('ACCOUNT_LINK', accountLink);

}