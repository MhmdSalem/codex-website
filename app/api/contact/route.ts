import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { MessageModel } from "@/lib/db/models/message";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  locale?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { ok: false, error: "MISSING_FIELDS" },
        { status: 400 },
      );
    }
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { ok: false, error: "INVALID_EMAIL" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    await MessageModel.create({
      name: String(body.name).slice(0, 200),
      email: String(body.email).toLowerCase().slice(0, 200),
      phone: String(body.phone ?? "").slice(0, 50),
      company: String(body.company ?? "").slice(0, 200),
      service: String(body.service ?? "").slice(0, 100),
      message: String(body.message).slice(0, 5000),
      locale: body.locale === "en" ? "en" : "ar",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Codex contact] error:", error);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
