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
import { useDatabase } from "@/contexts/database-context"
import * as LocalStorage from "@/lib/local-storage"
import DatabaseModeSelector from "./database-mode-selector"
import { useRouter } from "next/navigation"

// 広告情報のバリデーションスキーマ
const adSchema = z.object({
  ad_name: z.string().min(1, "広告名は必須です"),
  adset_id: z.string().min(1, "広告セットの選択は必須です"),
  status: z.string().min(1, "ステータスは必須です"),
  creative_type: z.string().min(1, "クリエイティブタイプは必須です"),
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().optional(),
  link_url: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
})

type AdFormValues = z.infer<typeof adSchema>

type AdSet = {
  adset_id: string
  adset_name: string
}

export default function AdForm({ adId }: { adId?: string }) {
  const { mode } = useDatabase()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [adSets, setAdSets] = useState<AdSet[]>([])
  const [isLoadingAdSets, setIsLoadingAdSets] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      ad_name: "",
      adset_id: "",
      status: "ACTIVE",
      creative_type: "IMAGE",
      title: "",
      description: "",
      link_url: "",
    },
  })

  // 広告セット一覧を取得
  useEffect(() => {
    const fetchAdSets = async () => {
      setIsLoadingAdSets(true)
      setError(null)

      try {
        if (mode === "local") {
          // ローカルストレージから広告セット一覧を取得
          const localAdSets = LocalStorage.getAdSets()
          setAdSets(
            localAdSets.map((adSet) => ({
              adset_id: adSet.adset_id,
              adset_name: adSet.adset_name,
            })),
          )
        } else if (mode === "mock-api") {
          // モックAPIから広告セット一覧を取得
          setAdSets([])
        } else {
          // 実際のAPIから広告セット一覧を取得
          setAdSets([])
        }
      } catch (err: any) {
        console.error("広告セット取得エラー:", err)
        setError(err instanceof Error ? err.message : "広告セット情報の取得中にエラーが発生しました")
      } finally {
        setIsLoadingAdSets(false)
      }
    }

    fetchAdSets()
  }, [mode])

  // 既存の広告を編集する場合、データを読み込む
  useEffect(() => {
    if (adId) {
      const ad = LocalStorage.getAdById(adId)
      if (ad) {
        setIsEditing(true)

        // クリエイティブ情報を取得
        const creative = ad.creative || {}

        form.reset({
          ad_name: ad.ad_name,
          adset_id: ad.adset_id,
          status: ad.status,
          creative_type: ad.creative_type,
          title: creative.title || "",
          description: creative.description || "",
          link_url: creative.link_url || "",
        })
      }
    }
  }, [adId, form])

  const onSubmit = async (data: AdFormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const selectedAdSet = adSets.find((adSet) => adSet.adset_id === data.adset_id)
      if (!selectedAdSet) {
        throw new Error("選択された広告セットが見つかりません")
      }

      // 広告IDの生成または既存IDの使用
      const newAdId = isEditing ? adId! : LocalStorage.generateNewAdId(data.adset_id)

      // クリエイティブ情報の構築
      const creative = {
        title: data.title,
        description: data.description,
        link_url: data.link_url,
        image_url: "https://example.com/sample-image.jpg", // サンプル画像URL
      }

      // 広告データの構築
      const adData: LocalStorage.Ad = {
        ad_id: newAdId,
        ad_name: data.ad_name,
        adset_id: data.adset_id,
        adset_name: selectedAdSet.adset_name,
        status: data.status,
        creative_type: data.creative_type,
        creative: creative,
        created_at: isEditing
          ? LocalStorage.getAdById(adId!)?.created_at || new Date().toISOString()
          : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (mode === "local") {
        // ローカルストレージに保存
        LocalStorage.saveAd(adData)
        setSuccess(`広告「${data.ad_name}」を${isEditing ? "更新" : "登録"}しました。`)
        router.push("/ads")
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
      console.error("広告登録エラー:", err)
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{isEditing ? "広告編集" : "広告登録"}</CardTitle>
          <CardDescription>広告の基本情報を{isEditing ? "編集" : "登録"}します。</CardDescription>
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
              name="ad_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>広告名</FormLabel>
                  <FormControl>
                    <Input placeholder="広告名を入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adset_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>広告セット</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingAdSets || isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="広告セットを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adSets.map((adSet) => (
                        <SelectItem key={adSet.adset_id} value={adSet.adset_id}>
                          {adSet.adset_name}
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creative_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>クリエイティブタイプ</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="クリエイティブタイプを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IMAGE">画像広告</SelectItem>
                      <SelectItem value="VIDEO">動画広告</SelectItem>
                      <SelectItem value="CAROUSEL">カルーセル広告</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input placeholder="広告のタイトルを入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明文</FormLabel>
                  <FormControl>
                    <Textarea placeholder="広告の説明文を入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>リンク先URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
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
                "広告を更新"
              ) : (
                "広告を登録"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
