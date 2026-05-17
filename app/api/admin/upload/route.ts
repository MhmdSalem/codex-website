import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { MediaModel } from "@/lib/db/models/media";
import {
  detectKind,
  isAllowed,
  maxSizeFor,
  saveBuffer,
} from "@/lib/media/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "NO_FILE" }, { status: 400 });
  }
  if (!isAllowed(file.type)) {
    return NextResponse.json(
      { error: "MIME_NOT_ALLOWED", mime: file.type },
      { status: 400 },
    );
  }
  const kind = detectKind(file.type);
  if (file.size > maxSizeFor(kind)) {
    return NextResponse.json(
      { error: "FILE_TOO_LARGE", max: maxSizeFor(kind) },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = await saveBuffer(buffer, file.name, file.type);

  await connectToDatabase();
  const doc = await MediaModel.create({
    filename: saved.filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url: saved.url,
    type: kind,
    alt,
    uploadedBy: session.sub,
  });

  return NextResponse.json({
    ok: true,
    media: {
      id: String(doc._id),
      url: doc.url,
      type: doc.type,
      mimeType: doc.mimeType,
      filename: doc.filename,
      originalName: doc.originalName,
      size: doc.size,
      alt: doc.alt,
      createdAt: doc.createdAt,
    },
  });
}
