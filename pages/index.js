import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";
import { fetchPizzaRestaurants } from "../lib/pizza-restaurants";
import useTrackLocation from "../hooks/use-track-location";
import { useEffect, useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

export async function getStaticProps(context) {
  const pizzaRestaurants = await fetchPizzaRestaurants();

  return {
    props: {
      pizzaRestaurants,
    },
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  //const [coffeeStores, setCoffeeStores] = useState("");
  const [pizzaRestaurantsError, setPizzaRestaurantsError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);

  const { pizzaRestaurants, latLong } = state;

  useEffect(() => {
    const fetchData = async () => {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getPizzaRestaurantsByLocation?latLong=${latLong}&limit=30`
          );

          const pizzaRestaurants = await response.json();
          //setCoffeeStores(fetchedCoffeeStores);
          dispatch({
            type: ACTION_TYPES.SET_PIZZA_RESTAURANTS,
            payload: {
              pizzaRestaurants: pizzaRestaurants,
            },
          });
          setPizzaRestaurantsError("");
          //set coffee stores
        } catch (error) {
          //set error
          console.log({ error });
          setPizzaRestaurantsError(error.message);
        }
      }
    };
    fetchData();
  }, [latLong]);
  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Pizza Hunter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />
        <div className={styles.heroImage}>
          <Image src="/static/pizza-emblem-11.png" width={700} height={400} />
        </div>
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {pizzaRestaurantsError && (
          <p>Something went wrong: {pizzaRestaurantsError}</p>
        )}
        {/* {console.log(pizzaRestaurants)}; */}
        {pizzaRestaurants.length > 0 && (
          <div className={styles.sectionWrapper}>
            {console.log(pizzaRestaurants)}
            <h2 className={styles.heading2}>Pizza Nearby</h2>
            <div className={styles.cardLayout}>
              {pizzaRestaurants.map((pizzaRestaurant) => {
                return (
                  <Card
                    name={pizzaRestaurant.name}
                    imgUrl={
                      pizzaRestaurant.imgUrl ||
                      "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                    }
                    href={`/pizza-restaurant/${pizzaRestaurant.id}`}
                    key={pizzaRestaurant.id}
                  />
                );
              })}
            </div>
          </div>
        )}
        {props.pizzaRestaurants.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto Pizza</h2>
            <div className={styles.cardLayout}>
              {props.pizzaRestaurants.map((pizzaRestaurant) => {
                return (
                  <Card
                    name={pizzaRestaurant.name}
                    imgUrl={
                      pizzaRestaurant.imgUrl ||
                      "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                    }
                    href={`/pizza-restaurant/${pizzaRestaurant.id}`}
                    key={pizzaRestaurant.id}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
