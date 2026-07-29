"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content?: string;
  createdAt: string;
  author?: {
    name: string;
  };
}

// Disable static generation
export const dynamic = "force-dynamic";

function PostsList() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts?page=${page}`);
        if (!res.ok) {
          throw new Error("Falha ao carregar avaliações");
        }
        const data = await res.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [page]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2 min-h-[200px]">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <p className="text-gray-600">Nenhuma avaliação disponível.</p>
          ) : (
            <ul className="space-y-6 w-full max-w-4xl mx-auto">
              {posts.map((post) => (
                <li key={post.id} className="border p-6 rounded-lg shadow-md bg-white">
                  <Link href={`/posts/${post.id}`} className="text-2xl font-semibold text-gray-900 hover:underline">
                    {post.title}
                  </Link>
                  <p className="text-sm text-gray-500">por {post.author?.name || "Anônimo"}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center space-x-4 mt-8">
            {page > 1 && (
              <Link href={`/posts?page=${page - 1}`}>
                <button className="px-4 py-2 bg-gray-200 rounded-sm hover:bg-gray-300">Anterior</button>
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/posts?page=${page + 1}`}>
                <button className="px-4 py-2 bg-gray-200 rounded-sm hover:bg-gray-300">Próxima</button>
              </Link>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default function PostsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-start overflow-y-auto bg-gray-50 p-8">
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3 text-gray-600">Carregando página...</p>
          </div>
        }
      >
        <PostsList />
      </Suspense>
    </div>
  );
}
