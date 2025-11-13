import React from 'react';
import soundManager from '../utils/soundManager';
import paymentConfig from '../utils/paymentConfig';
import zhiShowImage from '../res/zhi_show.png';
import weiShowImage from '../res/wei_show.png';
import './PaymentReceiveePage.css';

function PaymentReceiveePage({ onBackToHome }) {
  // 检测是否为移动设备
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // 处理支付方式点击
  const handlePaymentMethodClick = (paymentMethod) => {
    soundManager.playClickSound();
    
    if (isMobile()) {
      // 移动端：跳转到personUrl
      const personUrl = paymentMethod === 'alipay' 
        ? paymentConfig.alipay.personUrl 
        : paymentConfig.wechatpay.personUrl;
      
      if (personUrl) {
        window.location.href = personUrl;
      }
    }
  };

  // 返回首页
  const handleBackClick = () => {
    soundManager.playClickSound();
    onBackToHome();
  };

  return (
    <div className="payment-receive-page">
      <div className="payment-receive-container">
        {/* 页面标题 */}
        <div className="page-header">
          <div className="placeholder"></div>
          <h1 className="page-title">支持我们</h1>
          <div className="placeholder"></div>
        </div>

        {/* 感谢信息 */}
        <div className="donation-message">
          <div className="thank-you-emoji">🙏</div>
          <p className="message-text">感谢您对本游戏的喜爱和支持！</p>
          <p className="message-subtext">您的打赏将帮助我们开发更多有趣的游戏和功能</p>
        </div>

        {/* 收款方式展示 */}
        <div className="payment-methods-display">
          <div className="payment-method-card">
            <h3 className="method-title">支付宝扫码打赏</h3>
            {isMobile() && <p className="method-hint">点击下图自动打开支付宝</p>}
            <img 
              src={zhiShowImage} 
              alt="支付宝收款二维码" 
              className="qr-code-image" 
              style={isMobile() ? { cursor: 'pointer' } : {}}
              onClick={() => handlePaymentMethodClick('alipay')}
            />
          </div>
          
          <div className="payment-method-card">
            <h3 className="method-title">微信扫码打赏</h3>
            {isMobile() && <p className="method-hint">在微信中长按下图识别图中二维码</p>}
            <img 
              src={weiShowImage} 
              alt="微信收款二维码" 
              className="qr-code-image" 
            //   style={isMobile() ? { cursor: 'pointer' } : {}}
            //   onClick={() => handlePaymentMethodClick('wechat')}
            />
          </div>
        </div>

        {/* 返回首页按钮 */}
        <button
          className="back-home-button"
          onClick={handleBackClick}
        >
          ← 返回首页
        </button>
      </div>
    </div>
  );
}

export default PaymentReceiveePage;
