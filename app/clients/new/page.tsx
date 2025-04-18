import ClientForm from "@/components/client-form"

export default function NewClientPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">新規クライアント登録</h1>
      <ClientForm />
    </div>
  )
}
