import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"

export default function AdSetDetailsPage({ params }: { params: { id: string } }) {
  // 実際のアプリケーションでは、ここでIDを使用してデータを取得します
  const adSetId = params.id

  // サンプルデータ（実際のアプリケーションではAPIやLocalStorageから取得）
  const adSet = {
    adset_id: adSetId,
    adset_name: "メインターゲット広告セット",
    campaign_id: "campaign_123456",
    campaign_name: "夏季プロモーションキャンペーン",
    daily_budget: "20000",
    lifetime_budget: "",
    start_time: "2023-06-01T00:00:00.000Z",
    end_time: "2023-08-31T23:59:59.000Z",
    billing_event: "IMPRESSIONS",
    optimization_goal: "REACH",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    bid_amount: "",
    targeting: {
      age_min: 18,
      age_max: 35,
      genders: [1, 2],
      geo_locations: {
        countries: ["JP"],
        regions: [{ key: "JP-13" }, { key: "JP-27" }],
      },
      device_platforms: ["mobile", "desktop"],
      publisher_platforms: ["facebook", "instagram"],
    },
    pacing_type: ["STANDARD"],
    status: "ACTIVE",
    created_at: "2023-05-15T10:30:00.000Z",
    updated_at: "2023-05-20T15:45:00.000Z",
  }

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/ad-sets">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            広告セット一覧に戻る
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">広告セット詳細</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{adSet.adset_name}</CardTitle>
            <CardDescription>広告セットの基本情報</CardDescription>
          </div>
          <Link href={`/ad-sets/edit/${adSetId}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              編集
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">広告セットID</h3>
              <p className="mt-1">{adSet.adset_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">キャンペーン</h3>
              <p className="mt-1">
                <Link href={`/campaigns/${adSet.campaign_id}`} className="text-blue-600 hover:underline">
                  {adSet.campaign_name}
                </Link>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ステータス</h3>
              <p className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  アクティブ
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">予算</h3>
              <p className="mt-1">
                {adSet.daily_budget ? `日予算: ¥${Number(adSet.daily_budget).toLocaleString()}` : ""}
                {adSet.lifetime_budget ? `総予算: ¥${Number(adSet.lifetime_budget).toLocaleString()}` : ""}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">開始日</h3>
              <p className="mt-1">{formatDate(adSet.start_time)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">終了日</h3>
              <p className="mt-1">{adSet.end_time ? formatDate(adSet.end_time) : "設定なし"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">課金イベント</h3>
              <p className="mt-1">
                {adSet.billing_event === "IMPRESSIONS"
                  ? "インプレッション"
                  : adSet.billing_event === "LINK_CLICKS"
                    ? "リンククリック"
                    : adSet.billing_event}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">最適化目標</h3>
              <p className="mt-1">
                {adSet.optimization_goal === "REACH"
                  ? "リーチ"
                  : adSet.optimization_goal === "IMPRESSIONS"
                    ? "インプレッション"
                    : adSet.optimization_goal}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ターゲティング設定</CardTitle>
          <CardDescription>広告セットのターゲティング情報</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">年齢</h3>
              <p className="mt-1">
                {adSet.targeting?.age_min} 〜 {adSet.targeting?.age_max} 歳
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">性別</h3>
              <p className="mt-1">
                {adSet.targeting?.genders?.includes(1) && adSet.targeting?.genders?.includes(2)
                  ? "すべて"
                  : adSet.targeting?.genders?.includes(1)
                    ? "男性"
                    : adSet.targeting?.genders?.includes(2)
                      ? "女性"
                      : "指定なし"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">地域</h3>
              <p className="mt-1">
                {adSet.targeting?.geo_locations?.countries?.join(", ")}
                {adSet.targeting?.geo_locations?.regions?.length
                  ? ` (${adSet.targeting.geo_locations.regions.map((r) => r.key).join(", ")})`
                  : ""}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">デバイス</h3>
              <p className="mt-1">{adSet.targeting?.device_platforms?.join(", ")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">配信先プラットフォーム</h3>
              <p className="mt-1">{adSet.targeting?.publisher_platforms?.join(", ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>詳細設定</CardTitle>
          <CardDescription>広告セットの詳細設定情報</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">ペーシングタイプ</h3>
              <p className="mt-1">
                {adSet.pacing_type?.includes("STANDARD") ? "標準（均等配信）" : "ペーシングなし（できるだけ早く配信）"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">入札戦略</h3>
              <p className="mt-1">
                {adSet.bid_strategy === "LOWEST_COST_WITHOUT_CAP"
                  ? "最低コスト（上限なし）"
                  : adSet.bid_strategy === "LOWEST_COST_WITH_BID_CAP"
                    ? "最低コスト（上限あり）"
                    : adSet.bid_strategy === "COST_CAP"
                      ? "コスト上限"
                      : adSet.bid_strategy === "TARGET_COST"
                        ? "目標コスト"
                        : adSet.bid_strategy}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">作成日時</h3>
              <p className="mt-1">{new Date(adSet.created_at).toLocaleString("ja-JP")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">更新日時</h3>
              <p className="mt-1">{new Date(adSet.updated_at).toLocaleString("ja-JP")}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end space-x-2 w-full">
            <Link href={`/ad-sets/edit/${adSetId}`}>
              <Button>広告セットを編集</Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
