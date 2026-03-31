export function InsightBanner({ message }: { message: string }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm">
      ⚠️ {message}
    </div>
  );
}