import axios from "axios";
import { NextResponse } from "next/server";

// API Configurations
const GRAPHQL_API_URL = "https://xn--mgbml9eg4a.com/odooapi";
const API_KEY = "xuOvE2VqKlMRKXgUYXAMgOzp4go6sSYf"; // Replace with actual API Key

export async function GET() {
  try {
    const query = `
      query MyQuery {
        ProductTemplate (
          context: { langs: ["ar_001", "en_US"] }
        ) {
          id
          name
          display_name
          image_1920
          list_price
          color
          model_id{
            name
          }
          year_ids{
            name
          }
             product_variant_ids {
      id
      name
      image_1920
      slug
        year_ids {
        id
        name
      }
          specification_ids {
        id
        name
        display_name
      }
    }
        }
      }
    `;


    const response = await axios.post(
      GRAPHQL_API_URL,
      { query },
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
