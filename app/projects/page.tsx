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

export default function ProjectsPage() {
  // ダミープロジェクトデータ（命名規則に従ったID）
  const dummyProjects = [
    {
      project_id: "cl00001_pr00001",
      client_id: "cl00001",
      client_name: "株式会社ABC",
      project_name: "2023年夏季プロジェクト",
      description: "夏季プロモーションのためのプロジェクトです。",
      start_date: "2023-06-01T00:00:00.000Z",
      end_date: "2023-08-31T23:59:59.000Z",
      status: "ACTIVE",
      created_at: "2023-05-15T10:30:00.000Z",
      updated_at: "2023-05-20T15:45:00.000Z",
    },
    {
      project_id: "cl00002_pr00001",
      client_id: "cl00002",
      client_name: "DEF株式会社",
      project_name: "2023年秋季キャンペーン",
      description: "秋季販売促進キャンペーン",
      start_date: "2023-09-01T00:00:00.000Z",
      end_date: "2023-11-30T23:59:59.000Z",
      status: "SCHEDULED",
      created_at: "2023-07-10T09:15:00.000Z",
      updated_at: "2023-07-15T14:20:00.000Z",
    },
    {
      project_id: "cl00003_pr00001",
      client_id: "cl00003",
      client_name: "GHI商事",
      project_name: "年末特別プロモーション",
      description: "年末セールのプロモーション",
      start_date: "2023-12-01T00:00:00.000Z",
      end_date: "2023-12-31T23:59:59.000Z",
      status: "PAUSED",
      created_at: "2023-10-05T11:45:00.000Z",
      updated_at: "2023-10-10T16:30:00.000Z",
    },
  ]

  const [projects, setProjects] = useState<LocalStorage.Project[]>(() => {
    // プロジェクトデータをローカルストレージから取得
    if (typeof window !== "undefined") {
      const storedProjects = LocalStorage.getProjects()
      // ローカルストレージにデータがない場合はダミーデータを使用
      return storedProjects.length > 0 ? storedProjects : dummyProjects
    }
    return dummyProjects
  })

  // ダミーデータをローカルストレージに保存（初回のみ）
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProjects = LocalStorage.getProjects()
      if (storedProjects.length === 0) {
        dummyProjects.forEach((project) => {
          LocalStorage.saveProject(project)
        })
      }
    }
  }, [])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  // 削除ダイアログを開く
  const openDeleteDialog = (projectId: string) => {
    setProjectToDelete(projectId)
    setDeleteDialogOpen(true)
  }

  // プロジェクトを削除
  const deleteProject = () => {
    if (projectToDelete) {
      try {
        LocalStorage.deleteProject(projectToDelete)
        setProjects(projects.filter((project) => project.project_id !== projectToDelete))
        toast({
          title: "削除完了",
          description: "プロジェクトを削除しました。",
        })
      } catch (error) {
        console.error("削除エラー:", error)
        toast({
          title: "エラー",
          description: "プロジェクトの削除中にエラーが発生しました。",
          variant: "destructive",
        })
      }
    }
    setDeleteDialogOpen(false)
    setProjectToDelete(null)
  }

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
                <TableRow key={project.project_id}>
                  <TableCell className="font-medium">{project.project_name}</TableCell>
                  <TableCell>{project.client_name}</TableCell>
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
                    {new Date(project.start_date || "").toLocaleDateString()} 〜
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : "未設定"}
                  </TableCell>
                  <TableCell>{LocalStorage.getCampaignsByProjectId(project.project_id).length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/projects/${project.project_id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/projects/edit/${project.project_id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(project.project_id)}>
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
            <AlertDialogTitle>プロジェクトの削除</AlertDialogTitle>
            <AlertDialogDescription>
              このプロジェクトを削除してもよろしいですか？この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProject} className="bg-red-600 hover:bg-red-700">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
