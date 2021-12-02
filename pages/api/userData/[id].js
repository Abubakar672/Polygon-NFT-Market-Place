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
        res.status(500).json({ err: err.message });
      }

      if (files.image) {
        if (files.image.size > 5242880) {
          res.status(500).json({ err: "Image size is too big" });
        }
      }

      try {
        let imageData;

        if (files.image) {
          imageData = fs.readFileSync(files.image.filepath);
        }

        const database = client.db("userData");
        const collection = await database.collection("profile");

        const filter = {
          id: id,
        };

        let query;

        if (files.image) {
          query = {
            $set: {
              image: imageData,
              description: fields.description,
            },
          };
        } else {
          query = {
            $set: {
              description: fields.description,
            },
          };
        }

        const cursor = await collection.updateOne(filter, query);

        if (files.image) {
          await fs.unlinkSync(files.image.filepath);
        }

        return res.status(200).send({ message: "Profile Updated!" });
      } catch (err) {
        return res.status(500).json({ err: err.message });
      }
    });
  }
}
