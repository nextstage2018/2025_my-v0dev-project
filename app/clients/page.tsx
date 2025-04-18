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

export default function ClientsPage() {
  // ダミーデータを追加（命名規則に従ったID）
  const dummyClients = [
    {
      client_id: "cl00001",
      client_name: "株式会社ABC",
      industry_category: "retail",
      contact_person: "山田太郎",
      email: "yamada@example.com",
      phone: "03-1234-5678",
      created_at: "2023-01-15T10:30:00.000Z",
      updated_at: "2023-01-20T15:45:00.000Z",
    },
    {
      client_id: "cl00002",
      client_name: "DEF株式会社",
      industry_category: "it",
      contact_person: "佐藤花子",
      email: "sato@example.com",
      phone: "03-8765-4321",
      created_at: "2023-02-10T09:15:00.000Z",
      updated_at: "2023-02-15T14:20:00.000Z",
    },
    {
      client_id: "cl00003",
      client_name: "GHI商事",
      industry_category: "finance",
      contact_person: "鈴木一郎",
      email: "suzuki@example.com",
      phone: "03-2345-6789",
      created_at: "2023-03-05T11:45:00.000Z",
      updated_at: "2023-03-10T16:30:00.000Z",
    },
  ]

  const [clients, setClients] = useState<LocalStorage.Client[]>(() => {
    // クライアントデータをローカルストレージから取得
    if (typeof window !== "undefined") {
      const storedClients = LocalStorage.getClients()
      // ローカルストレージにデータがない場合はダミーデータを使用
      return storedClients.length > 0 ? storedClients : dummyClients
    }
    return dummyClients
  })

  // ダミーデータをローカルストレージに保存（初回のみ）
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedClients = LocalStorage.getClients()
      if (storedClients.length === 0) {
        dummyClients.forEach((client) => {
          LocalStorage.saveClient(client)
        })
      }
    }
  }, [])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<string | null>(null)

  // 削除ダイアログを開く
  const openDeleteDialog = (clientId: string) => {
    setClientToDelete(clientId)
    setDeleteDialogOpen(true)
  }

  // クライアントを削除
  const deleteClient = () => {
    if (clientToDelete) {
      try {
        LocalStorage.deleteClient(clientToDelete)
        setClients(clients.filter((client) => client.client_id !== clientToDelete))
      } catch (error) {
        console.error("削除エラー:", error)
      }
    }
    setDeleteDialogOpen(false)
    setClientToDelete(null)
  }

  // 業種名を取得する関数
  const getIndustryName = (industryCode: string | undefined) => {
    switch (industryCode) {
      case "retail":
        return "小売業"
      case "it":
        return "IT・通信"
      case "manufacturing":
        return "製造業"
      case "finance":
        return "金融・保険"
      case "service":
        return "サービス業"
      default:
        return "その他"
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">クライアント一覧</h1>
        <Link href="/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規クライアント登録
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>クライアント</CardTitle>
          <CardDescription>登録されているクライアントの一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>クライアント名</TableHead>
                <TableHead>業種</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>連絡先</TableHead>
                <TableHead>プロジェクト数</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.client_id}>
                  <TableCell className="font-medium">{client.client_name}</TableCell>
                  <TableCell>{getIndustryName(client.industry_category)}</TableCell>
                  <TableCell>{client.contact_person}</TableCell>
                  <TableCell>
                    {client.email}
                    <br />
                    {client.phone}
                  </TableCell>
                  <TableCell>{LocalStorage.getProjectsByClientId(client.client_id).length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/clients/${client.client_id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/clients/edit/${client.client_id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(client.client_id)}>
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
            <AlertDialogTitle>クライアントの削除</AlertDialogTitle>
            <AlertDialogDescription>
              このクライアントを削除してもよろしいですか？この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={deleteClient} className="bg-red-600 hover:bg-red-700">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
