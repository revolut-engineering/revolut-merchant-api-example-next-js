import Link from "next/link";

function SuccessPage() {
  return (
    <>
      <h2>
        <Link href="/">
          <a>Catalogue</a>
        </Link>
        {" / "}
        Confirmation
      </h2>
      <h3>Order successfully paid</h3>
    </>
  );
}

export default SuccessPage;
