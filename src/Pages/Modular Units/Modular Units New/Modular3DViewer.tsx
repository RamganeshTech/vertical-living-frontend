import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Center } from '@react-three/drei';

type ViewerProps = {
    modelUrl: string;
    isThumbnail?: boolean; // New optional prop
};

// Internal component to load the GLB
const Model = ({ url }: { url: string }) => {
    const { scene } = useGLTF(url, true);

    // Alternative if 'true' doesn't work in your version:
    // const { scene } = useGLTF(url, undefined, (loader) => {
    //     loader.setCrossOrigin('anonymous');
    // });

    return <primitive object={scene} />;
};

const Modular3DViewer: React.FC<ViewerProps> = ({ modelUrl, isThumbnail = false }) => {
    return (
        // <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-inner min-h-[400px]">
        <div className={`w-full h-full overflow-hidden ${isThumbnail ? '' : 'bg-gray-50 border border-gray-200 shadow-inner min-h-[400px]'}`}>
            <Canvas shadows={!isThumbnail} camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <Stage
                        environment={isThumbnail ? undefined : "city"}
                        intensity={isThumbnail ? 0.3 : 0.5}                        // Rename 'contactShadow' to 'shadows'
                        // contactShadow={!isThumbnail}
                        // You can pass 'contact' for the soft floor shadow or 'accumulator' for high quality
                        // shadows="contact"
                        shadows={isThumbnail ? false : "contact"}
                        // Config for the shadow is now passed via 'shadows' related props or handled by Stage
                        adjustCamera={true}>
                        <Center>
                            <Model url={modelUrl} />
                        </Center>
                    </Stage>
                </Suspense>
                {/* This enables the 360-degree view */}
                <OrbitControls
                    makeDefault
                    enableZoom={!isThumbnail}
                    enablePan={!isThumbnail}
                    enableRotate={!isThumbnail} // Disable rotation in thumb to save CPU
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 1.75} // Prevents looking under the model
                    enableDamping={true}
                />
            </Canvas>

            {/* Visual Instruction Badge */}
            {/* ONLY show instructions on the main view, not the tiny thumbnails */}
            {!isThumbnail && (
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-500 shadow-sm pointer-events-none border border-gray-200">
                    <i className="fas fa-mouse mr-2"></i> 360° INTERACTIVE VIEW
                </div>
            )}
        </div>
    );
};

export default Modular3DViewer;