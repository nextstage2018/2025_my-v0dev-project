import CampaignForm from "@/components/campaign-form"

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  return <CampaignForm campaignId={params.id} />
}
