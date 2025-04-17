import AdSetForm from "@/components/ad-set-form"

export default function EditAdSetPage({ params }: { params: { id: string } }) {
  return <AdSetForm adSetId={params.id} />
}
