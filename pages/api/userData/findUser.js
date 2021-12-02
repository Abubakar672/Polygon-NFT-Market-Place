import clientPromise from "../../../utils/mongodb";

export default async function createUser(req, res) {
  const method = req.method;
  const { id } = req.query;

  try {
    const client = await clientPromise;

    const database = client.db("userData");
    const collection = await database.collection("profile");

    const query = {
      id: id,
    };

    const cursor = await collection.find(query);

    const result = await cursor.toArray();

    if (result.length === 0) {
      res.status(404).json({
        status: false,
      });
    } else {
      res.status(200).json({
        status: true,
        data: result,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
