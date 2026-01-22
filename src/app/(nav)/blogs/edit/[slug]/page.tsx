import { getBlogBySlug } from "@/lib/blogs";
import { notFound } from "next/navigation";
import EditForm from "@/app/(nav)/blogs/edit/EditForm";

export default async function EditPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Edit Post</h2>
      <EditForm post={post} />
    </div>
  );
}
