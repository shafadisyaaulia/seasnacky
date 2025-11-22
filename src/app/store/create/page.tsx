import CreateStoreForm from "@/components/CreateStoreForm";
import { getAuthUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Buat Toko - SeaSnacky",
};

export default async function CreateStorePage() {
  const user = await getAuthUser();
  if (!user) {
    // redirect to login with next param
    redirect(`/user/login?next=/store/create`);
  }

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Buka Toko di SeaSnacky</h1>
      <p className="text-sm text-slate-600 mb-6">Isi data toko Anda agar bisa mulai menjual produk di marketplace.</p>
      <CreateStoreForm />
    </main>
  );
}
