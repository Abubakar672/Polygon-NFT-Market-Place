import clientPromise from "../../../utils/mongodb";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function userHandler(req, res) {
  const method = req.method;
  const { id } = req.query;

  if (method === "POST") {
    const client = await clientPromise;
    const form = new formidable.IncomingForm();

    form.parse(req, async function (err, fields, files) {
      if (err) {
        res.status(500).json({ status: false, err: err.message });
      }

      if (files.image) {
        if (files.image.size > 1048576) {
          res.status(500).json({
            status: false,
            err: "Image size is too big. (Max size: 1MB)",
          });
        }
      }

      try {
        let imageData = fs.readFileSync(files.image.filepath);

        const database = client.db("userData");
        const collection = await database.collection("profile");

        const filter = {
          id: id,
        };

        let query = {
          $set: {
            image: imageData,
          },
        };

        const cursor = await collection.updateOne(filter, query);

        await fs.unlinkSync(files.image.filepath);

        return res
          .status(200)
          .send({ status: true, message: "Profile Picture Updated!" });
      } catch (err) {
        return res.status(500).json({ status: false, err: err.message });
      }
    });
  }
}
