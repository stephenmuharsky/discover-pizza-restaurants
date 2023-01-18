import "../styles/globals.css";
import StoreProvider from "../store/store-context";

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
      {/* <footer>
        <h2>Made by Stephen</h2>
      </footer> */}
    </StoreProvider>
  );
}

export default MyApp;
