"use client"

import Link from "next/link"
import { useState } from "react"
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

export default function AdSetsPage() {
  const [adSets, setAdSets] = useState<LocalStorage.AdSet[]>(() => {
    // 広告セットデータをローカルストレージから取得
    if (typeof window !== "undefined") {
      return LocalStorage.getAdSets()
    }
    return []
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adSetToDelete, setAdSetToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  // 削除ダイアログを開く
  const openDeleteDialog = (adSetId: string) => {
    setAdSetToDelete(adSetId)
    setDeleteDialogOpen(true)
  }

  // 広告セットを削除
  const deleteAdSet = () => {
    if (adSetToDelete) {
      try {
        LocalStorage.deleteAdSet(adSetToDelete)
        setAdSets(adSets.filter((adSet) => adSet.adset_id !== adSetToDelete))
        toast({
          title: "削除完了",
          description: "広告セットを削除しました。",
        })
      } catch (error) {
        console.error("削除エラー:", error)
        toast({
          title: "エラー",
          description: "広告セットの削除中にエラーが発生しました。",
          variant: "destructive",
        })
      }
    }
    setDeleteDialogOpen(false)
    setAdSetToDelete(null)
  }

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
              {adSets.map((adSet) => {
                // ターゲティング情報の表示用テキストを作成
                const targeting = adSet.targeting || {}
                const targetingText = [
                  targeting.age_min && targeting.age_max ? `${targeting.age_min}-${targeting.age_max}歳` : null,
                  targeting.genders
                    ? targeting.genders.includes(1) && targeting.genders.includes(2)
                      ? "男女"
                      : targeting.genders.includes(1)
                        ? "男性"
                        : "女性"
                    : null,
                  targeting.geo_locations?.countries?.join(", "),
                ]
                  .filter(Boolean)
                  .join(", ")

                return (
                  <TableRow key={adSet.adset_id}>
                    <TableCell className="font-medium">{adSet.adset_name}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          adSet.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {adSet.status === "ACTIVE" ? "アクティブ" : "一時停止"}
                      </span>
                    </TableCell>
                    <TableCell>{adSet.campaign_name}</TableCell>
                    <TableCell>
                      {adSet.daily_budget ? `¥${Number(adSet.daily_budget).toLocaleString()}/日` : ""}
                      {adSet.lifetime_budget ? `¥${Number(adSet.lifetime_budget).toLocaleString()} 総額` : ""}
                    </TableCell>
                    <TableCell>
                      {new Date(adSet.start_time).toLocaleDateString()} 〜
                      {adSet.end_time ? new Date(adSet.end_time).toLocaleDateString() : "未設定"}
                    </TableCell>
                    <TableCell>{targetingText}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/ad-sets/${adSet.adset_id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/ad-sets/edit/${adSet.adset_id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(adSet.adset_id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>広告セットの削除</AlertDialogTitle>
            <AlertDialogDescription>
              この広告セットを削除してもよろしいですか？この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAdSet} className="bg-red-600 hover:bg-red-700">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
