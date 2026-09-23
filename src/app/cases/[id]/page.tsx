import { redirect } from "next/navigation";

export default async function CaseRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const map: Record<string, string> = {
    c1: "maria-gonzalez",
    c2: "james-okafor",
    c3: "linh-tran",
  };
  redirect(`/clients/${map[id] ?? "maria-gonzalez"}`);
}
