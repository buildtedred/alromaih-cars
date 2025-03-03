import axios from "axios";
import { NextResponse } from "next/server";

// API Configurations
const GRAPHQL_API_URL = "https://xn--mgbml9eg4a.com/odooapi";
const API_KEY = "xuOvE2VqKlMRKXgUYXAMgOzp4go6sSYf"; // Replace with actual API Key

export async function GET() {
  try {
    const query = `
  query MyQuery {
  VehicleInformation (
          context: { langs: ["ar_001", "en_US"] }
        ) {
    id
    name
    slug
    avatar
    display_name
    mfg_year
    transmission
    seat_capacity
    fuel_tank_capacity
    power
    current_market_value
      vehicle_brand_id {
      id
      name
    }
    
    vehicle_fuel_type_id {
      id
      name
    }
    vehicle_specification_ids {
      id
      display_name
      used
    }
    vehicle_image_ids {
      id
      name
      # vehicle_image
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

    return NextResponse.json(response.data.data.VehicleInformation);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
