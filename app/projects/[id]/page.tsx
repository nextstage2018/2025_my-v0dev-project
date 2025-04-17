import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  // 実際のアプリケーションでは、ここでIDを使用してデータを取得します
  const projectId = params.id

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
              <p className="mt-1">2023年夏季プロジェクト</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">クライアント</h3>
              <p className="mt-1">
                <Link href="/clients/client_123456" className="text-blue-600 hover:underline">
                  株式会社ABC
                </Link>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ステータス</h3>
              <p className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  アクティブ
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">期間</h3>
              <p className="mt-1">2023-06-01 〜 2023-08-31</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">説明</h3>
              <p className="mt-1">夏季プロモーションのためのプロジェクトです。</p>
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
            <div className="border rounded-md p-4">
              <h3 className="font-medium">夏季プロモーションキャンペーン</h3>
              <p className="text-sm text-gray-500">2023-06-01 〜 2023-08-31</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  アクティブ
                </span>
              </div>
            </div>
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
