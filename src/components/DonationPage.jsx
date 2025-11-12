import React, { useState } from 'react';
import soundManager from '../utils/soundManager';
import paymentConfig from '../utils/paymentConfig';
import zhiPayIcon from '../res/zhi_pay.png';
import weiPayIcon from '../res/wei_pay.png';
import './DonationPage.css';

function DonationPage({ onBackToHome }) {
  // 获取默认金额选项
  const defaultAmounts = paymentConfig.common.defaultAmounts;
  
  // 状态管理
  const [selectedAmount, setSelectedAmount] = useState(defaultAmounts[1]); // 默认选中1元
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('alipay'); // 默认支付宝
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, failed
  const [showThankYou, setShowThankYou] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // 支付弹窗
  const [paymentQRCode, setPaymentQRCode] = useState(''); // 支付二维码
  
  // 检测设备类型
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // 处理金额选择
  const handleAmountSelect = (amount) => {
    soundManager.playClickSound();
    setSelectedAmount(amount);
    setIsCustomAmount(false);
  };

  // 处理自定义金额输入
  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    // 只允许输入数字和小数点
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
    }
  };

  // 切换到自定义金额
  const handleCustomAmountFocus = () => {
    setIsCustomAmount(true);
  };

  // 处理支付方式选择
  const handlePaymentMethodSelect = (method) => {
    soundManager.playClickSound();
    setSelectedPaymentMethod(method);
  };

  // 获取最终支付金额
  const getFinalAmount = () => {
    if (isCustomAmount && customAmount) {
      const amount = parseFloat(customAmount);
      return Math.max(paymentConfig.common.minAmount, 
                    Math.min(paymentConfig.common.maxAmount, amount));
    }
    return selectedAmount;
  };

  // 验证金额是否有效
  const isAmountValid = () => {
    const amount = getFinalAmount();
    return !isNaN(amount) && 
           amount >= paymentConfig.common.minAmount && 
           amount <= paymentConfig.common.maxAmount;
  };

  // 处理支付按钮点击
  const handlePayment = async () => {
    if (!isAmountValid()) return;
    
    soundManager.playClickSound();
    const amount = getFinalAmount();
    
    if (isMobile()) {
      // 移动端：直接跳转到支付页面
      handleMobilePayment(selectedPaymentMethod, amount);
    } else {
      // 桌面端：显示二维码支付弹窗
      await showQRCodePayment(selectedPaymentMethod, amount);
    }
  };
  
  // 移动端支付处理
  const handleMobilePayment = (method, amount) => {
    // 在实际项目中，这里应该跳转到真实的支付链接
    // 这里使用模拟的支付链接
    const paymentLinks = {
      alipay: `https://example.com/alipay?amount=${amount}`,
      wechatpay: `https://example.com/wechatpay?amount=${amount}`
    };
    
    // 模拟支付跳转
    console.log(`移动端跳转到${method === 'alipay' ? '支付宝' : '微信'}支付页面，金额：${amount}元`);
    
    // 模拟支付成功后的流程
    setTimeout(() => {
      setPaymentStatus('success');
      setShowThankYou(true);
      
      // 显示感谢信息后自动跳转到首页
      setTimeout(() => {
        onBackToHome();
      }, 3000);
    }, 1000);
  };
  
  // 桌面端二维码支付
  const showQRCodePayment = async (method, amount) => {
    try {
      // 模拟获取二维码（在实际项目中应该调用后端API）
      const qrCode = await generatePaymentQRCode(method, amount);
      setPaymentQRCode(qrCode);
      setShowPaymentModal(true);
      
      // 模拟检查支付状态
      startPaymentStatusCheck();
    } catch (error) {
      console.error('获取支付二维码失败:', error);
      alert('生成支付二维码失败，请重试');
    }
  };
  
  // 模拟生成支付二维码
  const generatePaymentQRCode = (method, amount) => {
    return new Promise((resolve) => {
      // 在实际项目中，这里应该调用API获取真实的二维码
      // 使用一个占位的二维码图片URL
      const mockQRCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${method}:${amount}`)}`;
      
      setTimeout(() => {
        resolve(mockQRCode);
      }, 500);
    });
  };
  
  // 开始检查支付状态
  const startPaymentStatusCheck = () => {
    // 模拟轮询检查支付结果
    const checkInterval = setInterval(async () => {
      try {
        const isPaid = await checkPaymentStatus();
        if (isPaid) {
          clearInterval(checkInterval);
          setShowPaymentModal(false);
          setPaymentStatus('success');
          setShowThankYou(true);
          
          // 显示感谢信息后自动跳转到首页
          setTimeout(() => {
            onBackToHome();
          }, 3000);
        }
      } catch (error) {
        console.error('检查支付状态失败:', error);
      }
    }, 2000);
    
    // 30秒后超时
    setTimeout(() => {
      clearInterval(checkInterval);
      setShowPaymentModal(false);
      alert('支付超时，请重试');
    }, 30000);
  };
  
  // 模拟检查支付状态
  const checkPaymentStatus = () => {
    return new Promise((resolve) => {
      // 模拟90%的支付成功率，随机在5-20秒内完成支付
      setTimeout(() => {
        resolve(Math.random() > 0.1);
      }, Math.random() * 15000 + 5000);
    });
  };
  
  // 关闭支付弹窗
  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  // 模拟支付过程（实际项目中不需要）
  const simulatePayment = (method, amount) => {
    return new Promise((resolve, reject) => {
      console.log(`发起${method === 'alipay' ? '支付宝' : '微信'}支付请求，金额：${amount}元`);
      
      // 模拟网络延迟
      setTimeout(() => {
        // 模拟90%的支付成功率
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error('支付处理失败'));
        }
      }, 1500);
    });
  };

  // 返回首页
  const handleBackClick = () => {
    soundManager.playClickSound();
    onBackToHome();
  };

  return (
    <div className="donation-page">
      <div className="donation-container">
        {/* 页面标题 */}
        <div className="page-header">
          <div className="placeholder"></div> {/* 占位 */}
          <h1 className="page-title">支持我们</h1>
          <div className="placeholder"></div> {/* 占位，保持标题居中 */}
        </div>

        {/* 感谢信息 */}
        <div className="donation-message">
          <div className="thank-you-emoji">🙏</div>
          <p className="message-text">感谢您对本游戏的喜爱和支持！</p>
          <p className="message-subtext">您的打赏将帮助我们开发更多有趣的游戏和功能</p>
        </div>

        {/* 金额选择 */}
        <div className="amount-selection">
          <h2 className="section-title">选择金额</h2>
          <div className="amount-options">
            {defaultAmounts.map((amount) => (
              <button
                key={amount}
                className={`amount-button ${selectedAmount === amount && !isCustomAmount ? 'selected' : ''}`}
                onClick={() => handleAmountSelect(amount)}
              >
                ¥{amount}
              </button>
            ))}
          </div>
          <div className="custom-amount">
            <input
              type="text"
              className={`custom-amount-input ${isCustomAmount ? 'active' : ''}`}
              placeholder="自定义金额"
              value={customAmount}
              onChange={handleCustomAmountChange}
              onFocus={handleCustomAmountFocus}
            />
          </div>
        </div>

        {/* 支付方式选择 */}
        <div className="payment-methods">
          <h2 className="section-title">选择支付方式</h2>
          <div className="method-options">
            <button
              className={`method-button ${selectedPaymentMethod === 'alipay' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('alipay')}
            >
              <img src={zhiPayIcon} alt="支付宝" className="method-icon" />
              <span className="method-name">支付宝</span>
            </button>
            <button
              className={`method-button ${selectedPaymentMethod === 'wechatpay' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('wechatpay')}
            >
              <img src={weiPayIcon} alt="微信支付" className="method-icon" />
              <span className="method-name">微信支付</span>
            </button>
          </div>
        </div>

        {/* 支付按钮 */}
        <div className="payment-action">
          <button
            className={`pay-button ${!isAmountValid() ? 'disabled' : ''}`}
            onClick={handlePayment}
            disabled={!isAmountValid() || paymentStatus === 'processing'}
          >
            {paymentStatus === 'processing' && <span className="loading-spinner">⏳</span>}
            {paymentStatus === 'success' && <span>✅ 支付成功</span>}
            {paymentStatus === 'failed' && <span>❌ 支付失败</span>}
            {paymentStatus === 'idle' && (
              <>
                <img 
                  src={selectedPaymentMethod === 'alipay' ? zhiPayIcon : weiPayIcon} 
                  alt="支付方式" 
                  className="pay-button-icon" 
                />
                <span className="pay-button-text">
                  {selectedPaymentMethod === 'alipay' ? '支付宝支付' : '微信支付'} ¥{getFinalAmount()}元
                </span>
              </>
            )}
          </button>
          
          {/* 返回首页按钮 */}
          <button
            className="back-home-button"
            onClick={handleBackClick}
          >
            ← 返回首页
          </button>
        </div>

        {/* 支付二维码弹窗 */}
        {showPaymentModal && (
          <div className="payment-modal-overlay">
            <div className="payment-modal">
              <div className="modal-header">
                <h3>{selectedPaymentMethod === 'alipay' ? '支付宝扫码支付' : '微信扫码支付'}</h3>
                <button className="close-button" onClick={closePaymentModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="qr-code-container">
                  <img src={paymentQRCode} alt="支付二维码" className="payment-qr-code" />
                </div>
                <div className="payment-amount">支付金额：¥{getFinalAmount()}元</div>
                <div className="payment-instruction">
                  请使用{selectedPaymentMethod === 'alipay' ? '支付宝' : '微信'}扫描上方二维码完成支付
                </div>
                <div className="payment-status">请稍候，正在等待支付...</div>
              </div>
            </div>
          </div>
        )}
        
        {/* 感谢弹窗 */}
        {showThankYou && (
          <div className="thank-you-overlay">
            <div className="thank-you-card">
              <div className="thank-you-content">
                <div className="celebration-emojis">🎉🎊✨</div>
                <h2>感谢您的支持！</h2>
                <p>我们会继续努力开发更好的游戏体验</p>
                <div className="countdown">3秒后自动返回首页...</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DonationPage;