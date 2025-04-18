// ローカルストレージを使用したデータ操作ユーティリティ

// クライアント
export interface Client {
  client_id: string
  client_name: string
  industry_category?: string
  contact_person?: string
  email?: string
  phone?: string
  created_at: string
  updated_at: string
}

// プロジェクト
export interface Project {
  project_id: string
  client_id: string
  client_name?: string
  project_name: string
  description?: string
  start_date?: string
  end_date?: string
  status: string
  created_at: string
  updated_at: string
}

// キャンペーン
export interface Campaign {
  campaign_id: string
  project_id: string
  project_name?: string
  campaign_name: string
  objective: string
  special_ad_category?: string
  status: string
  daily_budget?: string
  lifetime_budget?: string
  start_time: string
  end_time?: string
  created_at: string
  updated_at: string
}

// 広告セット
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
  targeting?: any
  pacing_type?: string[]
  adset_schedule?: any[]
  frequency_control_specs?: any[]
  daily_min_spend_target?: string
  daily_spend_cap?: string
  status: string
  created_at: string
  updated_at: string
}

// 広告
export interface Ad {
  ad_id: string
  adset_id: string
  adset_name?: string
  ad_name: string
  status: string
  creative_type: string
  creative: any
  created_at: string
  updated_at: string
}

// ローカルストレージのキー
const STORAGE_KEYS = {
  CLIENTS: "ad_management_clients",
  PROJECTS: "ad_management_projects",
  CAMPAIGNS: "ad_management_campaigns",
  AD_SETS: "ad_management_ad_sets",
  ADS: "ad_management_ads",
}

// ローカルストレージからデータを取得
function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  const item = localStorage.getItem(key)
  if (!item) return defaultValue

  try {
    return JSON.parse(item) as T
  } catch (e) {
    console.error(`Error parsing localStorage item ${key}:`, e)
    return defaultValue
  }
}

// ローカルストレージにデータを保存
function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// クライアント関連の関数
export function getClients(): Client[] {
  return getStorageItem<Client[]>(STORAGE_KEYS.CLIENTS, [])
}

export function getClientById(clientId: string): Client | undefined {
  const clients = getClients()
  return clients.find((client) => client.client_id === clientId)
}

export function saveClient(client: Client): void {
  const clients = getClients()
  const existingIndex = clients.findIndex((c) => c.client_id === client.client_id)

  if (existingIndex >= 0) {
    // 既存のクライアントを更新
    clients[existingIndex] = client
  } else {
    // 新しいクライアントを追加
    clients.push(client)
  }

  setStorageItem(STORAGE_KEYS.CLIENTS, clients)
}

export function deleteClient(clientId: string): void {
  const clients = getClients().filter((client) => client.client_id !== clientId)
  setStorageItem(STORAGE_KEYS.CLIENTS, clients)
}

// 命名規則に従ったクライアントID生成
export function generateNewClientId(): string {
  // 現在のクライアント数を取得し、次の番号を生成
  const clients = getClients()
  const nextNum = clients.length + 1
  // 5桁の数字にフォーマット（例：00001）
  const formattedNum = nextNum.toString().padStart(5, "0")
  return `cl${formattedNum}`
}

// プロジェクト関連の関数
export function getProjects(): Project[] {
  return getStorageItem<Project[]>(STORAGE_KEYS.PROJECTS, [])
}

export function getProjectById(projectId: string): Project | undefined {
  const projects = getProjects()
  return projects.find((project) => project.project_id === projectId)
}

export function getProjectsByClientId(clientId: string): Project[] {
  const projects = getProjects()
  return projects.filter((project) => project.client_id === clientId)
}

export function saveProject(project: Project): void {
  const projects = getProjects()
  const existingIndex = projects.findIndex((p) => p.project_id === project.project_id)

  if (existingIndex >= 0) {
    // 既存のプロジェクトを更新
    projects[existingIndex] = project
  } else {
    // 新しいプロジェクトを追加
    projects.push(project)
  }

  setStorageItem(STORAGE_KEYS.PROJECTS, projects)
}

export function deleteProject(projectId: string): void {
  const projects = getProjects().filter((project) => project.project_id !== projectId)
  setStorageItem(STORAGE_KEYS.PROJECTS, projects)
}

// 命名規則に従ったプロジェクトID生成
export function generateNewProjectId(clientId: string): string {
  // 同じクライアントに属するプロジェクト数を取得
  const clientProjects = getProjectsByClientId(clientId)
  const nextNum = clientProjects.length + 1
  // 5桁の数字にフォーマット（例：00001）
  const formattedNum = nextNum.toString().padStart(5, "0")
  return `${clientId}_pr${formattedNum}`
}

// キャンペーン関連の関数
export function getCampaigns(): Campaign[] {
  return getStorageItem<Campaign[]>(STORAGE_KEYS.CAMPAIGNS, [])
}

