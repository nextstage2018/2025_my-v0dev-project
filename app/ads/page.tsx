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

export default function AdsPage() {
  const [ads, setAds] = useState<LocalStorage.Ad[]>(() => {
    // 広告データをローカルストレージから取得
    if (typeof window !== "undefined") {
      return LocalStorage.getAds()
    }
    return []
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adToDelete, setAdToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  // 削除ダイアログを開く
  const openDeleteDialog = (adId: string) => {
    setAdToDelete(adId)
    setDeleteDialogOpen(true)
  }

  // 広告を削除
  const deleteAd = () => {
    if (adToDelete) {
      try {
        LocalStorage.deleteAd(adToDelete)
        setAds(ads.filter((ad) => ad.ad_id !== adToDelete))
        toast({
          title: "削除完了",
          description: "広告を削除しました。",
        })
      } catch (error) {
        console.error("削除エラー:", error)
        toast({
          title: "エラー",
          description: "広告の削除中にエラーが発生しました。",
          variant: "destructive",
        })
      }
    }
    setDeleteDialogOpen(false)
    setAdToDelete(null)
  }

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
                <TableRow key={ad.ad_id}>
                  <TableCell className="font-medium">{ad.ad_name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ad.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {ad.status === "ACTIVE" ? "アクティブ" : "一時停止"}
                    </span>
                  </TableCell>
                  <TableCell>{ad.adset_name}</TableCell>
                  <TableCell className="text-right">{Math.floor(Math.random() * 10000).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{Math.floor(Math.random() * 1000).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(Math.random() * 10).toFixed(1)}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/ads/${ad.ad_id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/ads/edit/${ad.ad_id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(ad.ad_id)}>
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
            <AlertDialogTitle>広告の削除</AlertDialogTitle>
            <AlertDialogDescription>
              この広告を削除してもよろしいですか？この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAd} className="bg-red-600 hover:bg-red-700">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
