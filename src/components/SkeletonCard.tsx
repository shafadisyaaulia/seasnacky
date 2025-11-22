export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="w-full h-44 bg-gray-100 skeleton"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 skeleton" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4 skeleton" />
        <div className="h-8 bg-gray-200 rounded w-full skeleton" />
      </div>
    </div>
  );
}
