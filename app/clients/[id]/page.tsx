import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  // 実際のアプリケーションでは、ここでIDを使用してデータを取得します
  const clientId = params.id

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
              <p className="mt-1">{clientId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">クライアント名</h3>
              <p className="mt-1">サンプルクライアント</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">業種</h3>
              <p className="mt-1">小売業</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">担当者</h3>
              <p className="mt-1">山田太郎</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">メールアドレス</h3>
              <p className="mt-1">yamada@example.com</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">電話番号</h3>
              <p className="mt-1">03-1234-5678</p>
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
            <div className="border rounded-md p-4">
              <h3 className="font-medium">2023年夏季プロジェクト</h3>
              <p className="text-sm text-gray-500">2023-06-01 〜 2023-08-31</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  アクティブ
                </span>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-medium">2023年冬季プロジェクト</h3>
              <p className="text-sm text-gray-500">2023-11-15 〜 2023-12-31</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  予定
                </span>
              </div>
            </div>
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
