import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Tip from "@/models/Tip";
import { ArrowLeft, Eye, Calendar, User } from "lucide-react";

export default async function TipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  await connectDB();

  let tip = null;
  try {
    tip = await Tip.findOne({ slug, published: true }).lean();
    
    if (tip) {
      // Increment views
      await Tip.findByIdAndUpdate(tip._id, { $inc: { views: 1 } });
    }
  } catch (e) {
    console.error("Error fetching tip:", e);
  }

  if (!tip) {
    return notFound();
  }

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/tips"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span>Kembali ke Tips</span>
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Featured Image */}
          {tip.image ? (
            <div className="relative h-96 bg-gray-100">
              <img
                src={tip.image}
                alt={tip.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-96 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-32 h-32 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          )}

          <div className="p-8 sm:p-12">
            {/* Category Badge */}
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4 capitalize">
              {tip.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {tip.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{tip.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatDate(tip.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span>{tip.views} views</span>
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
              <p className="text-lg text-gray-700 italic">{tip.excerpt}</p>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {tip.content}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
