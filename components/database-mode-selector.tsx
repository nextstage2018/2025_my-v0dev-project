"use client"

import { useDatabase } from "@/contexts/database-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, Server, HardDrive } from "lucide-react"

export default function DatabaseModeSelector() {
  const { mode, setMode } = useDatabase()

  return (
    <div className="flex items-center space-x-2">
      <Select value={mode} onValueChange={(value) => setMode(value as "local" | "mock-api" | "api")}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="データベースモード" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="local">
            <div className="flex items-center">
              <HardDrive className="mr-2 h-4 w-4" />
              <span>ローカル</span>
            </div>
          </SelectItem>
          <SelectItem value="mock-api">
            <div className="flex items-center">
              <Server className="mr-2 h-4 w-4" />
              <span>モックAPI</span>
            </div>
          </SelectItem>
          <SelectItem value="api">
            <div className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              <span>BigQuery API</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
