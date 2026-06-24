interface IDeviceExtra {
  model: string
}

export interface IDeviceSwitch {
  switch: string
  outlet: number
}

export interface IDeviceParams {
  switches: IDeviceSwitch[]
}

interface IDeviceInfo {
  name: string
  deviceid: string
  online: boolean
  extra: IDeviceExtra
  params: IDeviceParams
  family: IDeviceFamily
}

interface IDeviceFamily {
  familyid: string
  index: number
  roomid: string
}
export interface IThingItem {
  itemType: number
  itemData: IDeviceInfo
  index: number
}

export interface IThingListResponse {
  thingList: IThingItem[]
  total: number
  filterTotal: number
}
