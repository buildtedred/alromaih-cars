import axios from "axios";
import { NextResponse } from "next/server";

const GRAPHQL_API_URL = "https://xn--mgbml9eg4a.com/odooapi";
const API_KEY = "xuOvE2VqKlMRKXgUYXAMgOzp4go6sSYf"; // Replace with actual API Key

export async function GET(req, { params }) {
    try {
        const slug = params.slug;
        console.log('backend slug', slug)

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const query = `
          query MyQuery {
  VehicleInformation (
          domain: [["slug", "=", "${slug}"]],
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
    condition
    vehicle_color
    date_of_registration
    
    
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
      vehicle_image
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
        console.error("Error fetching brand by slug:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
