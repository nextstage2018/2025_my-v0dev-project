import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import * as LocalStorage from "@/lib/local-storage"
import { notFound } from "next/navigation"

// このページがレンダリングされる前に実行される関数
export function generateStaticParams() {
  return []
}

// 動的パラメータの検証
export const dynamicParams = true

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  // "new"というIDの場合は404を返す
  if (params.id === "new") {
    return notFound()
  }

  // プロジェクトIDを取得
  const projectId = params.id

  // プロジェクト情報を取得
  const project = LocalStorage.getProjectById(projectId)

  // プロジェクトが見つからない場合
  if (!project) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center mb-6">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              プロジェクト一覧に戻る
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">プロジェクトが見つかりません</h1>
        </div>
        <Card>
          <CardContent className="py-10">
            <p className="text-center">指定されたIDのプロジェクトは存在しません。</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/projects">
              <Button>プロジェクト一覧に戻る</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            プロジェクト一覧に戻る
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">プロジェクト詳細</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>プロジェクト情報</CardTitle>
            <CardDescription>プロジェクトの基本情報</CardDescription>
          </div>
          <Link href={`/projects/edit/${projectId}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              編集
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">プロジェクトID</h3>
              <p className="mt-1">{projectId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">プロジェクト名</h3>
              <p className="mt-1">{project.project_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">クライアント</h3>
              <p className="mt-1">
                <Link href={`/clients/${project.client_id}`} className="text-blue-600 hover:underline">
                  {project.client_name}
                </Link>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ステータス</h3>
              <p className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : project.status === "SCHEDULED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {project.status === "ACTIVE"
                    ? "アクティブ"
                    : project.status === "SCHEDULED"
                      ? "予定"
                      : project.status === "COMPLETED"
                        ? "完了"
                        : "一時停止"}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">期間</h3>
              <p className="mt-1">
                {project.start_date ? new Date(project.start_date).toLocaleDateString() : "未設定"} 〜{" "}
                {project.end_date ? new Date(project.end_date).toLocaleDateString() : "未設定"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">説明</h3>
              <p className="mt-1">{project.description || "説明はありません。"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>キャンペーン一覧</CardTitle>
          <CardDescription>このプロジェクトに関連するキャンペーン</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {LocalStorage.getCampaignsByProjectId(projectId).length > 0 ? (
              LocalStorage.getCampaignsByProjectId(projectId).map((campaign) => (
                <div key={campaign.campaign_id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{campaign.campaign_name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(campaign.start_time).toLocaleDateString()} 〜{" "}
                        {campaign.end_time ? new Date(campaign.end_time).toLocaleDateString() : "未設定"}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            campaign.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : campaign.status === "SCHEDULED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {campaign.status === "ACTIVE"
                            ? "アクティブ"
                            : campaign.status === "SCHEDULED"
                              ? "予定"
                              : "一時停止"}
                        </span>
                      </div>
                    </div>
                    <Link href={`/campaigns/${campaign.campaign_id}`}>
                      <Button variant="outline" size="sm">
                        詳細
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">キャンペーンがありません。新規キャンペーンを作成してください。</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/campaigns/new?project_id=${projectId}`}>
            <Button>新規キャンペーン作成</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
