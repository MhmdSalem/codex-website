import { connectToDatabase } from "@/lib/db/mongoose";
import { MediaModel } from "@/lib/db/models/media";
import { MediaGrid } from "./media-grid";
import { Uploader } from "./uploader";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await connectToDatabase();
  const docs = await MediaModel.find().sort({ createdAt: -1 }).limit(500).lean();

  const items = docs.map((m) => ({
    id: String(m._id),
    url: m.url,
    type: m.type,
    mimeType: m.mimeType,
    filename: m.filename,
    originalName: m.originalName,
    size: m.size,
    alt: m.alt ?? "",
    createdAt: (m.createdAt as Date).toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-admin-text">مكتبة الوسائط</h1>
          <p className="text-admin-muted mt-1 text-sm">
            ارفع الصور والفيديوهات هنا وانسخ الرابط لاستخدامه في المحتوى.
          </p>
        </div>
      </div>

      <Uploader />
      <MediaGrid initialItems={items} />
    </div>
  );
}
