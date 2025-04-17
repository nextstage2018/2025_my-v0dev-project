import ClientForm from "@/components/client-form"

export default function EditClientPage({ params }: { params: { id: string } }) {
  return <ClientForm clientId={params.id} />
}
