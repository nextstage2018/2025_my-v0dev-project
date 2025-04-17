import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 環境変数からBigQueryの設定を取得
    const projectId = process.env.BIGQUERY_PROJECT_ID || ""
    const datasetId = process.env.BIGQUERY_DATASET_ID || ""
    const region = process.env.BIGQUERY_REGION || ""

    // 環境変数が設定されていない場合
    if (!projectId || !datasetId) {
      return NextResponse.json(
        {
          success: false,
          message: "環境変数が設定されていません",
          details: {
            projectId: projectId ? "設定済み" : "未設定",
            datasetId: datasetId ? "設定済み" : "未設定",
            region: region || "未設定",
          },
        },
        { status: 500 },
      )
    }

    // 実際のBigQuery接続はデプロイ後に行うため、ここではモックレスポンスを返す
    return NextResponse.json({
      success: true,
      message: "接続テスト成功（モック）",
      result: {
        message: "BigQuery接続成功",
        timestamp: new Date().toISOString(),
      },
      environment: {
        projectId,
        datasetId,
        region: region || "デフォルト (asia-northeast1)",
      },
    })
  } catch (error: any) {
    console.error("BigQuery接続エラー:", error)

    return NextResponse.json(
      {
        success: false,
        message: "BigQueryへの接続に失敗しました",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
