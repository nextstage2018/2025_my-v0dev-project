"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash, Plus } from "lucide-react"
import * as LocalStorage from "@/lib/local-storage"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function CampaignsPage() {
  // ダミーキャンペーンデータ（命名規則に従ったID）
  const dummyCampaigns = [
    {
      campaign_id: "cl00001_pr00001_ca00001",
      project_id: "cl00001_pr00001",
      project_name: "2023年夏季プロジェクト",
      campaign_name: "夏季プロモーションキャンペーン",
      objective: "AWARENESS",
      special_ad_category: "NONE",
      status: "ACTIVE",
      daily_budget: "20000",
      lifetime_budget: "",
      start_time: "2023-06-01T00:00:00.000Z",
      end_time: "2023-08-31T23:59:59.000Z",
      created_at: "2023-05-15T10:30:00.000Z",
      updated_at: "2023-05-20T15:45:00.000Z",
    },
    {
      campaign_id: "cl00002_pr00001_ca00001",
      project_id: "cl00002_pr00001",
      project_name: "2023年秋季キャンペーン",
      campaign_name: "秋季販売促進キャンペーン",
      objective: "CONVERSIONS",
      special_ad_category: "NONE",
      status: "SCHEDULED",
      daily_budget: "",
      lifetime_budget: "500000",
      start_time: "2023-09-01T00:00:00.000Z",
      end_time: "2023-11-30T23:59:59.000Z",
      created_at: "2023-07-10T09:15:00.000Z",
      updated_at: "2023-07-15T14:20:00.000Z",
    },
    {
      campaign_id: "cl00003_pr00001_ca00001",
      project_id: "cl00003_pr00001",
      project_name: "年末特別プロモーション",
      campaign_name: "年末セールキャンペーン",
      objective: "SALES",
      special_ad_category: "NONE",
      status: "PAUSED",
      daily_budget: "30000",
      lifetime_budget: "",
      start_time: "2023-12-01T00:00:00.000Z",
      end_time: "2023-12-31T23:59:59.000Z",
      created_at: "2023-10-05T11:45:00.000Z",
      updated_at: "2023-10-10T16:30:00.000Z",
    },
  ]

  const [campaigns, setCampaigns] = useState<LocalStorage.Campaign[]>(() => {
    // キャンペーンデータをローカルストレージから取得
    if (typeof window !== "undefined") {
      const storedCampaigns = LocalStorage.getCampaigns()
      // ローカルストレージにデータがない場合はダミーデータを使用
      return storedCampaigns.length > 0 ? storedCampaigns : dummyCampaigns
    }
    return dummyCampaigns
  })

  // ダミーデータをローカルストレージに保存（初回のみ）
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCampaigns = LocalStorage.getCampaigns()
      if (storedCampaigns.length === 0) {
        dummyCampaigns.forEach((campaign) => {
          LocalStorage.saveCampaign(campaign)
        })
      }
    }
  }, [])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  // 削除ダイアログを開く
  const openDeleteDialog = (campaignId: string) => {
    setCampaignToDelete(campaignId)
    setDeleteDialogOpen(true)
  }

  // キャンペーンを削除
  const deleteCampaign = () => {
    if (campaignToDelete) {
      try {
        LocalStorage.deleteCampaign(campaignToDelete)
        setCampaigns(campaigns.filter((campaign) => campaign.campaign_id !== campaignToDelete))
        toast({
          title: "削除完了",
          description: "キャンペーンを削除しました。",
        })
      } catch (error) {
        console.error("削除エラー:", error)
        toast({
          title: "エラー",
          description: "キャンペーンの削除中にエラーが発生しました。",
          variant: "destructive",
        })
      }
    }
    setDeleteDialogOpen(false)
    setCampaignToDelete(null)
  }

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
                <TableRow key={campaign.campaign_id}>
                  <TableCell className="font-medium">{campaign.campaign_name}</TableCell>
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
                  <TableCell>{campaign.project_name}</TableCell>
                  <TableCell>{campaign.objective}</TableCell>
                  <TableCell>
                    {campaign.daily_budget ? `日予算: ¥${Number(campaign.daily_budget).toLocaleString()}` : ""}
                    {campaign.lifetime_budget ? `総予算: ¥${Number(campaign.lifetime_budget).toLocaleString()}` : ""}
                  </TableCell>
                  <TableCell>
                    {new Date(campaign.start_time).toLocaleDateString()} 〜
                    {campaign.end_time ? new Date(campaign.end_time).toLocaleDateString() : "未設定"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/campaigns/${campaign.campaign_id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/campaigns/edit/${campaign.campaign_id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(campaign.campaign_id)}>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>キャンペーンの削除</AlertDialogTitle>
            <AlertDialogDescription>
              このキャンペーンを削除してもよろしいですか？この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCampaign} className="bg-red-600 hover:bg-red-700">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
