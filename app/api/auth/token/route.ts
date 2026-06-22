import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Code parameter is required" },
        { status: 400 }
      );
    }

    const tokenUrl = `http://localhost:8088/realms/roomie/protocol/openid-connect/token`;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", "frontend-app");
    params.append("code", code);

    const response = await axios.post(tokenUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Keycloak OAuth token exchange proxy failed:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: error.message };
    return NextResponse.json(data, { status });
  }
}
