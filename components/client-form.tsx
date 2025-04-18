"use client"
import { useState, useEffect, type FormEvent } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDatabase } from "@/contexts/database-context"
import * as LocalStorage from "@/lib/local-storage"
import DatabaseModeSelector from "./database-mode-selector"
import { useRouter } from "next/navigation"

// シンプルなフォーム実装のためのインターフェース
interface ClientFormData {
  client_name: string
  industry_category: string
  contact_person: string
  email: string
  phone: string
}

export default function ClientForm({ clientId }: { clientId?: string }) {
  const { mode } = useDatabase()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // フォームの状態を useState で管理
  const [formData, setFormData] = useState<ClientFormData>({
    client_name: "",
    industry_category: "",
    contact_person: "",
    email: "",
    phone: "",
  })

  // フォームのバリデーションエラー
  const [validationErrors, setValidationErrors] = useState<{
    client_name?: string
    email?: string
  }>({})

  // 既存のクライアントを編集する場合、データを読み込む
  useEffect(() => {
    if (clientId) {
      const client = LocalStorage.getClientById(clientId)
      if (client) {
        setIsEditing(true)
        setFormData({
          client_name: client.client_name,
          industry_category: client.industry_category || "",
          contact_person: client.contact_person || "",
          email: client.email || "",
          phone: client.phone || "",
        })
      }
    }
  }, [clientId])

  // 入力フィールドの変更を処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // バリデーションエラーをクリア
    if (name === "client_name" || name === "email") {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  // セレクトの変更を処理
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      industry_category: value,
    }))
  }

  // フォーム送信処理
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // 簡易バリデーション
    const errors: {
      client_name?: string
      email?: string
    } = {}

    if (!formData.client_name.trim()) {
      errors.client_name = "クライアント名は必須です"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "有効なメールアドレスを入力してください"
    }

    // バリデーションエラーがある場合は処理を中止
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      // クライアントIDの生成または既存IDの使用
      const newClientId = isEditing ? clientId! : LocalStorage.generateNewClientId()

      // クライアントデータの構築
      const clientData: LocalStorage.Client = {
        client_id: newClientId,
        client_name: formData.client_name,
        industry_category: formData.industry_category || undefined,
        contact_person: formData.contact_person || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        created_at: isEditing
          ? LocalStorage.getClientById(clientId!)?.created_at || new Date().toISOString()
          : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (mode === "local") {
        // ローカルストレージに保存
        LocalStorage.saveClient(clientData)
        setSuccess(`クライアント「${formData.client_name}」を${isEditing ? "更新" : "登録"}しました。`)

        // 成功メッセージを表示した後、少し待ってからリダイレクト
        setTimeout(() => {
          router.push("/clients")
        }, 1500)
      } else if (mode === "mock-api") {
        // モックAPIに保存
        setSuccess("モックAPIは現在使用できません")
      } else {
        // 実際のAPIに保存
        setSuccess("実際のAPIは現在使用できません")
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

      <form onSubmit={handleSubmit}>
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

          <div className="space-y-2">
            <label htmlFor="client_name" className="text-sm font-medium">
              クライアント名
            </label>
            <Input
              id="client_name"
              name="client_name"
              placeholder="クライアント名を入力"
              value={formData.client_name}
              onChange={handleInputChange}
            />
            {validationErrors.client_name && <p className="text-sm text-red-500">{validationErrors.client_name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="industry_category" className="text-sm font-medium">
              業種
            </label>
            <Select value={formData.industry_category} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="業種を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">小売業</SelectItem>
                <SelectItem value="it">IT・通信</SelectItem>
                <SelectItem value="manufacturing">製造業</SelectItem>
                <SelectItem value="finance">金融・保険</SelectItem>
                <SelectItem value="service">サービス業</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="contact_person" className="text-sm font-medium">
              担当者名
            </label>
            <Input
              id="contact_person"
              name="contact_person"
              placeholder="担当者名を入力"
              value={formData.contact_person}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              メールアドレス
            </label>
            <Input
              id="email"
              name="email"
              placeholder="example@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              電話番号
            </label>
            <Input
              id="phone"
              name="phone"
              placeholder="03-1234-5678"
              value={formData.phone}
              onChange={handleInputChange}
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
              "クライアントを更新"
            ) : (
              "クライアントを登録"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
