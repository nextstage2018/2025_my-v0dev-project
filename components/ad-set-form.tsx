"use client"
import { FormDescription } from "@/components/ui/form"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, Plus, Trash } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { useDatabase } from "@/contexts/database-context"
import * as LocalStorage from "@/lib/local-storage"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  BILLING_EVENTS,
  OPTIMIZATION_GOALS,
  BID_STRATEGIES,
  PACING_TYPES,
  type AdSet,
  type AdSetTargeting,
  type AdSetSchedule,
} from "@/lib/ad-set-types"
import DatabaseModeSelector from "./database-mode-selector"
import { useRouter } from "next/navigation"

// 広告セット情報のバリデーションスキーマ
const adSetSchema = z.object({
  adset_name: z.string().min(1, "広告セット名は必須です"),
  campaign_id: z.string().min(1, "キャンペーンの選択は必須です"),
  budget_type: z.enum(["daily", "lifetime"]),
  daily_budget: z.string().optional(),
  lifetime_budget: z.string().optional(),
  start_date: z.date({
    required_error: "開始日は必須です",
  }),
  end_date: z.date().optional(),
  billing_event: z.string().min(1, "課金イベントは必須です"),
  optimization_goal: z.string().min(1, "最適化目標は必須です"),
  bid_strategy: z.string().min(1, "入札戦略は必須です"),
  bid_amount: z.string().optional(),
  pacing_type: z.string().default("STANDARD"),
  // ターゲティング関連のフィールド
  age_min: z.string().optional(),
  age_max: z.string().optional(),
  gender: z.string().optional(),
  countries: z.string().optional(),
  device_platforms: z.array(z.string()).optional(),
  publisher_platforms: z.array(z.string()).optional(),
  // 詳細設定
  daily_min_spend_target: z.string().optional(),
  daily_spend_cap: z.string().optional(),
  use_schedule: z.boolean().default(false),
  use_frequency_cap: z.boolean().default(false),
  max_frequency: z.string().optional(),
  frequency_time_window: z.string().optional(),
})

type AdSetFormValues = z.infer<typeof adSetSchema>

type Campaign = {
  campaign_id: string
  campaign_name: string
}

