import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckOutSession = async (id: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // check user
    const user = await tx.user.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        subscription: true,
      },
    });

    // old customer
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      // new customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;
    }

    // create session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: { userId: user.id },
    });
    // console.log("session", session);

    return session.url;
  });

  return {
    paymentUrl: transactionResult,
  };
};
export const subScriptionService = { createCheckOutSession };
