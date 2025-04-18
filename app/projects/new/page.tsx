"use client"

import { useSearchParams } from "next/navigation"
import ProjectForm from "@/components/project-form"

export default function NewProjectPage() {
  const searchParams = useSearchParams()
  // クエリパラメータからclient_idを取得
  const clientId = searchParams.get("client_id") || ""

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">新規プロジェクト作成</h1>
      <ProjectForm initialClientId={clientId} />
    </div>
  )
}
