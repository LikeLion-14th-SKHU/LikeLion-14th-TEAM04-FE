import { useEffect, useRef, useState } from 'react'

export default function EditionViewer({ modelUrl, imageUrl, alt = '에디션' }) {
    const modelRef = useRef(null)
    const [modelFailed, setModelFailed] = useState(false)

    useEffect(() => {
        setModelFailed(false)
    }, [modelUrl])

    useEffect(() => {
        import('@google/model-viewer').catch(() => setModelFailed(true))
    }, [])

    const showModel = modelUrl && !modelFailed

    useEffect(() => {
        const viewer = modelRef.current
        if (!viewer) return

        const handleError = () => setModelFailed(true)
        viewer.addEventListener('error', handleError)

        return () => viewer.removeEventListener('error', handleError)
    }, [modelUrl, showModel])

    return (
        <div className="bg-[#f6f0e6] p-[14px]">
            <div className="relative aspect-square w-full overflow-hidden bg-[#ded0ba]">
                {showModel ? (
                    <model-viewer
                        ref={modelRef}
                        src={modelUrl}
                        poster={imageUrl}
                        alt={alt}
                        camera-controls="true"
                        interaction-prompt="auto"
                        shadow-intensity="1"
                        touch-action="pan-y"
                        className="h-full w-full"
                    />
                ) : imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={alt}
                        className="h-full w-full object-contain p-[18px]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="text-[8px] tracking-[.12em] text-ink/35">
                            EDITION IMAGE
                        </span>
                    </div>
                )}

                <span className="absolute right-[10px] bottom-[10px] bg-ink/75 px-[8px] py-[5px] text-[7px] tracking-[.12em] text-cream">
                    {showModel
                        ? '3D VIEW · DRAG TO ROTATE'
                        : modelFailed
                            ? '3D LOAD FAILED · 2D VIEW'
                            : '3D MODEL PROCESSING · 2D VIEW'}
                </span>
            </div>
        </div>
    )
}
