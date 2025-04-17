import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"

export default function AdDetailsPage({ params }: { params: { id: string } }) {
  // 実際のアプリケーションでは、ここでIDを使用してデータを取得します
  const adId = params.id

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/ads">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            広告一覧に戻る
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">広告詳細</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>広告情報</CardTitle>
            <CardDescription>広告の基本情報</CardDescription>
          </div>
          <Link href={`/ads/edit/${adId}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              編集
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">広告ID</h3>
              <p className="mt-1">{adId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">広告名</h3>
              <p className="mt-1">サンプル広告キャンペーン</p>
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
              <h3 className="text-sm font-medium text-gray-500">広告セット</h3>
              <p className="mt-1">
                <Link href="/ad-sets" className="text-blue-600 hover:underline">
                  メインターゲット広告セット
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>クリエイティブ情報</CardTitle>
          <CardDescription>広告のクリエイティブ詳細</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">プレビュー</h3>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-64">
                <p className="text-gray-500">広告プレビュー</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">クリエイティブタイプ</h3>
              <p>画像広告</p>

              <h3 className="text-sm font-medium text-gray-500 mt-4 mb-2">タイトル</h3>
              <p>新商品発売中！</p>

              <h3 className="text-sm font-medium text-gray-500 mt-4 mb-2">説明文</h3>
              <p>今だけの特別価格でご提供中。この機会をお見逃しなく！ 詳細はこちらをクリック。</p>

              <h3 className="text-sm font-medium text-gray-500 mt-4 mb-2">リンク先URL</h3>
              <p className="text-blue-600">https://example.com/special-offer</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end space-x-2 w-full">
            <Button variant="outline">編集</Button>
            <Button variant="destructive">無効化</Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>パフォーマンス指標</CardTitle>
          <CardDescription>広告のパフォーマンス統計</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">インプレッション</h3>
              <p className="text-2xl font-bold mt-1">12,345</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">クリック数</h3>
              <p className="text-2xl font-bold mt-1">1,234</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">CTR</h3>
              <p className="text-2xl font-bold mt-1">10.0%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">コンバージョン</h3>
              <p className="text-2xl font-bold mt-1">123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
