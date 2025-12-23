
import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import PinkParticleTreeScene from './components/PinkParticleTreeScene';
import UIOverlay from './components/UIOverlay';
import { Wish } from './types';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbzPCQ6x4yW6RVI4sd9Bc_zxrkoLXS4c0oHEiH6Vr-pioE1t7hQl95b8KY3K-ibB17IK/exec';

const App: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [treeBrightness, setTreeBrightness] = useState(1.0);
  const [isSending, setIsSending] = useState(false);

  const handleSendWish = async (name: string, text: string) => {
    setIsSending(true);
    
    // 建立本地端視覺用的願望物件
    const newWish: Wish = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      text,
      startTime: Date.now(),
    };

    try {
      // 串接 Google Apps Script
      const response = await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors', // GAS 跨網域通常需要 no-cors 或是透過 Redirect 處理
        headers: {
          'Content-Type': 'text/plain', // GAS doPost 解析 JSON 時，建議先用 text/plain 避免 preflight 限制
        },
        body: JSON.stringify({
          name: name,
          wish: text
        }),
      });

      // 由於 no-cors 模式無法讀取 response 內容，我們假設成功發出即觸發動畫
      setWishes((prev) => [...prev, newWish]);
      console.log('Wish sent to GAS');
      
    } catch (error) {
      console.error('Failed to send wish to GAS:', error);
      alert('發送失敗，請稍後再試。');
    } finally {
      setIsSending(false);
    }
  };

  const handleWishArrival = useCallback(() => {
    setTreeBrightness(2.0);
    setTimeout(() => setTreeBrightness(1.0), 1000);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 45 }}
        gl={{ antialias: false, stencil: false, depth: true }}
        className="w-full h-full"
      >
        <color attach="background" args={['#020202']} />
        
        <PinkParticleTreeScene 
          wishes={wishes} 
          onWishArrive={handleWishArrival}
          treeBrightness={treeBrightness}
        />

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.7}
            mipmapBlur 
            intensity={0.8}
            radius={0.3} 
          />
        </EffectComposer>
      </Canvas>

      <UIOverlay onSendWish={handleSendWish} isSending={isSending} />
    </div>
  );
};

export default App;
