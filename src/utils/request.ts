import eWeLink from 'ewelink-api-next';

// 1. 初始化 eWeLink
const eWeLinkClient = new eWeLink.WebAPI({
  appId: import.meta.env.VITE_EWELINK_APP_ID,
  appSecret: import.meta.env.VITE_EWELINK_APP_SECRET,
  region: 'cn', // us、as、eu
  logObj: eWeLink.createLogger('cn')
});

export const eWeLinkService = {
  /**
   * 用户登录
   * @param account 手机号
   * @param password 密码
   * @param areaCode 区号
   */
  async login(account: string, password: string, areaCode: string = '+86') {
    const response = await eWeLinkClient.user.login({
      account,
      password,
      areaCode
    });
  }
};
