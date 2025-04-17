import AdForm from "@/components/ad-form"

export default function EditAdPage({ params }: { params: { id: string } }) {
  return <AdForm adId={params.id} />
}
