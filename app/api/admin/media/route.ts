import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { MediaModel } from "@/lib/db/models/media";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const q = url.searchParams.get("q") ?? "";

  const filter: Record<string, unknown> = {};
  if (type === "image" || type === "video") filter.type = type;
  if (q) {
    filter.$or = [
      { originalName: { $regex: q, $options: "i" } },
      { alt: { $regex: q, $options: "i" } },
    ];
  }

  await connectToDatabase();
  const items = await MediaModel.find(filter).sort({ createdAt: -1 }).limit(200).lean();

  return NextResponse.json({
    items: items.map((m) => ({
      id: String(m._id),
      url: m.url,
      type: m.type,
      mimeType: m.mimeType,
      filename: m.filename,
      originalName: m.originalName,
      size: m.size,
      alt: m.alt,
      createdAt: m.createdAt,
    })),
  });
}
