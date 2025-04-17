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
import { DatePicker } from "@/components/ui/date-picker"
import { useDatabase } from "@/contexts/database-context"
import * as LocalStorage from "@/lib/local-storage"
import DatabaseModeSelector from "./database-mode-selector"
import { useRouter } from "next/navigation"

// キャンペーン情報のバリデーションスキーマ
const campaignSchema = z.object({
  campaign_name: z.string().min(1, "キャンペーン名は必須です"),
  project_id: z.string().min(1, "プロジェクトの選択は必須です"),
  objective: z.string().min(1, "目的は必須です"),
  special_ad_category: z.string().optional(),
  status: z.string().min(1, "ステータスは必須です"),
  budget_type: z.enum(["daily", "lifetime"]),
  daily_budget: z.string().optional(),
  lifetime_budget: z.string().optional(),
  start_time: z.date({
    required_error: "開始日時は必須です",
  }),
  end_time: z.date().optional(),
})

type CampaignFormValues = z.infer<typeof campaignSchema>

type Project = {
  project_id: string
  project_name: string
}

export default function CampaignForm({ campaignId }: { campaignId?: string }) {
  const { mode } = useDatabase()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      campaign_name: "",
      project_id: "",
      objective: "AWARENESS",
      special_ad_category: "NONE",
      status: "ACTIVE",
      budget_type: "daily",
      daily_budget: "",
      lifetime_budget: "",
      start_time: new Date(),
    },
  })

  // プロジェクト一覧を取得
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true)
      setError(null)

      try {
        if (mode === "local") {
          // ローカルストレージからプロジェクト一覧を取得
          const localProjects = LocalStorage.getProjects()
          setProjects(
            localProjects.map((project) => ({
              project_id: project.project_id,
              project_name: project.project_name,
            })),
          )
        } else if (mode === "mock-api") {
          // モックAPIからプロジェクト一覧を取得
          setProjects([])
        } else {
          // 実際のAPIからプロジェクト一覧を取得
          setProjects([])
        }
      } catch (err: any) {
        console.error("プロジェクト取得エラー:", err)
        setError(err instanceof Error ? err.message : "プロジェクト情報の取得中にエラーが発生しました")
      } finally {
        setIsLoadingProjects(false)
      }
    }

    fetchProjects()
  }, [mode])

  // 既存のキャンペーンを編集する場合、データを読み込む
  useEffect(() => {
    if (campaignId) {
      const campaign = LocalStorage.getCampaignById(campaignId)
      if (campaign) {
        setIsEditing(true)

        // 開始日と終了日をDate型に変換
        const startTime = campaign.start_time ? new Date(campaign.start_time) : new Date()
        const endTime = campaign.end_time ? new Date(campaign.end_time) : undefined

        // 予算タイプを判定
        const budgetType = campaign.daily_budget ? "daily" : "lifetime"

        form.reset({
          campaign_name: campaign.campaign_name,
          project_id: campaign.project_id,
          objective: campaign.objective,
          special_ad_category: campaign.special_ad_category || "NONE",
          status: campaign.status,
          budget_type: budgetType,
          daily_budget: campaign.daily_budget || "",
          lifetime_budget: campaign.lifetime_budget || "",
          start_time: startTime,
          end_time: endTime,
        })
      }
    }
  }, [campaignId, form])

  const onSubmit = async (data: CampaignFormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const selectedProject = projects.find((project) => project.project_id === data.project_id)
      if (!selectedProject) {
        throw new Error("選択されたプロジェクトが見つかりません")
      }

      // キャンペーンIDの生成または既存IDの使用
      const newCampaignId = isEditing ? campaignId! : LocalStorage.generateNewCampaignId(data.project_id)

      // 予算設定
      const dailyBudget = data.budget_type === "daily" ? data.daily_budget : undefined
      const lifetimeBudget = data.budget_type === "lifetime" ? data.lifetime_budget : undefined

      // 開始日時と終了日時をUTC ISO形式に変換
      const startTime = data.start_time.toISOString()
      const endTime = data.end_time ? data.end_time.toISOString() : undefined

      // キャンペーンデータの構築
      const campaignData: LocalStorage.Campaign = {
        campaign_id: newCampaignId,
        campaign_name: data.campaign_name,
        project_id: data.project_id,
        project_name: selectedProject.project_name,
        objective: data.objective,
        special_ad_category: data.special_ad_category,
        status: data.status,
        daily_budget: dailyBudget,
        lifetime_budget: lifetimeBudget,
        start_time: startTime,
        end_time: endTime,
        created_at: isEditing
          ? LocalStorage.getCampaignById(campaignId!)?.created_at || new Date().toISOString()
          : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (mode === "local") {
        // ローカルストレージに保存
        LocalStorage.saveCampaign(campaignData)
        setSuccess(`キャンペーン「${data.campaign_name}」を${isEditing ? "更新" : "登録"}しました。`)
        router.push("/campaigns")
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
      console.error("キャンペーン登録エラー:", err)
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{isEditing ? "キャンペーン編集" : "キャンペーン登録"}</CardTitle>
          <CardDescription>キャンペーンの基本情報を{isEditing ? "編集" : "登録"}します。</CardDescription>
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
              name="campaign_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>キャンペーン名</FormLabel>
                  <FormControl>
                    <Input placeholder="キャンペーン名を入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>プロジェクト</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingProjects || isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="プロジェクトを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.project_id} value={project.project_id}>
                          {project.project_name}
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
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目的</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="目的を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AWARENESS">認知拡大</SelectItem>
                      <SelectItem value="CONSIDERATION">検討</SelectItem>
                      <SelectItem value="CONVERSIONS">コンバージョン</SelectItem>
                      <SelectItem value="SALES">売上拡大</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="special_ad_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>特別広告カテゴリ</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="特別広告カテゴリを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NONE">なし</SelectItem>
                      <SelectItem value="HOUSING">住宅</SelectItem>
                      <SelectItem value="EMPLOYMENT">雇用</SelectItem>
                      <SelectItem value="CREDIT">クレジット</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>予算タイプ</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="予算タイプを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">日予算</SelectItem>
                      <SelectItem value="lifetime">総予算</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("budget_type") === "daily" ? (
              <FormField
                control={form.control}
                name="daily_budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>日予算</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="lifetime_budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>総予算</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 100000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
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
                name="end_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>終了日（任意）</FormLabel>
                    <DatePicker date={field.value} setDate={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "更新中..." : "登録中..."}
                </>
              ) : isEditing ? (
                "キャンペーンを更新"
              ) : (
                "キャンペーンを登録"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
