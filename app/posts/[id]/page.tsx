export const dynamic = "force-dynamic"; // This disables SSG and ISR

import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function attachmentHref(id: number): string {
  return `/api/attachments/${id}`;
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = parseInt(id);

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      attachments: true,
    },
  });

  if (!post) {
    notFound();
  }

  const imageAttachments = post.attachments.filter((a) =>
    a.contentType.startsWith("image/")
  );
  const otherAttachments = post.attachments.filter(
    (a) => !a.contentType.startsWith("image/")
  );

  // Server action to delete the post
  async function deletePost() {
    "use server";

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    redirect("/posts");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <article className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Post Title */}
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Author Information */}
        <p className="text-lg text-gray-600 mb-4">
          por <span className="font-medium text-gray-800">{post.author?.name || "Anônimo"}</span>
        </p>

        {/* Content Section */}
        <div className="text-lg text-gray-800 leading-relaxed space-y-6 border-t pt-6">
          {post.content ? (
            <p>{post.content}</p>
          ) : (
            <p className="italic text-gray-500">Nenhum conteúdo disponível para esta avaliação.</p>
          )}
        </div>

        {imageAttachments.length > 0 && (
          <div className="mt-8 space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900">Imagens</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {imageAttachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachmentHref(attachment.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-lg border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={attachmentHref(attachment.id)}
                    alt={attachment.fileName}
                    className="h-auto w-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {otherAttachments.length > 0 && (
          <div className="mt-8 space-y-3 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900">Arquivos</h2>
            <ul className="space-y-2">
              {otherAttachments.map((attachment) => (
                <li key={attachment.id}>
                  <a
                    href={attachmentHref(attachment.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border px-4 py-3 text-blue-600 hover:bg-blue-50"
                  >
                    <span className="truncate font-medium">{attachment.fileName}</span>
                    <span className="ml-4 shrink-0 text-sm text-gray-500">
                      {formatFileSize(attachment.size)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {/* Delete Button */}
      <form action={deletePost} className="mt-6">
        <button
          type="submit"
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          Excluir avaliação
        </button>
      </form>
    </div>
  );
}
