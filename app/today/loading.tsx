import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-6 pb-28 space-y-4">
      <Card className="h-14" />
      <Card className="h-40" />
      <Card className="h-44" />
      <Card className="h-44" />
      <Card className="h-36" />
    </main>
  );
}
