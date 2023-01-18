const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
});
const base = Airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE);

const table = base("pizza-restaurants");

const getMinifiedRecord = (record) => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

const getMinifiedRecords = (records) => {
  return (records = records.map((record) => getMinifiedRecord(record)));
};

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();
  return getMinifiedRecords(findCoffeeStoreRecords);
};

export { table, getMinifiedRecords, findRecordByFilter };
