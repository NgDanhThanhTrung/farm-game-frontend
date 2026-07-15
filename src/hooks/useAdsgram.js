import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom Hook tích hợp Adsgram SDK vào React
 * @param {string} blockId - ID khối quảng cáo được cung cấp bởi Adsgram Console
 * @param {Function} onReward - Callback thực thi khi user xem hết quảng cáo thành công
 * @param {Function} onError - Callback thực thi khi có lỗi xảy ra hoặc load ads thất bại
 */
export const useAdsgram = ({ blockId, onReward, onError }) => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const adsControllerRef = useRef(null);

  // 1. Tự động nhúng Adsgram SDK script khi Hook được Mount
  useEffect(() => {
    const scriptId = 'adsgram-sdk-script';
    let script = document.getElementById(scriptId);

    const initializeAdsgram = () => {
      if (window.Adsgram) {
        // Khởi tạo Adsgram Controller thông qua blockId đã đăng ký
        adsControllerRef.current = window.Adsgram.init({ blockId });
        setIsSdkLoaded(true);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://sad.adsgram.org/sdk/v1/adsgram-sdk.js';
      script.async = true;
      script.onload = initializeAdsgram;
      document.head.appendChild(script);
    } else {
      initializeAdsgram();
    }
  }, [blockId]);

  // 2. Định nghĩa hàm async/await hiển thị quảng cáo
  const showAd = useCallback(async () => {
    if (!isSdkLoaded || !adsControllerRef.current) {
      console.warn('Adsgram SDK chưa được tải hoàn toàn hoặc lỗi khởi tạo.');
      if (onError) onError({ error: 'SDK_NOT_READY', description: 'Adsgram is not loaded yet.' });
      return;
    }

    try {
      // Gọi lệnh kích hoạt quảng cáo hiển thị toàn màn hình
      const result = await adsControllerRef.current.show();
      
      if (result && result.done) {
        // User đã xem trọn vẹn quảng cáo thành công
        if (onReward) onReward();
      } else {
        // User bỏ qua hoặc tắt quảng cáo giữa chừng
        if (onError) onError({ error: 'AD_SKIPPED', description: 'User closed the ad prematurely.' });
      }
    } catch (err) {
      console.error('Lỗi trong quá trình hiển thị Adsgram:', err);
      if (onError) onError(err);
    }
  }, [isSdkLoaded, onReward, onError]);

  return { showAd, isSdkLoaded };
};
