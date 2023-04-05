import Link from "next/link";
import Image from "next/image";
import styles from "../styles/card.module.css";
import cls from "classnames";
const Card = (props) => {
  function distanceConvert(distance) {
    const distanceInKm = distance / 1000;
    const greaterThanOne = false;
    distanceInKm < 1 ? (greaterThanOne = true) : (greaterThanOne = false);
    if (greaterThanOne == true) {
      return "< 1km away";
    }
    distanceInKm = Math.round(distanceInKm);
    return distanceInKm.toString() + " km away";
  }
  return (
    <Link href={props.href}>
      <a className={styles.cardLink}>
        <div className={cls("glass", styles.container)}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
            <p>{props.distance ? distanceConvert(props.distance) : ""}</p>
          </div>
          <div className={styles.cardHeaderWrapper}>
            <Image
              className={styles.cardImage}
              src={props.imgUrl}
              width={260}
              height={160}
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
