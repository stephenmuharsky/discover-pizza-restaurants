import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

import cls from "classnames";

import styles from "../../styles/coffee-store.module.css";
import { fetchPizzaRestaurants } from "../../lib/pizza-restaurants";
import { StoreContext } from "../../store/store-context";
import { useContext, useEffect, useState } from "react";
import { isEmpty } from "../../utils";

import useSWR from "swr";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;

  const pizzaRestaurants = await fetchPizzaRestaurants();
  const findPizzaRestaurantById = pizzaRestaurants.find((pizzaRestaurant) => {
    return pizzaRestaurant.id.toString() === params.id;
  });

  return {
    props: {
      pizzaRestaurant: findPizzaRestaurantById ? findPizzaRestaurantById : {}, //dynamic id
    },
  };
}

export const fetcher = (url) => fetch(url).then((res) => res.json());

export async function getStaticPaths() {
  const pizzaRestaurants = await fetchPizzaRestaurants();

  const paths = pizzaRestaurants.map((pizzaRestaurant) => {
    return {
      params: {
        id: pizzaRestaurant.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const PizzaRestaurant = (initialProps) => {
  const router = useRouter();

  const id = router.query.id;

  const [pizzaRestaurant, setPizzaRestaurant] = useState(
    initialProps.coffeeStore || {}
  );

  const {
    state: { pizzaRestaurants },
  } = useContext(StoreContext);

  const handleCreatePizzaRestaurant = async (pizzaRestaurant) => {
    try {
      const { id, name, voting, imgUrl, neighbourhood, address } =
        pizzaRestaurant;
      const response = fetch("/api/createPizzaRestaurant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || "",
          address: address || "",
        }),
      });
      const dbPizzaRestaurant = await response;
    } catch (err) {
      console.error("error creating coffee store", err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.pizzaRestaurant)) {
      if (pizzaRestaurants.length > 0) {
        const pizzaRestaurantFromContext = pizzaRestaurants.find(
          (pizzaRestaurant) => {
            return pizzaRestaurant.id.toString() === id;
          }
        );
        if (pizzaRestaurantFromContext) {
          setPizzaRestaurant(pizzaRestaurantFromContext);
          handleCreatePizzaRestaurant(pizzaRestaurantFromContext);
        }
      }
    } else {
      ///SSG
      handleCreatePizzaRestaurant(initialProps.pizzaRestaurant);
    }
  }, [id, initialProps, initialProps.pizzaRestaurant]);

  const {
    address = "",
    name = "",
    neighbourhood = "",
    imgUrl = "",
  } = pizzaRestaurant;

  const { data, error } = useSWR(
    `/api/getPizzaRestaurantById?id=${id}`,
    fetcher
  );

  const [votingCount, setVotingCount] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      setPizzaRestaurant(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpvoteButton = async () => {
    try {
      const response = fetch("/api/favouritePizzaRestaurantById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const dbPizzaRestaurant = await response;
      if (dbPizzaRestaurant && dbPizzaRestaurant.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("error upvoting coffee store", err);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        ></link>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>🡨 Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width="24" height="24" />
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width="24" height="24" />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}

          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Upvote!
          </button>
        </div>
      </div>
    </div>
  );
};
export default PizzaRestaurant;
