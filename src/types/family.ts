// 家庭成员
export interface IFamilyMember {
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
export interface IRoom {
  id: string

  name: string

  index: number

  thingsNum?: number
}

// 家庭类型
interface IFamilyType {
  // 1 自己的家庭 2 别人分享的家庭
  familyType: 1 | 2
}

// 家庭信息
export interface IFamily {
  id: string

  name: string

  index: number

  // 房间列表
  roomList?: IRoom[]

  familyType: IFamilyType

  members: IFamilyMember[]
}

// 接口响应
export interface IFamilyListResponse {
  // 家庭列表
  familyList: IFamily[]

  // 当前家庭 id
  currentFamilyId: string

  hasChangedCurrentFamily: boolean
}
