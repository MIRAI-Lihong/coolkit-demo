export interface IDeviceSwitch {
  switch: string
  outlet: number
}

export interface IDeviceParams {
  // 开关数据
  switches: IDeviceSwitch[]
}

interface IChannelName {
  [index: string]: string
}

interface ITags {
  ck_channel_name: IChannelName
}

interface IDeviceInfo {
  // 设备名
  name: string
  deviceid: string
  // 是否在线
  online: boolean
  params: IDeviceParams
  // 所属家庭
  family: IDeviceFamily
  tags: ITags
}

interface IDeviceFamily {
  familyid: string
  index: number
  roomid: string
}
export interface IThingItem {
  itemType: number
  // 设备数据
  itemData: IDeviceInfo
  index: number
}

export interface IThingListResponse {
  thingList: IThingItem[]
}
