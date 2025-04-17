import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
  // 実際のアプリケーションでは、ここでIDを使用してデータを取得します
  const campaignId = params.id

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/campaigns">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            キャンペーン一覧に戻る
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">キャンペーン詳細</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>キャンペーン情報</CardTitle>
            <CardDescription>キャンペーンの基本情報</CardDescription>
          </div>
          <Link href={`/campaigns/edit/${campaignId}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              編集
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">キャンペーンID</h3>
              <p className="mt-1">{campaignId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">キャンペーン名</h3>
              <p className="mt-1">夏季プロモーションキャンペーン</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">プロジェクト</h3>
              <p className="mt-1">
                <Link href="/projects/project_123456" className="text-blue-600 hover:underline">
                  2023年夏季プロジェクト
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
              <h3 className="text-sm font-medium text-gray-500">目的</h3>
              <p className="mt-1">認知拡大</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">予算</h3>
              <p className="mt-1">日予算: ¥20,000</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">期間</h3>
              <p className="mt-1">2023-06-01 〜 2023-08-31</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>広告セット一覧</CardTitle>
          <CardDescription>このキャンペーンに関連する広告セット</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium">メインターゲット広告セット</h3>
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
          <Link href={`/ad-sets/new?campaign_id=${campaignId}`}>
            <Button>新規広告セット作成</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
