//unsplash api
import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getPizzaPhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "pizza restaurant",
    perPage: 40,
  });
  //console.log(photos);
  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls["small"]);
};

const getUrlForPizzaRestaurants = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

export const fetchPizzaRestaurants = async (
  latLong = "43.65,-79.46",
  limit = 12
) => {
  const photos = await getPizzaPhotos();
  console.log("photos", photos);
  const response = await fetch(
    getUrlForPizzaRestaurants(latLong, "pizza", limit),
    {
      headers: {
        //Authorization: "fsq3VHQXUGR76m/ceMMqNY9Edy1h9AvjpvXwx9qU8kJgORA=",
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    }
  );

  //console.log("response", response);

  const data = await response.json();
  //console.log({ data });

  return (
    data?.results
      ?.map((venue, idx) => {
        //console.log({ idx, VenueName: venue.name, PhotoUrl: photos[idx] });
        const neighbourhood = venue.location.neighbourhood;
        return {
          id: venue.fsq_id,
          address: venue.location.address || "",
          name: venue.name,
          neighbourhood:
            (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) ||
            venue.location.cross_street ||
            "",
          imgUrl: photos[idx],
          distance: venue.distance,
        };
      })
      ?.sort((a, b) => a.distance - b.distance) || []
  );
};
