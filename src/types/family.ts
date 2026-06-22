// 家庭成员
export interface FamilyMember {
  apikey: string

  phoneNumber?: string

  email?: string

  nickname?: string

  // 备注
  comment?: string

  // 分享时间
  shareDate?: string

  // 过期时间
  expiredAt?: string
}

// 房间信息
export interface Room {
  id: string

  name: string

  index: number

  thingsNum?: number
}

// 家庭类型
interface FamilyType {
  // 1 自己的家庭 2 别人分享的家庭
  familyType: 1 | 2
}

// 家庭信息
export interface Family {
  id: string

  name: string

  index: number

  // 房间列表
  roomList?: Room[]

  familyType: FamilyType

  members: FamilyMember[]
}

// 接口响应
export interface IFamilyListResponse {
  // 家庭列表
  familyList: Family[]

  // 当前家庭 id
  currentFamilyId: string

  hasChangedCurrentFamily: boolean
}
