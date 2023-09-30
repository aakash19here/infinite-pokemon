import { Skeleton } from "./skeleton";

export default function CardSkeleton() {
  const SKELETONS = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="grid grid-col-1 md:grid-cols-3 gap-5">
      {SKELETONS?.map((id) => (
        <Skeleton key={id} className="w-[200px] h-[150px] bg-gray-600" />
      ))}
    </div>
  );
}
