// app/api/auth/rejected/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(
    "https://youtu.be/kIte0CuJZ5E?si=Ed7GbtKm4VBiZ7Ks",
  );
}
