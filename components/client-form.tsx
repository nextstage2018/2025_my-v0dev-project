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
import { useDatabase } from "@/contexts/database-context"
import * as LocalStorage from "@/lib/local-storage"
import DatabaseModeSelector from "./database-mode-selector"
import { useRouter } from "next/navigation"

// クライアント情報のバリデーションスキーマ
const clientSchema = z.object({
  client_name: z.string().min(1, "クライアント名は必須です"),
  industry_category: z.string().optional(),
  contact_person: z.string().optional(),
  email: z.string().email("有効なメールアドレスを入力してください").optional().or(z.literal("")),
  phone: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

export default function ClientForm({ clientId }: { clientId?: string }) {
  const { mode } = useDatabase()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      client_name: "",
      industry_category: "",
      contact_person: "",
      email: "",
      phone: "",
    },
  })

  // 既存のクライアントを編集する場合、データを読み込む
  useEffect(() => {
    if (clientId) {
      const client = LocalStorage.getClientById(clientId)
      if (client) {
        setIsEditing(true)
        form.reset({
          client_name: client.client_name,
          industry_category: client.industry_category || "",
          contact_person: client.contact_person || "",
          email: client.email || "",
          phone: client.phone || "",
        })
      }
    }
  }, [clientId, form])

  const onSubmit = async (data: ClientFormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // クライアントIDの生成または既存IDの使用
      const newClientId = isEditing ? clientId! : LocalStorage.generateNewClientId()

      // クライアントデータの構築
      const clientData: LocalStorage.Client = {
        client_id: newClientId,
        client_name: data.client_name,
        industry_category: data.industry_category,
        contact_person: data.contact_person,
        email: data.email,
        phone: data.phone,
        created_at: isEditing
          ? LocalStorage.getClientById(clientId!)?.created_at || new Date().toISOString()
          : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (mode === "local") {
        // ローカルストレージに保存
        LocalStorage.saveClient(clientData)
        setSuccess(`クライアント「${data.client_name}」を${isEditing ? "更新" : "登録"}しました。`)
        router.push("/clients")
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
      console.error("クライアント登録エラー:", err)
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{isEditing ? "クライアント編集" : "クライアント登録"}</CardTitle>
          <CardDescription>クライアントの基本情報を{isEditing ? "編集" : "登録"}します。</CardDescription>
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
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>クライアント名</FormLabel>
                  <FormControl>
                    <Input placeholder="クライアント名を入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>業種</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="業種を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="retail">小売業</SelectItem>
                      <SelectItem value="it">IT・通信</SelectItem>
                      <SelectItem value="manufacturing">製造業</SelectItem>
                      <SelectItem value="finance">金融・保険</SelectItem>
                      <SelectItem value="service">サービス業</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>担当者名</FormLabel>
                  <FormControl>
                    <Input placeholder="担当者名を入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>電話番号</FormLabel>
                  <FormControl>
                    <Input placeholder="03-1234-5678" {...field} />
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
                "クライアントを更新"
              ) : (
                "クライアントを登録"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
