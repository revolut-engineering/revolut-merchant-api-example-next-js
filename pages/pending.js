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
      <h3>Payment is pending approval</h3>
    </>
  );
}

export default SuccessPage;
