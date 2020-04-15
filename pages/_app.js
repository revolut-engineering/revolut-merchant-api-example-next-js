import Head from "next/head";
import Link from "next/link";
import "../styles.css";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>My Shop</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(e,o,n){e[n]=function(t){var r=o.createElement("script");r.id="revolut-checkout",r.src="https://sandbox-merchant.revolut.com/embed.js",r.async=!0,o.head.appendChild(r);var c={then:function(c,i){r.onload=function(){c(e[n](t))},r.onerror=function(){o.head.removeChild(r),i&&i(new Error(n+" is failed to load"))}}};return"function"==typeof Promise?Promise.resolve(c):c}}(window,document,"RevolutCheckout");`
          }}
        />
      </Head>
      <Link href="/">
        <h1>My Shop</h1>
      </Link>
      <Component {...pageProps} />
    </>
  );
}

export default App;
