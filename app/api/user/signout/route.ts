import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json("User has been signed out", { status: 200 });
    res.cookies.delete("access_token");
    return res;
}
