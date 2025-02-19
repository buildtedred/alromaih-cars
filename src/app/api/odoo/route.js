import axios from "axios";
import { NextResponse } from "next/server";

// API Configurations
const GRAPHQL_API_URL = "https://xn--mgbml9eg4a.com/odooapi";
const API_KEY = "xuOvE2VqKlMRKXgUYXAMgOzp4go6sSYf";  // Replace with actual API Key

export async function GET() {
  try {
    const query = `
      query MyQuery($offset: Int, $limit: Int, $order: String) {
        ProductTemplate(
          offset: $offset
          limit: $limit
          order: $order
        ) {
          id
          name
          image_1920
          list_price
          year_ids {
            name
          }
          product_variant_ids {
            name
          }
        }
      }
    `;

    const variables = { offset: 0, limit: 6, order: "name,id desc" };

    const response = await axios.post(
      GRAPHQL_API_URL,
      { query, variables },
      {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
    }

    return NextResponse.json(response.data.data.ProductTemplate);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
