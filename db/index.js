import PouchDB from "pouchdb";
import MemoryAdapter from "pouchdb-adapter-memory";

PouchDB.plugin(MemoryAdapter);

export const orders = new PouchDB("orders", { adapter: "memory" });
export const goods = new PouchDB("goods", { adapter: "memory" });

goods.bulkDocs([
  { _id: "001", title: "Shoes", amount: 10000, currency: "GBP" },
  { _id: "002", title: "Backpack", amount: 25000, currency: "GBP" },
  { _id: "004", title: "Computer", amount: 250000, currency: "GBP" }
]);
