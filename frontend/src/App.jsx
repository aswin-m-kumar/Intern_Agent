import React from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import { LiquidGlassCard } from './components/LiquidGlassCard';
import { InternAgentForm } from './components/InternAgentForm';

function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0d0d0d]">
      <div className="absolute inset-0 z-0">
        <ShaderGradientCanvas
          style={{
            width: '100%',
            height: '100%',
          }}
          lazyLoad={false}
          fov={45}
          pixelDensity={1}
          pointerEvents="none"
        >
          <ShaderGradient
            animate="on"
            type="sphere"
            wireframe={false}
            shader="defaults"
            uTime={0}
            uSpeed={0.3}
            uStrength={0.3}
            uDensity={0.8}
            uFrequency={5.5}
            uAmplitude={3.2}
            positionX={-0.1}
            positionY={0}
            positionZ={0}
            rotationX={0}
            rotationY={130}
            rotationZ={70}
            color1="#73bfc4"
            color2="#ff810a"
            color3="#8da0ce"
            reflection={0.4}
            cAzimuthAngle={270}
            cPolarAngle={180}
            cDistance={0.5}
            cameraZoom={15.1}
            lightType="env"
            brightness={0.8}
            envPreset="city"
            grain="on"
            toggleAxis={false}
            zoomOut={false}
            hoverState=""
            enableTransition={false}
          />
        </ShaderGradientCanvas>
      </div>
      
      {/* Centered Glass Card UI */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <LiquidGlassCard
          draggable={true}
          expandable={false}
          width="100%"
          height="auto"
          className="max-w-3xl overflow-hidden"
          blurIntensity="lg"
          borderRadius="32px"
          glowIntensity="lg"
          shadowIntensity="lg"
        >
          <InternAgentForm />
        </LiquidGlassCard>
      </div>
    </div>
  );
}

export default App;
