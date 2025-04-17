// 広告セットのターゲティング設定
export interface AdSetTargeting {
  age_min?: number
  age_max?: number
  genders?: number[]
  geo_locations?: {
    countries?: string[]
    regions?: { key: string }[]
    cities?: { key: string }[]
  }
  device_platforms?: string[]
  publisher_platforms?: string[]
  facebook_positions?: string[]
  instagram_positions?: string[]
  audience_network_positions?: string[]
  messenger_positions?: string[]
  interests?: { id: string; name: string }[]
  behaviors?: { id: string; name: string }[]
  excluded_interests?: { id: string; name: string }[]
  excluded_behaviors?: { id: string; name: string }[]
}

// 広告セットのスケジュール設定
export interface AdSetSchedule {
  days: number[] // 1=月曜日, 2=火曜日, ..., 7=日曜日
  start_minute: number // 0-1439 (0=0:00, 1439=23:59)
  end_minute: number // 0-1439 (0=0:00, 1439=23:59)
}

// 広告セットの頻度制御設定
export interface FrequencyControlSpec {
  event: string // "IMPRESSIONS"
  max_frequency: number
  time_window: number // 日数
}

// 広告セットのプロモーションオブジェクト
export interface PromotedObject {
  pixel_id?: string
  page_id?: string
  application_id?: string
  product_set_id?: string
}

// 広告セットデータ型
export interface AdSet {
  adset_id: string
  campaign_id: string
  campaign_name?: string
  adset_name: string
  daily_budget?: string
  lifetime_budget?: string
  start_time: string
  end_time?: string
  billing_event: string
  optimization_goal: string
  bid_strategy: string
  bid_amount?: string
  targeting?: AdSetTargeting
  pacing_type?: string[]
  adset_schedule?: AdSetSchedule[]
  frequency_control_specs?: FrequencyControlSpec[]
  daily_min_spend_target?: string
  daily_spend_cap?: string
  promoted_object?: PromotedObject
  status: string
  created_at: string
  updated_at: string
}

// 課金イベント
export const BILLING_EVENTS = [
  { id: "IMPRESSIONS", name: "インプレッション" },
  { id: "LINK_CLICKS", name: "リンククリック" },
  { id: "APP_INSTALLS", name: "アプリインストール" },
  { id: "CONVERSIONS", name: "コンバージョン" },
  { id: "PURCHASE", name: "購入" },
  { id: "PAGE_LIKES", name: "ページいいね" },
  { id: "POST_ENGAGEMENT", name: "投稿エンゲージメント" },
]

// 最適化目標
export const OPTIMIZATION_GOALS = [
  { id: "REACH", name: "リーチ" },
  { id: "IMPRESSIONS", name: "インプレッション" },
  { id: "LINK_CLICKS", name: "リンククリック" },
  { id: "APP_INSTALLS", name: "アプリインストール" },
  { id: "CONVERSIONS", name: "コンバージョン" },
  { id: "OFFSITE_CONVERSIONS", name: "オフサイトコンバージョン" },
  { id: "PAGE_LIKES", name: "ページいいね" },
  { id: "POST_ENGAGEMENT", name: "投稿エンゲージメント" },
  { id: "VALUE", name: "購入価値" },
  { id: "THRUPLAY", name: "スループレイ" },
]

// 入札戦略
export const BID_STRATEGIES = [
  { id: "LOWEST_COST_WITHOUT_CAP", name: "最低コスト（上限なし）" },
  { id: "LOWEST_COST_WITH_BID_CAP", name: "最低コスト（上限あり）" },
  { id: "COST_CAP", name: "コスト上限" },
  { id: "TARGET_COST", name: "目標コスト" },
]

// ペーシングタイプ
export const PACING_TYPES = [
  { id: "STANDARD", name: "標準（均等配信）" },
  { id: "NO_PACING", name: "ペーシングなし（できるだけ早く配信）" },
]
