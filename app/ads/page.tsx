import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash, Plus } from "lucide-react"

export default function AdsPage() {
  // サンプルデータ
  const ads = [
    {
      id: "ad_123456",
      name: "夏季キャンペーン広告",
      status: "ACTIVE",
      adset: "メインターゲット広告セット",
      impressions: 12345,
      clicks: 1234,
      ctr: "10.0%",
    },
    {
      id: "ad_234567",
      name: "新商品プロモーション",
      status: "ACTIVE",
      adset: "若年層ターゲット広告セット",
      impressions: 8765,
      clicks: 765,
      ctr: "8.7%",
    },
    {
      id: "ad_345678",
      name: "冬季セール告知",
      status: "PAUSED",
      adset: "リターゲティング広告セット",
      impressions: 5432,
      clicks: 432,
      ctr: "7.9%",
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">広告一覧</h1>
        <Link href="/ads/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規広告作成
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>広告</CardTitle>
          <CardDescription>登録されている広告の一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>広告名</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>広告セット</TableHead>
                <TableHead className="text-right">インプレッション</TableHead>
                <TableHead className="text-right">クリック数</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ad.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {ad.status === "ACTIVE" ? "アクティブ" : "一時停止"}
                    </span>
                  </TableCell>
                  <TableCell>{ad.adset}</TableCell>
                  <TableCell className="text-right">{ad.impressions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{ad.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{ad.ctr}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/ads/details?id=${ad.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
