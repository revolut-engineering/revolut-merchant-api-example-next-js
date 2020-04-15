import fetch from "isomorphic-fetch";
import { goods, orders } from "../../../db";

function calculateTotal(cart) {
  return cart.reduce(
    (acc, item) => ({
      description:
        acc.description === null
          ? item.title
          : `${acc.description}, ${item.title}`,
      amount: acc.amount + item.amount,
      currency: item.currency
    }),
    {
      description: null,
      amount: 0,
      currency: null
    }
  );
}

async function handleCreateOrder(req, res) {
  try {
    const goodsList = await goods.bulkGet({
      docs: req.body.cart.map(id => ({ id }))
    });
    const cart = goodsList.results.map(item => item.docs[0].ok);
    const total = calculateTotal(cart);

    const payload = {
      // capture_mode: `MANUAL` /** Manually confirm payment in the merchant dashboard */,
      // settlement_currency: `USD` /** Automatically exchange payment to desired currency */,
      ...total
    };

    const response = await fetch(
      `https://sandbox-merchant.revolut.com/api/1.0/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REVOLUT_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    res.status(response.status);

    const payment = await response.json();
    const order = await orders.post({
      payment,
      isCompleted: false,
      isFailed: false,
      cart,
      total
    });

    res.json({ id: order.id });
  } catch (error) {
    console.error(error);
    res.json({
      error: "Order creation failed"
    });
  }
}

export default handleCreateOrder;
