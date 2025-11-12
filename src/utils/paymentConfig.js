// 支付配置文件 - 存储支付宝和微信支付所需参数

// 注意：在生产环境中，实际的支付密钥和敏感信息应该存储在服务器端，
// 这里仅作为前端配置的示例，真实项目中请将敏感参数通过后端API获取

const paymentConfig = {
  // 支付宝支付配置
  alipay: {
    // 应用ID - 由支付宝开放平台分配
    appId: '2021000000000000', // 示例ID，实际需替换
    
    // 商户私钥 - 实际应存储在服务器端
    merchantPrivateKey: 'YOUR_MERCHANT_PRIVATE_KEY',
    
    // 支付宝公钥 - 实际应存储在服务器端
    alipayPublicKey: 'ALIPAY_PUBLIC_KEY',
    
    // 支付网关URL
    gatewayUrl: 'https://openapi.alipaydev.com/gateway.do', // 沙箱环境
    // gatewayUrl: 'https://openapi.alipay.com/gateway.do', // 生产环境
    
    // 回调地址 - 支付完成后支付宝异步通知的地址
    notifyUrl: 'https://your-server.com/api/payments/alipay/notify',
    
    // 同步跳转地址 - 支付完成后页面跳转的地址
    returnUrl: 'https://your-app.com/payment/success',
    
    //  charset
    charset: 'UTF-8',
    
    // 签名方式
    signType: 'RSA2'
  },
  
  // 微信支付配置
  wechatpay: {
    // 应用ID
    appId: 'wx1234567890abcdef', // 示例ID，实际需替换
    
    // 商户号
    mchId: '1234567890', // 示例商户号，实际需替换
    
    // 商户API密钥
    apiKey: 'YOUR_WECHAT_API_KEY', // 实际应存储在服务器端
    
    // 支付网关URL
    gatewayUrl: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    
    // 回调地址 - 支付完成后微信异步通知的地址
    notifyUrl: 'https://your-server.com/api/payments/wechat/notify',
    
    // 证书路径 - 实际应存储在服务器端
    certPath: '/path/to/cert/apiclient_cert.pem',
    keyPath: '/path/to/cert/apiclient_key.pem',
    
    // 交易类型
    tradeType: 'JSAPI' // 公众号支付
  },
  
  // 通用配置
  common: {
    // 支付超时时间（分钟）
    timeoutMinutes: 30,
    
    // 货币单位
    currency: 'CNY',
    
    // 最小打赏金额（元）
    minAmount: 0.01,
    
    // 最大打赏金额（元）
    maxAmount: 9999.99,
    
    // 默认打赏金额选项
    defaultAmounts: [0.5, 1, 2, 5, 10]
  }
};

export default paymentConfig;

/*
注意事项：
1. 以上配置中的密钥和敏感信息在真实项目中应通过后端API获取，不应硬编码在前端
2. 前端只负责发起支付请求和展示支付界面
3. 实际的支付验证和订单处理逻辑必须在后端实现
4. 支付宝和微信支付都需要在各自的开放平台进行商户资质认证
5. 对于前端调起支付，通常需要后端生成支付参数后返回给前端使用
*/