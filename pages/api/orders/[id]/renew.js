import fetch from "isomorphic-fetch";
import { orders } from "../../../../db";

async function handleFinishOrder(req, res) {
  try {
    const order = await orders.get(req.query.id);
    const response = await fetch(
      `https://sandbox-merchant.revolut.com/api/1.0/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REVOLUT_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order.total)
      }
    );

    res.status(response.status);

    const payment = await response.json();

    await orders.put({ ...order, payment });

    res.json({ id: order._id });
  } catch (error) {
    console.error(error);

    res.json({
      error: "Payment renewal failed"
    });
  }
}

export default handleFinishOrder;
