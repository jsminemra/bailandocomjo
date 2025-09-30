import { prisma } from '@/lib/prisma';

export default async function TestPage() {
  // Contar quantos usuários temos
  const userCount = await prisma.user.count();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste do Banco de Dados</h1>
      <p>Número de usuários: {userCount}</p>
      <p className="text-green-600">✅ Prisma funcionando!</p>
      <div className="mt-4">
        <a href="/" className="text-blue-500 underline">Voltar para home</a>
      </div>
    </div>
  );
}