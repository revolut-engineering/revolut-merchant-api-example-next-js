import fetch from "isomorphic-fetch";
import RevolutCheckout from '@revolut/checkout'
import Router from "next/router";
import Link from "next/link";
import { getData } from "country-list";

async function finishOrder(id) {
  const response = await fetch(`/api/orders/${id}/finish`, { method: "POST" });
  const order = await response.json();

  if (order.isCompleted) {
    Router.replace("/success");
  } else if (order.isFailed) {
    await renewOrder(id);
  } else {
    Router.replace(`/pending?order=${order.id}`);
  }
}

async function renewOrder(id) {
  const response = await fetch(`/api/orders/${id}/renew`, { method: "POST" });
  const order = await response.json();

  Router.replace(`/checkout?order=${order.id}`);
}

function CheckoutPage({ order }) {
  async function handleFormSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const RC = await RevolutCheckout(order.token, 'sandbox');

    RC.payWithPopup({
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      billingAddress: {
        countryCode: data.get("countryCode"),
        region: data.get("region"),
        city: data.get("city"),
        streetLine1: data.get("streetLine1"),
        streetLine2: data.get("streetLine2"),
        postcode: data.get("postcode")
      },
      onSuccess() {
        finishOrder(order.id);
      },
      onError() {
        renewOrder(order.id);
      },
      onCancel() {
        renewOrder(order.id);
      }
    });
  }

  if (order === null) {
    return (
      <>
        <h2>
          <Link href="/">
            <a>Catalogue</a>
          </Link>
          {" / "}
          Checkout
        </h2>
        <h3>Order not found</h3>
      </>
    );
  }

  return (
    <>
      <h2>
        <Link href={`/?order=${order.id}`}>
          <a>Catalogue</a>
        </Link>
        {" / "}
        Checkout ({order.cart.length})
      </h2>
      <form onSubmit={handleFormSubmit}>
        <fieldset>
          <legend>Contact</legend>
          <label>
            <div>Name</div>
            <input name="name" autoComplete="name" placeholder="Name" />
          </label>
          <label>
            <div>Email</div>
            <input name="email" autoComplete="email" placeholder="Email" />
          </label>
          <label>
            <div>Phone</div>
            <input name="phone" autoComplete="tel" placeholder="Phone" />
          </label>
        </fieldset>
        <fieldset>
          <legend>Billing Address</legend>
          <select name="countryCode" required defaultValue="">
            <option disabled value="">
              Select country
            </option>
            {getData().map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <label>
            <div>Region</div>
            <input
              name="region"
              autoComplete="address-level1"
              placeholder="Region"
            />
          </label>
          <label>
            <div>City</div>
            <input
              name="city"
              autoComplete="address-level2"
              placeholder="City"
              required
            />
          </label>
          <label>
            <div>Address line 1</div>
            <input
              name="streetLine1"
              autoComplete="address-line1"
              placeholder="Street, house number"
              required
            />
          </label>
          <label>
            <div>Address line 2</div>
            <input
              name="streetLine2"
              autoComplete="address-line2"
              placeholder="Appartment, building"
            />
          </label>
          <div>
            <div>Postal code</div>
            <input
              name="postcode"
              autoComplete="postal-code"
              placeholder="Postal code"
              required
            />
          </div>
        </fieldset>
        <button style={{ display: "block", margin: "1rem auto" }}>
          Pay{" "}
          {(order.total.amount / 100).toLocaleString("en", {
            style: "currency",
            currency: order.total.currency
          })}
        </button>
      </form>
    </>
  );
}

export async function getServerSideProps({ query, req }) {
  const baseUrl = `http://${req.headers.host}`;

  const response = await fetch(`${baseUrl}/api/orders/${query.order}`);
  const order = response.ok ? await response.json() : null;

  return {
    props: {
      order
    }
  };
}

export default CheckoutPage;
