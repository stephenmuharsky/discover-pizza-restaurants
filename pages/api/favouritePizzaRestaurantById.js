import {
  findRecordByFilter,
  table,
  getMinifiedRecords,
} from "../../lib/airtable";

const favouritePizzaRestaurantById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          const record = records[0];

          const calculateVoting = parseInt(record.voting) + parseInt(1);

          //update records

          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            res.json(minifiedRecords);
          }
        } else {
          res.json({ message: "Pizza restaurant id doesn't exist", id });
        }
      } else {
        res.status(400);
        res.jsons({ message: "Id is missing" });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: "Error upvoting pizza restaurant", error });
    }
  }
};
export default favouritePizzaRestaurantById;
