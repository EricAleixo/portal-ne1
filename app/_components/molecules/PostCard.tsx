import { PostWithRelations } from "@/app/_types/Post";
import Link from "next/link";
import Image from "next/image";
import { Newspaper } from "lucide-react";

export const PostCard = ({ post }: { post: PostWithRelations }) => {
  const categoryColor = post.category?.color || "#283583";

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {post.photoUrl ? (
          <Image
            width={1200}
            height={1200}
            src={post.photoUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Newspaper className="w-20 h-20 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        <h4 style={{color: post.category.color}} className="mt-3 font-semibold">{post.category.name.toUpperCase()}</h4>
        <h3 style={{margin: "4px 0 0 0"}} className="text-sm font-black text-gray-900 group-hover:text-[#C4161C] transition-colors">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}