export function getCampaignById(campaignId: string): Campaign | undefined {
  const campaigns = getCampaigns()
  return campaigns.find((campaign) => campaign.campaign_id === campaignId)
}

export function getCampaignsByProjectId(projectId: string): Campaign[] {
  const campaigns = getCampaigns()
  return campaigns.filter((campaign) => campaign.project_id === projectId)
}

export function saveCampaign(campaign: Campaign): void {
  const campaigns = getCampaigns()
  const existingIndex = campaigns.findIndex((c) => c.campaign_id === campaign.campaign_id)

  if (existingIndex >= 0) {
    // 既存のキャンペーンを更新
    campaigns[existingIndex] = campaign
  } else {
    // 新しいキャンペーンを追加
    campaigns.push(campaign)
  }

  setStorageItem(STORAGE_KEYS.CAMPAIGNS, campaigns)
}

export function deleteCampaign(campaignId: string): void {
  const campaigns = getCampaigns().filter((campaign) => campaign.campaign_id !== campaignId)
  setStorageItem(STORAGE_KEYS.CAMPAIGNS, campaigns)
}

// 命名規則に従ったキャンペーンID生成
export function generateNewCampaignId(projectId: string): string {
  // 同じプロジェクトに属するキャンペーン数を取得
  const projectCampaigns = getCampaignsByProjectId(projectId)
  const nextNum = projectCampaigns.length + 1
  // 5桁の数字にフォーマット（例：00001）
  const formattedNum = nextNum.toString().padStart(5, "0")
  return `${projectId}_ca${formattedNum}`
}

// 広告セット関連の関数
export function getAdSets(): AdSet[] {
  return getStorageItem<AdSet[]>(STORAGE_KEYS.AD_SETS, [])
}

export function getAdSetById(adSetId: string): AdSet | undefined {
  const adSets = getAdSets()
  return adSets.find((adSet) => adSet.adset_id === adSetId)
}

export function getAdSetsByCampaignId(campaignId: string): AdSet[] {
  const adSets = getAdSets()
  return adSets.filter((adSet) => adSet.campaign_id === campaignId)
}

export function saveAdSet(adSet: AdSet): void {
  const adSets = getAdSets()
  const existingIndex = adSets.findIndex((a) => a.adset_id === adSet.adset_id)

  if (existingIndex >= 0) {
    // 既存の広告セットを更新
    adSets[existingIndex] = adSet
  } else {
    // 新しい広告セットを追加
    adSets.push(adSet)
  }

  setStorageItem(STORAGE_KEYS.AD_SETS, adSets)
}

export function deleteAdSet(adSetId: string): void {
  const adSets = getAdSets().filter((adSet) => adSet.adset_id !== adSetId)
  setStorageItem(STORAGE_KEYS.AD_SETS, adSets)
}

// 命名規則に従った広告セットID生成
export function generateNewAdSetId(campaignId: string): string {
  // 同じキャンペーンに属する広告セット数を取得
  const campaignAdSets = getAdSetsByCampaignId(campaignId)
  const nextNum = campaignAdSets.length + 1
  // 5桁の数字にフォーマット（例：00001）
  const formattedNum = nextNum.toString().padStart(5, "0")
  return `${campaignId}_as${formattedNum}`
}

// 広告関連の関数
export function getAds(): Ad[] {
  return getStorageItem<Ad[]>(STORAGE_KEYS.ADS, [])
}

export function getAdById(adId: string): Ad | undefined {
  const ads = getAds()
  return ads.find((ad) => ad.ad_id === adId)
}

export function getAdsByAdSetId(adSetId: string): Ad[] {
  const ads = getAds()
  return ads.filter((ad) => ad.adset_id === adSetId)
}

export function saveAd(ad: Ad): void {
  const ads = getAds()
  const existingIndex = ads.findIndex((a) => a.ad_id === ad.ad_id)

  if (existingIndex >= 0) {
    // 既存の広告を更新
    ads[existingIndex] = ad
  } else {
    // 新しい広告を追加
    ads.push(ad)
  }

  setStorageItem(STORAGE_KEYS.ADS, ads)
}

export function deleteAd(adId: string): void {
  const ads = getAds().filter((ad) => ad.ad_id !== adId)
  setStorageItem(STORAGE_KEYS.ADS, ads)
}

// 命名規則に従った広告ID生成
export function generateNewAdId(adSetId: string): string {
  // 同じ広告セットに属する広告数を取得
  const adSetAds = getAdsByAdSetId(adSetId)
  const nextNum = adSetAds.length + 1
  // 5桁の数字にフォーマット（例：00001）
  const formattedNum = nextNum.toString().padStart(5, "0")
  return `${adSetId}_ad${formattedNum}`
}
