"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { useDatabase } from "@/contexts/database-context"
import * as LocalStorage from "@/lib/local-storage"
import DatabaseModeSelector from "./database-mode-selector"
import { useRouter } from "next/navigation"

// プロジェクト情報のバリデーションスキーマ
const projectSchema = z.object({
  project_name: z.string().min(1, "プロジェクト名は必須です"),
  client_id: z.string().min(1, "クライアントの選択は必須です"),
  description: z.string().optional(),
  start_date: z.date({
    required_error: "開始日は必須です",
  }),
  end_date: z.date().optional(),
  status: z.string().min(1, "ステータスは必須です"),
})

type ProjectFormValues = z.infer<typeof projectSchema>

type Client = {
  client_id: string
  client_name: string
}

export default function ProjectForm({
  projectId,
  initialClientId = "",
}: { projectId?: string; initialClientId?: string }) {
  const { mode } = useDatabase()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [isLoadingClients, setIsLoadingClients] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: "",
      client_id: initialClientId,
      description: "",
      start_date: new Date(),
      status: "ACTIVE",
    },
  })

  // useEffectでinitialClientIdが変更された場合に対応
  useEffect(() => {
    if (initialClientId && !projectId) {
      form.setValue("client_id", initialClientId)
    }
  }, [initialClientId, form, projectId])

  // クライアント一覧を取得
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoadingClients(true)
      setError(null)

      try {
        if (mode === "local") {
          // ローカルストレージからクライアント一覧を取得
          const localClients = LocalStorage.getClients()
          setClients(
            localClients.map((client) => ({
              client_id: client.client_id,
              client_name: client.client_name,
            })),
          )
        } else if (mode === "mock-api") {
          // モックAPIからクライアント一覧を取得
          setClients([])
        } else {
          // 実際のAPIからクライアント一覧を取得
          setClients([])
        }
      } catch (err: any) {
        console.error("クライアント取得エラー:", err)
        setError(err instanceof Error ? err.message : "クライアント情報の取得中にエラーが発生しました")
      } finally {
        setIsLoadingClients(false)
      }
    }

    fetchClients()
  }, [mode])

  // 既存のプロジェクトを編集する場合、データを読み込む
  useEffect(() => {
    if (projectId) {
      const project = LocalStorage.getProjectById(projectId)
      if (project) {
        setIsEditing(true)

        // 開始日と終了日をDate型に変換
        const startDate = project.start_date ? new Date(project.start_date) : new Date()
        const endDate = project.end_date ? new Date(project.end_date) : undefined

        form.reset({
          project_name: project.project_name,
          client_id: project.client_id,
          description: project.description || "",
          start_date: startDate,
          end_date: endDate,
          status: project.status,
        })
      }
    }
  }, [projectId, form])

  const onSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const selectedClient = clients.find((client) => client.client_id === data.client_id)
      if (!selectedClient) {
        throw new Error("選択されたクライアントが見つかりません")
      }

      // プロジェクトIDの生成または既存IDの使用
      const newProjectId = isEditing ? projectId! : LocalStorage.generateNewProjectId(data.client_id)

      // 開始日時と終了日時をUTC ISO形式に変換
      const startDate = data.start_date.toISOString()
      const endDate = data.end_date ? data.end_date.toISOString() : undefined

      // プロジェクトデータの構築
      const projectData: LocalStorage.Project = {
        project_id: newProjectId,
        project_name: data.project_name,
        client_id: data.client_id,
        client_name: selectedClient.client_name,
        description: data.description,
        start_date: startDate,
        end_date: endDate,
        status: data.status,
        created_at: isEditing
          ? LocalStorage.getProjectById(projectId!)?.created_at || new Date().toISOString()
          : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (mode === "local") {
        // ローカルストレージに保存
        LocalStorage.saveProject(projectData)
        setSuccess(`プロジェクト「${data.project_name}」を${isEditing ? "更新" : "登録"}しました。`)
        router.push("/projects")
      } else if (mode === "mock-api") {
        // モックAPIに保存
        setSuccess("モックAPIは現在使用できません")
      } else {
        // 実際のAPIに保存
        setSuccess("実際のAPIは現在使用できません")
      }

      if (!isEditing) {
        // 新規作成の場合はフォームをリセット
        form.reset()
      }
    } catch (err: any) {
      console.error("プロジェクト登録エラー:", err)
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{isEditing ? "プロジェクト編集" : "プロジェクト登録"}</CardTitle>
          <CardDescription>プロジェクトの基本情報を{isEditing ? "編集" : "登録"}します。</CardDescription>
        </div>
        <DatabaseModeSelector />
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-500 text-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="project_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>プロジェクト名</FormLabel>
                  <FormControl>
                    <Input placeholder="プロジェクト名を入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>クライアント</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingClients || isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="クライアントを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.client_id} value={client.client_id}>
                          {client.client_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Textarea placeholder="プロジェクトの説明を入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>開始日</FormLabel>
                    <DatePicker date={field.value} setDate={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>終了日（任意）</FormLabel>
                    <DatePicker date={field.value} setDate={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ステータス</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="ステータスを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">アクティブ</SelectItem>
                      <SelectItem value="PAUSED">一時停止</SelectItem>
                      <SelectItem value="SCHEDULED">予定</SelectItem>
                      <SelectItem value="COMPLETED">完了</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "更新中..." : "登録中..."}
                </>
              ) : isEditing ? (
                "プロジェクトを更新"
              ) : (
                "プロジェクトを登録"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
