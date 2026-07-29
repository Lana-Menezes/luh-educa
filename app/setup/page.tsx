import SetupInstructions from "./setup-instructions";

export default function SetupPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Bem-vindo à Luh Educa
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Sua plataforma de educação online está pronta para ser utilizada.
        </p>

        <SetupInstructions />
      </div>
    </div>
  );
}
