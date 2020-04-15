import { goods } from "../../../db";

async function handleGoods(req, res) {
  try {
    const result = await goods.allDocs({
      include_docs: true
    });

    if (result.total_rows === 0) {
      res.status(404);
    }

    res.json(
      result.rows.map(row => ({
        id: row.doc._id,
        title: row.doc.title,
        amount: row.doc.amount,
        currency: row.doc.currency
      }))
    );
  } catch (error) {
    console.error(error);

    res.status(error.status || 500);
    res.json({
      error: "Something went wrong"
    });
  }
}

export default handleGoods;
