import { fetchPizzaRestaurants } from "../../lib/pizza-restaurants";

const getPizzaRestaurantsByLocation = async (req, res) => {
  //configure latLong and limit
  try {
    const { latLong, limit } = req.query;
    const response = await fetchPizzaRestaurants(latLong, limit);
    res.status(200);
    res.json(response);
  } catch (err) {
    console.error("There is an error", err);
    res.status(500);
    res.json({ message: "Something went wrong", err });
  }
  //return
};
export default getPizzaRestaurantsByLocation;
