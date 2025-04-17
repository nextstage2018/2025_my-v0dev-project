import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash, Plus } from "lucide-react"

export default function ProjectsPage() {
  // サンプルデータ
  const projects = [
    {
      id: "project_123456",
      name: "2023年夏季プロジェクト",
      client: "株式会社ABC",
      status: "ACTIVE",
      start_date: "2023-06-01",
      end_date: "2023-08-31",
      campaigns_count: 2,
    },
    {
      id: "project_234567",
      name: "新商品プロジェクト",
      client: "DEF株式会社",
      status: "ACTIVE",
      start_date: "2023-07-15",
      end_date: "2023-09-15",
      campaigns_count: 1,
    },
    {
      id: "project_345678",
      name: "2023年冬季プロジェクト",
      client: "GHI商事",
      status: "SCHEDULED",
      start_date: "2023-11-15",
      end_date: "2023-12-31",
      campaigns_count: 1,
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">プロジェクト一覧</h1>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規プロジェクト作成
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>プロジェクト</CardTitle>
          <CardDescription>登録されているプロジェクトの一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>プロジェクト名</TableHead>
                <TableHead>クライアント</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>期間</TableHead>
                <TableHead>キャンペーン数</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : project.status === "SCHEDULED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status === "ACTIVE"
                        ? "アクティブ"
                        : project.status === "SCHEDULED"
                          ? "予定"
                          : "一時停止"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {project.start_date} 〜 {project.end_date}
                  </TableCell>
                  <TableCell>{project.campaigns_count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/projects/${project.id}`}>
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
