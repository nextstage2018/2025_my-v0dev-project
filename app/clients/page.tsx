import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash, Plus } from "lucide-react"

export default function ClientsPage() {
  // サンプルデータ
  const clients = [
    {
      id: "client_123456",
      name: "株式会社ABC",
      industry: "小売業",
      contact_person: "山田太郎",
      email: "yamada@abc.co.jp",
      phone: "03-1234-5678",
      projects_count: 3,
    },
    {
      id: "client_234567",
      name: "DEF株式会社",
      industry: "IT・通信",
      contact_person: "佐藤花子",
      email: "sato@def.co.jp",
      phone: "03-2345-6789",
      projects_count: 2,
    },
    {
      id: "client_345678",
      name: "GHI商事",
      industry: "製造業",
      contact_person: "鈴木一郎",
      email: "suzuki@ghi.co.jp",
      phone: "03-3456-7890",
      projects_count: 1,
    },
  ]

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
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.industry}</TableCell>
                  <TableCell>{client.contact_person}</TableCell>
                  <TableCell>
                    {client.email}
                    <br />
                    {client.phone}
                  </TableCell>
                  <TableCell>{client.projects_count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/clients/${client.id}`}>
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
