import { connectToDatabase } from "@/lib/db/mongoose";
import { MessageModel } from "@/lib/db/models/message";
import { MessagesList } from "./messages-list";

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = searchParams.tab === "archived" ? "archived" : "inbox";

  await connectToDatabase();
  const filter = tab === "archived" ? { archived: true } : { archived: false };
  const docs = await MessageModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  const messages = docs.map((m) => ({
    id: String(m._id),
    name: m.name,
    email: m.email,
    phone: m.phone ?? "",
    company: m.company ?? "",
    service: m.service ?? "",
    message: m.message,
    locale: m.locale ?? "ar",
    read: !!m.read,
    archived: !!m.archived,
    createdAt: (m.createdAt as Date).toISOString(),
  }));

  const counts = await Promise.all([
    MessageModel.countDocuments({ archived: false }),
    MessageModel.countDocuments({ archived: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-admin-text">
          الرسائل الواردة
        </h1>
        <p className="text-admin-muted mt-1 text-sm">
          الرسائل اللي وصلتك من نموذج التواصل في الموقع.
        </p>
      </div>
      <MessagesList
        messages={messages}
        tab={tab}
        counts={{ inbox: counts[0], archived: counts[1] }}
      />
    </div>
  );
}
