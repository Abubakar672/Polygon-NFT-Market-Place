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
      image: null,
      description: "Don't forget to write your own description!",
    };

    const cursor = await collection.insertOne(query);

    res.status(200).json({
      status: "success",
      data: cursor,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
