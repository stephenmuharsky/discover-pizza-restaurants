import {
  getMinifiedRecords,
  table,
  findRecordByFilter,
} from "../../lib/airtable";

const createPizzaRestaurant = async (req, res) => {
  console.log({ req });
  //findind a record
  if (req.method === "POST") {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          res.json(records);
        } else {
          //create a record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecords);
            res.json({ message: "create a record", records });
          } else {
            res.status(400);
            res.json({ message: "Name is missing" });
          }
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (err) {
      console.error("Error creating or finding restaurant", err);
      res.status(500);
      res.json({ message: "Error creating or finding restaurant", err });
    }
  }
};
export default createPizzaRestaurant;
