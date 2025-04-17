import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">広告管理ツール</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>クライアント管理</CardTitle>
            <CardDescription>広告主の情報を管理します</CardDescription>
          </CardHeader>
          <CardContent>
            <p>クライアント情報の登録、編集、一覧表示を行います。</p>
          </CardContent>
          <CardFooter>
            <Link href="/clients" className="w-full">
              <Button className="w-full">クライアント一覧へ</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>プロジェクト管理</CardTitle>
            <CardDescription>広告プロジェクトを管理します</CardDescription>
          </CardHeader>
          <CardContent>
            <p>プロジェクト情報の登録、編集、一覧表示を行います。</p>
          </CardContent>
          <CardFooter>
            <Link href="/projects" className="w-full">
              <Button className="w-full">プロジェクト一覧へ</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>キャンペーン管理</CardTitle>
            <CardDescription>広告キャンペーンを管理します</CardDescription>
          </CardHeader>
          <CardContent>
            <p>キャンペーン情報の登録、編集、一覧表示を行います。</p>
          </CardContent>
          <CardFooter>
            <Link href="/campaigns" className="w-full">
              <Button className="w-full">キャンペーン一覧へ</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>広告セット管理</CardTitle>
            <CardDescription>広告セットを管理します</CardDescription>
          </CardHeader>
          <CardContent>
            <p>広告セット情報の登録、編集、一覧表示を行います。</p>
          </CardContent>
          <CardFooter>
            <Link href="/ad-sets" className="w-full">
              <Button className="w-full">広告セット一覧へ</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>広告管理</CardTitle>
            <CardDescription>広告クリエイティブを管理します</CardDescription>
          </CardHeader>
          <CardContent>
            <p>広告情報の登録、編集、一覧表示を行います。</p>
          </CardContent>
          <CardFooter>
            <Link href="/ads" className="w-full">
              <Button className="w-full">広告一覧へ</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>BigQuery接続テスト</CardTitle>
            <CardDescription>BigQueryへの接続をテストします</CardDescription>
          </CardHeader>
          <CardContent>
            <p>BigQueryへの接続状態を確認します。</p>
          </CardContent>
          <CardFooter>
            <Link href="/api/test-bigquery" className="w-full">
              <Button className="w-full" variant="outline">
                接続テスト実行
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
