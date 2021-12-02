import clientPromise from "../../../utils/mongodb";

export default async function userHandler(req, res) {
  const method = req.method;
  const { id } = req.query;
  const { description } = JSON.parse(req.body);

  if (method === "POST") {
    const client = await clientPromise;

    try {
      const database = client.db("userData");
      const collection = await database.collection("profile");

      const filter = {
        id: id,
      };

      let query = {
        $set: {
          description: description,
        },
      };

      const cursor = await collection.updateOne(filter, query);

      return res
        .status(200)
        .send({ status: true, message: "Profile Updated!", cursor });
    } catch (err) {
      return res.status(500).json({ status: false, err: err.message });
    }
  }
}
