import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash, Plus } from "lucide-react"

export default function CampaignsPage() {
  // サンプルデータ
  const campaigns = [
    {
      id: "campaign_123456",
      name: "夏季プロモーションキャンペーン",
      status: "ACTIVE",
      project: "2023年夏季プロジェクト",
      objective: "認知拡大",
      budget: "¥500,000",
      start_date: "2023-06-01",
      end_date: "2023-08-31",
    },
    {
      id: "campaign_234567",
      name: "新商品発売キャンペーン",
      status: "ACTIVE",
      project: "新商品プロジェクト",
      objective: "コンバージョン",
      budget: "¥1,000,000",
      start_date: "2023-07-15",
      end_date: "2023-09-15",
    },
    {
      id: "campaign_345678",
      name: "年末セールキャンペーン",
      status: "SCHEDULED",
      project: "2023年冬季プロジェクト",
      objective: "売上拡大",
      budget: "¥800,000",
      start_date: "2023-11-15",
      end_date: "2023-12-31",
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">キャンペーン一覧</h1>
        <Link href="/campaigns/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規キャンペーン作成
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>キャンペーン</CardTitle>
          <CardDescription>登録されているキャンペーンの一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>キャンペーン名</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>プロジェクト</TableHead>
                <TableHead>目的</TableHead>
                <TableHead>予算</TableHead>
                <TableHead>期間</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{campaign.project}</TableCell>
                  <TableCell>{campaign.objective}</TableCell>
                  <TableCell>{campaign.budget}</TableCell>
                  <TableCell>
                    {campaign.start_date} 〜 {campaign.end_date}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/campaigns/${campaign.id}`}>
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
