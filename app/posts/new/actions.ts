"use server";

import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

function isAllowedFileType(contentType: string): boolean {
  return contentType.startsWith("image/") || ALLOWED_MIME_TYPES.has(contentType);
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("You must be logged in to create a post");
  }

  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length > MAX_FILES) {
    throw new Error(`You can upload at most ${MAX_FILES} files`);
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`"${file.name}" exceeds the 4MB size limit`);
    }
    if (!isAllowedFileType(file.type)) {
      throw new Error(`"${file.name}" has an unsupported file type`);
    }
  }

  const attachments = await Promise.all(
    files.map(async (file) => {
      const safeName = sanitizeFileName(file.name);
      const blob = await put(`posts/${Date.now()}-${safeName}`, file, {
        access: "private",
        contentType: file.type,
      });

      return {
        // Store pathname for private get(); private blob URLs are not publicly readable
        url: blob.pathname,
        fileName: file.name,
        contentType: file.type,
        size: file.size,
      };
    })
  );

  await prisma.post.create({
    data: {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      authorId: session.user.id,
      attachments: {
        create: attachments,
      },
    },
  });

  redirect("/posts");
}
