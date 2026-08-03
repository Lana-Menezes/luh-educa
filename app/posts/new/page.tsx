"use client";

import Form from "next/form";
import { createPost } from "./actions";

export default function NewPost() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nova avaliação</h1>
      <Form action={createPost} className="space-y-6">
        <div>
          <label htmlFor="title" className="flex text-lg font-medium mb-2 items-center">
            Título
            <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
              Obrigatório
            </span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="Digite o título da avaliação..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-lg font-medium mb-2">Conteúdo</label>
          <textarea
            id="content"
            name="content"
            placeholder="Escreva o conteúdo da avaliação aqui..."
            rows={6}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="files" className="block text-lg font-medium mb-2">
            Anexos
          </label>
          <input
            type="file"
            id="files"
            name="files"
            multiple
            className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-soft file:text-brand hover:file:bg-brand-muted"
          />
          <p className="mt-2 text-sm text-gray-500">
            Até 5 arquivos, 4MB cada. Imagens, PDF, texto e documentos Office comuns.
          </p>
        </div>
        <button type="submit" className="w-full bg-brand text-white py-3 rounded-lg hover:bg-brand-hover">
          Criar avaliação
        </button>
      </Form>
    </div>
  );
}