export default function AdSetForm({ adSetId }: { adSetId?: string }) {
 const { mode } = useDatabase()
 const router = useRouter()
 const [isLoading, setIsLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const [success, setSuccess] = useState<string | null>(null)
 const [campaigns, setCampaigns] = useState<Campaign[]>([])
 const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false)
 const [schedules, setSchedules] = useState<AdSetSchedule[]>([])
 const [isEditing, setIsEditing] = useState(false)

 const form = useForm<AdSetFormValues>({
   resolver: zodResolver(adSetSchema),
   defaultValues: {
     adset_name: "",
     campaign_id: "",
     budget_type: "daily",
     daily_budget: "",
     lifetime_budget: "",
     billing_event: "IMPRESSIONS",
     optimization_goal: "REACH",
     bid_strategy: "LOWEST_COST_WITHOUT_CAP",
     bid_amount: "",
     pacing_type: "STANDARD",
     age_min: "18",
     age_max: "65",
     gender: "all",
     countries: "JP",
     device_platforms: ["mobile", "desktop"],
     publisher_platforms: ["facebook", "instagram"],
     use_schedule: false,
     use_frequency_cap: false,
     max_frequency: "3",
     frequency_time_window: "7",
   },
 })

 // 既存の広告セットを編集する場合、データを読み込む
 useEffect(() => {
   if (adSetId) {
     const adSet = LocalStorage.getAdSetById(adSetId)
     if (adSet) {
       setIsEditing(true)

       // 開始日と終了日をDate型に変換
       const startDate = new Date(adSet.start_time)
       const endDate = adSet.end_time ? new Date(adSet.end_time) : undefined

       // 予算タイプを判定
       const budgetType = adSet.daily_budget ? "daily" : "lifetime"

       // ターゲティング情報を取得
       const targeting = adSet.targeting || {}
       const ageMin = targeting.age_min?.toString() || "18"
       const ageMax = targeting.age_max?.toString() || "65"
       const gender =
         targeting.genders?.includes(1) && targeting.genders?.includes(2)
           ? "all"
           : targeting.genders?.includes(1)
             ? "male"
             : targeting.genders?.includes(2)
               ? "female"
               : "all"
       const countries = targeting.geo_locations?.countries?.join(",") || "JP"
       const devicePlatforms = targeting.device_platforms || ["mobile", "desktop"]
       const publisherPlatforms = targeting.publisher_platforms || ["facebook", "instagram"]

       // スケジュール情報を設定
       if (adSet.adset_schedule && adSet.adset_schedule.length > 0) {
         setSchedules(adSet.adset_schedule)
       }

       // 頻度制御情報を取得
       const useFrequencyCap = adSet.frequency_control_specs && adSet.frequency_control_specs.length > 0
       const maxFrequency = useFrequencyCap ? adSet.frequency_control_specs[0].max_frequency.toString() : "3"
       const frequencyTimeWindow = useFrequencyCap ? adSet.frequency_control_specs[0].time_window.toString() : "7"

       // フォームの初期値を設定
       form.reset({
         adset_name: adSet.adset_name,
         campaign_id: adSet.campaign_id,
         budget_type: budgetType,
         daily_budget: adSet.daily_budget || "",
         lifetime_budget: adSet.lifetime_budget || "",
         start_date: startDate,
         end_date: endDate,
         billing_event: adSet.billing_event,
         optimization_goal: adSet.optimization_goal,
         bid_strategy: adSet.bid_strategy,
         bid_amount: adSet.bid_amount,
         pacing_type: adSet.pacing_type?.[0] || "STANDARD",
         age_min: ageMin,
         age_max: ageMax,
         gender: gender,
         countries: countries,
         device_platforms: devicePlatforms,
         publisher_platforms: publisherPlatforms,
         daily_min_spend_target: adSet.daily_min_spend_target || "",
         daily_spend_cap: adSet.daily_spend_cap || "",
         use_schedule: adSet.adset_schedule && adSet.adset_schedule.length > 0,
         use_frequency_cap: useFrequencyCap,
         max_frequency: maxFrequency,
         frequency_time_window: frequencyTimeWindow,
       })
     }
   }
 }, [adSetId, form])

 // キャンペーン一覧を取得
 useEffect(() => {
   const fetchCampaigns = async () => {
     setIsLoadingCampaigns(true)
     setError(null)

     try {
       if (mode === "local") {
         // ローカルストレージからキャンペーン一覧を取得
         const localCampaigns = LocalStorage.getCampaigns()
         setCampaigns(
           localCampaigns.map((campaign) => ({
             campaign_id: campaign.campaign_id,
             campaign_name: campaign.campaign_name,
           })),
         )
       } else if (mode === "mock-api") {
         // モックAPIからキャンペーン一覧を取得
         const response = await fetch(`/api/mock/campaigns/list`)

         if (!response.ok) {
           throw new Error("キャンペーン情報の取得に失敗しました")
         }

         const data = await response.json()
         setCampaigns(data.campaigns || [])
       } else {
         // 実際のBigQuery APIからキャンペーン一覧を取得
         const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
         const response = await fetch(`${apiBaseUrl}/api/campaigns/list`)

         if (!response.ok) {
           throw new Error("キャンペーン情報の取得に失敗しました")
         }

         const data = await response.json()
         setCampaigns(data.campaigns || [])
       }
     } catch (err: any) {
       console.error("キャンペーン取得エラー:", err)
       setError(err instanceof Error ? err.message : "キャンペーン情報の取得中にエラーが発生しました")
     } finally {
       setIsLoadingCampaigns(false)
     }
   }

   fetchCampaigns()
 }, [mode])

 // スケジュールの追加
 const addSchedule = () => {
   setSchedules([
     ...schedules,
     {
       start_minute: 480, // 8:00 AM
       end_minute: 1020, // 5:00 PM
       days: [1, 2, 3, 4, 5], // 月〜金
     },
   ])
 }

 // スケジュールの削除
 const removeSchedule = (index: number) => {
   const newSchedules = [...schedules]
   newSchedules.splice(index, 1)
   setSchedules(newSchedules)
 }

 // スケジュールの更新
 const updateSchedule = (index: number, field: keyof AdSetSchedule, value: any) => {
   const newSchedules = [...schedules]
   newSchedules[index] = { ...newSchedules[index], [field]: value }
   setSchedules(newSchedules)
 }

 // 曜日の切り替え
 const toggleDay = (index: number, day: number) => {
   const newSchedules = [...schedules]
   const currentDays = newSchedules[index].days

   if (currentDays.includes(day)) {
     newSchedules[index].days = currentDays.filter((d) => d !== day)
   } else {
     newSchedules[index].days = [...currentDays, day].sort()
   }

   setSchedules(newSchedules)
 }

 // 分を時間:分形式に変換
 const minutesToTimeString = (minutes: number) => {
   const hours = Math.floor(minutes / 60)
   const mins = minutes % 60
   return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
 }

 // 時間:分形式を分に変換
 const timeStringToMinutes = (timeString: string) => {
   const [hours, minutes] = timeString.split(":").map(Number)
   return hours * 60 + minutes
 }

 const onSubmit = async (data: AdSetFormValues) => {
   setIsLoading(true)
   setError(null)
   setSuccess(null)

   try {
     const selectedCampaign = campaigns.find((campaign) => campaign.campaign_id === data.campaign_id)
     if (!selectedCampaign) {
       throw new Error("選択されたキャンペーンが見つかりません")
     }

     // 広告セットIDの生成または既存IDの使用
     const newAdSetId = isEditing ? adSetId! : LocalStorage.generateNewAdSetId(data.campaign_id)

     // 予算設定
     const dailyBudget = data.budget_type === "daily" ? data.daily_budget : undefined
     const lifetimeBudget = data.budget_type === "lifetime" ? data.lifetime_budget : undefined

     // 開始日時と終了日時をUTC ISO形式に変換
     const startTime = data.start_date.toISOString()
     const endTime = data.end_date ? data.end_date.toISOString() : undefined

     // ターゲティング設定の構築
     const targeting: AdSetTargeting = {
       age_min: data.age_min ? Number.parseInt(data.age_min) : 18,
       age_max: data.age_max ? Number.parseInt(data.age_max) : 65,
       genders:
         data.gender === "all" ? [1, 2] : data.gender === "male" ? [1] : data.gender === "female" ? [2] : undefined,
       geo_locations: {
         countries: data.countries ? data.countries.split(",") : ["JP"],
       },
       device_platforms: data.device_platforms || ["mobile", "desktop"],
       publisher_platforms: data.publisher_platforms || ["facebook", "instagram"],
     }

     // 頻度制御設定
     const frequencyControlSpecs = data.use_frequency_cap
       ? [
           {
             event: "IMPRESSIONS",
             max_frequency: Number.parseInt(data.max_frequency || "3"),
             time_window: Number.parseInt(data.frequency_time_window || "7"),
           },
         ]
       : undefined

     // 広告セットデータの構築
     const adSetData: AdSet = {
       adset_id: newAdSetId,
       adset_name: data.adset_name,
       campaign_id: data.campaign_id,
       campaign_name: selectedCampaign.campaign_name,
       daily_budget: dailyBudget,
       lifetime_budget: lifetimeBudget,
       start_time: startTime,
       end_time: endTime,
       billing_event: data.billing_event,
       optimization_goal: data.optimization_goal,
       bid_strategy: data.bid_strategy,
       bid_amount: data.bid_amount,
       targeting: targeting,
       pacing_type: [data.pacing_type],
       adset_schedule: data.use_schedule ? schedules : undefined,
       frequency_control_specs: frequencyControlSpecs,
       daily_min_spend_target: data.daily_min_spend_target || undefined,
       daily_spend_cap: data.daily_spend_cap || undefined,
       created_at: isEditing
         ? LocalStorage.getAdSetById(adSetId!)?.created_at || new Date().toISOString()
         : new Date().toISOString(),
       updated_at: new Date().toISOString(),
       status: "ACTIVE",
     }

     if (mode === "local") {
       // ローカルストレージに保存
       LocalStorage.saveAdSet(adSetData)
       setSuccess(`広告セット「${data.adset_name}」を${isEditing ? "更新" : "登録"}しました。`)
       router.push("/ads/ad-sets")
     } else if (mode === "mock-api") {
       // モックAPIに保存
       // 実装が必要な場合は追加
       setSuccess("モックAPIは現在使用できません")
     } else {
       // 実際のAPIに保存
       // 実装が必要な場合は追加
       setSuccess("実際のAPIは現在使用できません")
     }

     if (!isEditing) {
       // 新規作成の場合はフォームをリセット
       form.reset()
       setSchedules([])
     }
   } catch (err: any) {
     console.error("広告セット登録エラー:", err)
     setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
   } finally {
     setIsLoading(false)
   }
 }

 return (
   <Card className="w-full max-w-4xl mx-auto">
     <CardHeader className="flex flex-row items-center justify-between">
       <div>
         <CardTitle>{isEditing ? "広告セット編集" : "広告セット登録"}</CardTitle>
         <CardDescription>広告セットの基本情報を{isEditing ? "編集" : "登録"}します。</CardDescription>
       </div>
       <DatabaseModeSelector />
     </CardHeader>

     <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)}>
         <Tabs defaultValue="basic">
           <CardContent>
             {error && (
               <Alert variant="destructive" className="mb-4">
                 <AlertDescription>{error}</AlertDescription>
               </Alert>
             )}

             {success && (
               <Alert className="bg-green-50 border-green-500 text-green-700 mb-4">
                 <CheckCircle className="h-4 w-4 mr-2" />
                 <AlertDescription>{success}</AlertDescription>
               </Alert>
             )}

             <TabsList className="mb-4">
               <TabsTrigger value="basic">基本設定</TabsTrigger>
               <TabsTrigger value="targeting">ターゲティング</TabsTrigger>
               <TabsTrigger value="advanced">詳細設定</TabsTrigger>
             </TabsList>

             <TabsContent value="basic" className="space-y-4">
               <FormField
                 control={form.control}
                 name="adset_name"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>広告セット名</FormLabel>
                     <FormControl>
                       <Input placeholder="広告セット名を入力" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="campaign_id"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>キャンペーン</FormLabel>
                     <Select
                       onValueChange={field.onChange}
                       defaultValue={field.value}
                       disabled={isLoadingCampaigns || isEditing}
                     >
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="キャンペーンを選択" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {campaigns.map((campaign) => (
                           <SelectItem key={campaign.campaign_id} value={campaign.campaign_id}>
                             {campaign.campaign_name}
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
                   )}
               )}

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
                       <FormLabel>終了日（任意）</FormLabel>\
                       <DatePicker date={field.value} setDate={field.onChange} />
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>

               <FormField
                 control={form.control}
                 name="billing_event"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>課金イベント</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="課金イベントを選択" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {BILLING_EVENTS.map((event) => (
                           <SelectItem key={event.id} value={event.id}>
                             {event.name}
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
                 name="optimization_goal"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>最適化目標</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="最適化目標を選択" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {OPTIMIZATION_GOALS.map((goal) => (
                           <SelectItem key={goal.id} value={goal.id}>
                             {goal.name}
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
                 name="bid_strategy"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>入札戦略</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="入札戦略を選択" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {BID_STRATEGIES.map((strategy) => (
                           <SelectItem key={strategy.id} value={strategy.id}>
                             {strategy.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               {form.watch("bid_strategy") !== "LOWEST_COST_WITHOUT_CAP" && (
                 <FormField
                   control={form.control}
                   name="bid_amount"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>入札額</FormLabel>
                       <FormControl>
                         <Input placeholder="例: 100" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               )}
             </TabsContent>

             <TabsContent value="targeting" className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                   control={form.control}
                   name="age_min"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>最小年齢</FormLabel>
                       <FormControl>
                         <Input placeholder="例: 18" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="age_max"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>最大年齢</FormLabel>
                       <FormControl>
                         <Input placeholder="例: 65" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>

               <FormField
                 control={form.control}
                 name="gender"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>性別</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="性別を選択" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="all">すべて</SelectItem>
                         <SelectItem value="male">男性</SelectItem>
                         <SelectItem value="female">女性</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="countries"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>国</FormLabel>
                     <FormControl>
                       <Input placeholder="例: JP,US,GB（カンマ区切り）" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="device_platforms"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>デバイスプラットフォーム</FormLabel>
                     <div className="flex flex-wrap gap-4">
                       <div className="flex items-center space-x-2">
                         <Checkbox
                           id="mobile"
                           checked={field.value?.includes("mobile")}
                           onCheckedChange={(checked) => {
                             const current = field.value || []
                             if (checked) {
                               field.onChange([...current, "mobile"])
                             } else {
                               field.onChange(current.filter((item) => item !== "mobile"))
                             }
                           }}
                         />
                         <label
                           htmlFor="mobile"
                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                         >
                           モバイル
                         </label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Checkbox
                           id="desktop"
                           checked={field.value?.includes("desktop")}
                           onCheckedChange={(checked) => {
                             const current = field.value || []
                             if (checked) {
                               field.onChange([...current, "desktop"])
                             } else {
                               field.onChange(current.filter((item) => item !== "desktop"))
                             }
                           }}
                         />
                         <label
                           htmlFor="desktop"
                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                         >
                           デスクトップ
                         </label>
                       </div>
                     </div>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="publisher_platforms"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>配信先プラットフォーム</FormLabel>
                     <div className="flex flex-wrap gap-4">
                       <div className="flex items-center space-x-2">
                         <Checkbox
                           id="facebook"
                           checked={field.value?.includes("facebook")}
                           onCheckedChange={(checked) => {
                             const current = field.value || []
                             if (checked) {
                               field.onChange([...current, "facebook"])
                             } else {
                               field.onChange(current.filter((item) => item !== "facebook"))
                             }
                           }}
                         />
                         <label
                           htmlFor="facebook"
                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                         >
                           Facebook
                         </label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Checkbox
                           id="instagram"
                           checked={field.value?.includes("instagram")}
                           onCheckedChange={(checked) => {
                             const current = field.value || []
                             if (checked) {
                               field.onChange([...current, "instagram"])
                             } else {
                               field.onChange(current.filter((item) => item !== "instagram"))
                             }
                           }}
                         />
                         <label
                           htmlFor="instagram"
                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                         >
                           Instagram
                         </label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Checkbox
                           id="audience_network"
                           checked={field.value?.includes("audience_network")}
                           onCheckedChange={(checked) => {
                             const current = field.value || []
                             if (checked) {
                               field.onChange([...current, "audience_network"])
                             } else {
                               field.onChange(current.filter((item) => item !== "audience_network"))
                             }
                           }}
                         />
                         <label
                           htmlFor="audience_network"
                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                         >
                           Audience Network
                         </label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Checkbox
                           id="messenger"
                           checked={field.value?.includes("messenger")}
                           onCheckedChange={(checked) => {
                             const current = field.value || []
                             if (checked) {
                               field.onChange([...current, "messenger"])
                             } else {
                               field.onChange(current.filter((item) => item !== "messenger"))
                             }
                           }}
                         />
                         <label
                           htmlFor="messenger"
                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                         >
                           Messenger
                         </label>
                       </div>
                     </div>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </TabsContent>

             <TabsContent value="advanced" className="space-y-4">
               <FormField
                 control={form.control}
                 name="pacing_type"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>ペーシングタイプ</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="ペーシングタイプを選択" />
                         </SelectTrigger>
                         </FormControl>
                       <SelectContent>
                         {PACING_TYPES.map((type) => (
                           <SelectItem key={type.id} value={type.id}>
                             {type.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                   control={form.control}
                   name="daily_min_spend_target"
                   render={({ field }) => (
                     <FormItem>
                       
                       <FormLabel>1日あたりの最低消化金額</FormLabel>
                       <FormControl>
                         <Input placeholder="例: 1000" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="daily_spend_cap"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>1日あたりの上限消化金額</FormLabel>
                       <FormControl>
                         <Input placeholder="例: 5000" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>

               <FormField
                 control={form.control}
                 name="use_frequency_cap"
                 render={({ field }) => (
                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                     <div className="space-y-0.5">
                       <FormLabel className="text-base">頻度制御を使用</FormLabel>
                       <FormDescription>同一ユーザーへの広告表示回数を制限します</FormDescription>
                     </div>
                     <FormControl>
                       <Switch checked={field.value} onCheckedChange={field.onChange} />
                     </FormControl>
                   </FormItem>
                 )}
               />

               {form.watch("use_frequency_cap") && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="max_frequency"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>最大表示回数</FormLabel>
                         <FormControl>
                           <Input placeholder="例: 3" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />

                   <FormField
                     control={form.control}
                     name="frequency_time_window"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>期間（日数）</FormLabel>
                         <FormControl>
                           <Input placeholder="例: 7" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>
               )}

               <FormField
                 control={form.control}
                 name="use_schedule"
                 render={({ field }) => (
                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                     <div className="space-y-0.5">
                       <FormLabel className="text-base">配信スケジュールを使用</FormLabel>
                       <FormDescription>特定の曜日・時間帯に配信を制限します</FormDescription>
                     </div>
                     <FormControl>
                       <Switch checked={field.value} onCheckedChange={field.onChange} />
                     </FormControl>
                   </FormItem>
                 )}
               />

               {form.watch("use_schedule") && (
                 <div className="space-y-4 border rounded-lg p-4">
                   <div className="flex justify-between items-center">
                     <h3 className="text-lg font-medium">配信スケジュール</h3>
                     <Button type="button" variant="outline" size="sm" onClick={addSchedule}>
                       <Plus className="h-4 w-4 mr-2" />
                       スケジュール追加
                     </Button>
                   </div>

                   {schedules.length === 0 ? (
                     <p className="text-sm text-muted-foreground">
                       スケジュールが設定されていません。「スケジュール追加」ボタンをクリックしてスケジュールを追加してください。
                     </p>
                   ) : (
                     schedules.map((schedule, index) => (
                       <div key={index} className="border rounded-md p-4 space-y-4">
                         <div className="flex justify-between items-center">
                           <h4 className="font-medium">スケジュール #{index + 1}</h4>
                           <Button type="button" variant="ghost" size="sm" onClick={() => removeSchedule(index)}>
                             <Trash className="h-4 w-4 text-red-500" />
                           </Button>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                             <label className="block text-sm font-medium mb-1">開始時間</label>
                             <Input
                               type="time"
                               value={minutesToTimeString(schedule.start_minute)}
                               onChange={(e) =>
                                 updateSchedule(index, "start_minute", timeStringToMinutes(e.target.value))
                               }
                             />
                           </div>
                           <div>
                             <label className="block text-sm font-medium mb-1">終了時間</label>
                             <Input
                               type="time"
                               value={minutesToTimeString(schedule.end_minute)}
                               onChange={(e) =>
                                 updateSchedule(index, "end_minute", timeStringToMinutes(e.target.value))
                               }
                             />
                           </div>
                         </div>

                         <div>
                           <label className="block text-sm font-medium mb-2">曜日</label>
                           <div className="flex flex-wrap gap-2">
                             {[
                               { day: 1, label: "月" },
                               { day: 2, label: "火" },
                               { day: 3, label: "水" },
                               { day: 4, label: "木" },
                               { day: 5, label: "金" },
                               { day: 6, label: "土" },
                               { day: 7, label: "日" },
                             ].map(({ day, label }) => (
                               <div
                                 key={day}
                                 className={`cursor-pointer rounded-md px-3 py-1 text-sm ${
                                   schedule.days.includes(day)
                                     ? "bg-primary text-primary-foreground"
                                     : "bg-muted text-muted-foreground"
                                 }`}
                                 onClick={() => toggleDay(index, day)}
                               >
                                 {label}
                               </div>
                             ))}
                           </div>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               )}
             </TabsContent>
           </CardContent>
         </Tabs>

         <CardFooter>
           <Button type="submit" disabled={isLoading} className="w-full">
             {isLoading ? (
               <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 {isEditing ? "更新中..." : "登録中..."}
               </>
             ) : isEditing ? (
               "広告セットを更新"
             ) : (
               "広告セットを登録"
             )}
           </Button>
         </CardFooter>
       </form>
     </Form>
   </Card>
 )
}
