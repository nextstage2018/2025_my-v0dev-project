import { NextResponse } from "next/server"
import { BigQuery } from "@google-cloud/bigquery"

export async function GET() {
  try {
    // 環境変数からBigQueryの設定を取得
    const projectId = process.env.BIGQUERY_PROJECT_ID
    const datasetId = process.env.BIGQUERY_DATASET_ID
    const region = process.env.BIGQUERY_REGION

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

    // BigQueryクライアントの初期化
    const bigquery = new BigQuery({
      projectId,
      location: region || "asia-northeast1",
    })

    // データセットの存在確認
    const [datasets] = await bigquery.getDatasets()
    const datasetExists = datasets.some((dataset) => dataset.id === datasetId)

    if (!datasetExists) {
      return NextResponse.json(
        {
          success: false,
          message: `データセット '${datasetId}' が見つかりません`,
          datasets: datasets.map((dataset) => dataset.id),
        },
        { status: 404 },
      )
    }

    // テストクエリの実行
    const query = `SELECT 'BigQuery接続成功' as message, CURRENT_TIMESTAMP() as timestamp`
    const [rows] = await bigquery.query({ query })

    return NextResponse.json({
      success: true,
      message: "接続テスト成功",
      result: rows[0],
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
