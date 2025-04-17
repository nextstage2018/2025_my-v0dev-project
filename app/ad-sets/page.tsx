import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash, Plus } from "lucide-react"

export default function AdSetsPage() {
  // サンプルデータ
  const adSets = [
    {
      id: "adset_123456",
      name: "メインターゲット広告セット",
      status: "ACTIVE",
      campaign: "夏季プロモーションキャンペーン",
      budget: "¥200,000",
      start_date: "2023-06-01",
      end_date: "2023-08-31",
      targeting: "18-35歳, 男女, 東京・大阪",
    },
    {
      id: "adset_234567",
      name: "若年層ターゲット広告セット",
      status: "ACTIVE",
      campaign: "新商品発売キャンペーン",
      budget: "¥300,000",
      start_date: "2023-07-15",
      end_date: "2023-09-15",
      targeting: "18-24歳, 女性, 全国",
    },
    {
      id: "adset_345678",
      name: "リターゲティング広告セット",
      status: "PAUSED",
      campaign: "年末セールキャンペーン",
      budget: "¥150,000",
      start_date: "2023-11-15",
      end_date: "2023-12-31",
      targeting: "過去30日間のサイト訪問者",
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">広告セット一覧</h1>
        <Link href="/ad-sets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規広告セット作成
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>広告セット</CardTitle>
          <CardDescription>登録されている広告セットの一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>広告セット名</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>キャンペーン</TableHead>
                <TableHead>予算</TableHead>
                <TableHead>期間</TableHead>
                <TableHead>ターゲティング</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adSets.map((adSet) => (
                <TableRow key={adSet.id}>
                  <TableCell className="font-medium">{adSet.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        adSet.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {adSet.status === "ACTIVE" ? "アクティブ" : "一時停止"}
                    </span>
                  </TableCell>
                  <TableCell>{adSet.campaign}</TableCell>
                  <TableCell>{adSet.budget}</TableCell>
                  <TableCell>
                    {adSet.start_date} 〜 {adSet.end_date}
                  </TableCell>
                  <TableCell>{adSet.targeting}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/ad-sets/${adSet.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/ad-sets/edit/${adSet.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
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
