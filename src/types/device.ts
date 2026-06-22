interface DeviceExtra {
  model: string
}

interface DeviceSwitch {
  switch: string
  outlet: number
}

interface DeviceParams {
  switches: DeviceSwitch[]
}

interface DeviceInfo {
  name: string
  deviceid: string
  online: boolean
  extra: DeviceExtra
  params: DeviceParams
}

interface ThingItem {
  itemType: number
  itemData: DeviceInfo
  index: number
}

export interface ThingListResponse {
  thingList: ThingItem[]
  total: number
  filterTotal: number
}
