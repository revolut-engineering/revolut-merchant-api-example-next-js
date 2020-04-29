import Head from "next/head";
import Link from "next/link";
import "../styles.css";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>My Shop</title>
      </Head>
      <Link href="/">
        <h1>My Shop</h1>
      </Link>
      <Component {...pageProps} />
    </>
  );
}

export default App;
