import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import * as LocalStorage from "@/lib/local-storage"

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  // クライアントIDを取得
  const clientId = params.id

  // クライアント情報を取得
  const client = LocalStorage.getClientById(clientId) || {
    client_id: clientId,
    client_name: "クライアントが見つかりません",
    industry_category: "",
    contact_person: "",
    email: "",
    phone: "",
    created_at: "",
    updated_at: "",
  }

  // クライアントに関連するプロジェクトを取得
  const projects = LocalStorage.getProjectsByClientId(clientId)

  // 業種名を取得する関数
  const getIndustryName = (industryCode: string | undefined) => {
    switch (industryCode) {
      case "retail":
        return "小売業"
      case "it":
        return "IT・通信"
      case "manufacturing":
        return "製造業"
      case "finance":
        return "金融・保険"
      case "service":
        return "サービス業"
      default:
        return "その他"
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/clients">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            クライアント一覧に戻る
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">クライアント詳細</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>クライアント情報</CardTitle>
            <CardDescription>クライアントの基本情報</CardDescription>
          </div>
          <Link href={`/clients/edit/${clientId}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              編集
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">クライアントID</h3>
              <p className="mt-1">{client.client_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">クライアント名</h3>
              <p className="mt-1">{client.client_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">業種</h3>
              <p className="mt-1">{getIndustryName(client.industry_category)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">担当者</h3>
              <p className="mt-1">{client.contact_person}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">メールアドレス</h3>
              <p className="mt-1">{client.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">電話番号</h3>
              <p className="mt-1">{client.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>プロジェクト一覧</CardTitle>
          <CardDescription>このクライアントに関連するプロジェクト</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.project_id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{project.project_name}</h3>
                      <p className="text-sm text-gray-500">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : ""}
                        {" 〜 "}
                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : "未設定"}
                      </p>
                      <div className="mt-2">
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
                              : "一時停止"}
                        </span>
                      </div>
                    </div>
                    <Link href={`/projects/${project.project_id}`}>
                      <Button variant="outline" size="sm">
                        詳細
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">プロジェクトがありません。新規プロジェクトを作成してください。</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/projects/new?client_id=${clientId}`}>
            <Button>新規プロジェクト作成</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
