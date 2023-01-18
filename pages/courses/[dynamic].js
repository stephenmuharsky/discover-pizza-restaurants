import { useRouter } from "next/router";
import Head from "next/head";

const Dynamic = () => {
  const router = useRouter();
  console.log("router:", router);

  return (
    <div>
      <Head>
        <title>{router.query.dynamic}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Page:{router.query.dynamic}
    </div>
  );
};

export default Dynamic;
