"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type DatabaseMode = "local" | "mock-api" | "api"

interface DatabaseContextType {
  mode: DatabaseMode
  setMode: (mode: DatabaseMode) => void
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)

export function DatabaseContextProvider({ children }: { children: ReactNode }) {
  // ローカルストレージから初期モードを取得、なければlocalをデフォルトに
  const [mode, setMode] = useState<DatabaseMode>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("databaseMode") as DatabaseMode
      return savedMode || "local"
    }
    return "local"
  })

  // モード変更時にローカルストレージに保存
  const handleSetMode = (newMode: DatabaseMode) => {
    setMode(newMode)
    if (typeof window !== "undefined") {
      localStorage.setItem("databaseMode", newMode)
    }
  }

  return <DatabaseContext.Provider value={{ mode, setMode: handleSetMode }}>{children}</DatabaseContext.Provider>
}

export function useDatabase() {
  const context = useContext(DatabaseContext)
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseContextProvider")
  }
  return context
}
