"use client";

import React, { useEffect, useRef } from 'react';

const NotFoundIllustrationV2 = () => {
    const sceneRef = useRef(null);
    const layersRef = useRef([]);
    const originalTransforms = useRef(new WeakMap());

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;

        layersRef.current = Array.from(scene.querySelectorAll('[data-depth]'));
        layersRef.current.forEach(layer => {
            originalTransforms.current.set(layer, layer.getAttribute('transform') || '');
        });

        const handleMouseMove = (evt) => {
            const { clientX, clientY } = evt;
            const { innerWidth, innerHeight } = window;
            
            const mouseX = (clientX / innerWidth) - 0.5;
            const mouseY = (clientY / innerHeight) - 0.5;

            layersRef.current.forEach(layer => {
                const depth = parseFloat(layer.getAttribute('data-depth'));
                const moveX = -mouseX * (depth * 50);
                const moveY = -mouseY * (depth * 50);
                
                const originalTransform = originalTransforms.current.get(layer);

                let finalTransform = `translate(${moveX}, ${moveY})`;
                if (originalTransform) {
                    const translateMatch = originalTransform.match(/translate\(([^,]+),([^)]+)\)/);
                    if(translateMatch) {
                        const origX = parseFloat(translateMatch[1]);
                        const origY = parseFloat(translateMatch[2]);
                        finalTransform = `translate(${origX + moveX}, ${origY + moveY})`;
                    } else {
                        finalTransform = `translate(${moveX}, ${moveY}) ${originalTransform}`;
                    }
                }
                layer.setAttribute('transform', finalTransform);
            });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <svg viewBox="-200 -200 1200 900" className="w-full max-w-7xl mx-auto scene-container" ref={sceneRef}>
            {/* Background elements */}
            <g data-depth="0.1">
                <path d="M0 600 H 800" stroke="#E5E7EB" strokeWidth="2"/>
                <text className="question-mark" x="100" y="200">?</text>
                <text className="question-mark" x="700" y="300">?</text>
                <text className="question-mark" x="50" y="450">?</text>
            </g>
             <g id="browser-window" transform="translate(150, 50)" data-depth="0.2">
                <rect x="0" y="0" width="800" height="500" rx="10" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2"/>
                <rect x="0" y="0" width="800" height="50" rx="10" ry="10" fill="#F3F4F6"/>
                <circle cx="20" cy="18" r="6" fill="#F87171"/>
                <circle cx="40" cy="18" r="6" fill="#FBBF24"/>
                <circle cx="60" cy="18" r="6" fill="#34D399"/>
                
                <text id="text-404" x="400" y="200" fontSize="150" fontWeight="bold" fill="#111827" textAnchor="middle">404</text>
                <text x="400" y="270" fontSize="50" fill="#4B5563" textAnchor="middle">Page Not Found</text>
            </g>
            {/* Plant */}
            <g id="plant" transform="translate(80, 520)" data-depth="0.2">
                <path d="M-20 40 C -40 20, 20 20, 20 40 Z" fill="#E5E7EB"/>
                <path d="M0 30 C -20 0, 0 -20, 0 -20 S 20 0, 0 30" fill="#4ADE80"/>
                <path d="M0 -15 C 20 -30, 20 -50, 20 -50 S 30 -30, 0 -15" fill="#4ADE80"/>
                <path d="M0 -15 C -20 -30, -20 -50, -20 -50 S -30 -30, 0 -15" fill="#4ADE80"/>
            </g>
            
            {/* Man */}
            <g id="man" transform="translate(180, 420)" data-depth="0.3">
                {/* Chair */}
                <path d="M-10 10 L 40 10 L 40 60 L 30 60 L 30 20 L -0 20 L -0 60 L -10 60 Z" fill="#D1D5DB"/>
                <path d="M-5 60 L 0 130 M35 60 L 30 130" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round"/>
                {/* Body */}
                <rect x="-20" y="0" width="70" height="70" rx="10" fill="#F9FAFB"/>
                <path d="M-15 70 L -25 130 M 55 70 L 65 130" stroke="#374151" strokeWidth="12" strokeLinecap="round"/>
                {/* Head */}
                <g id="man-head">
                    <circle cx="15" cy="-25" r="30" fill="#F3F4F6"/>
                    <path d="M-5 -45 Q 15 -60 35 -45" fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round"/>
                     <circle cx="5" cy="-30" r="2" fill="#111827"/>
                    <circle cx="25" cy="-30" r="2" fill="#111827"/>
                    <path d="M10 -15 Q 15 -10 20 -15" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                </g>
                 {/* Laptop */}
                <rect x="-40" y="70" width="100" height="6" rx="3" fill="#9CA3AF"/>
                <rect x="-35" y="10" width="90" height="60" rx="5" fill="#E5E7EB"/>
                <rect x="-30" y="15" width="80" height="50" fill="#FFFFFF"/>
                {/* Laptop Screen Content */}
                <g className="laptop-loader" transform="translate(10, 40)">
                     <circle cx="0" cy="0" r="8" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="25.12" strokeDashoffset="18.84"/>
                </g>
                <g className="laptop-error" transform="translate(10, 40)">
                    <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
                </g>
            </g>

            {/* Woman */}
            <g id="woman" transform="translate(580, 450)" data-depth="0.4">
                 {/* Beanbag */}
                <path d="M -80 100 C -120 20, 120 20, 80 100 Z" fill="#84CC16"/>
                 {/* Body */}
                <path d="M-40 0 C -50 80, 50 80, 40 0 Z" fill="#F97316"/>
                <path d="M-30 80 L -40 120 M 30 80 L 40 120" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round"/>
                 {/* Head */}
                <g id="woman-head">
                    <circle cx="0" cy="-25" r="30" fill="#F3F4F6"/>
                    <path d="M-20 -50 C -25 -65, 25 -65, 20 -50 L 0 -50 Z" fill="#4F46E5"/>
                    <circle cx="-10" cy="-30" r="2" fill="#111827"/>
                    <circle cx="10" cy="-30" r="2" fill="#111827"/>
                     <path d="M-5 -15 Q 0 -12 5 -15" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                </g>
                 {/* Laptop */}
                <g transform="rotate(-15)">
                    <rect x="-60" y="30" width="80" height="50" rx="5" fill="#E5E7EB"/>
                    <rect x="-55" y="35" width="70" height="40" fill="#FFFFFF"/>
                     {/* Laptop Screen Content */}
                    <g className="laptop-loader" transform="translate(-20, 55)">
                         <circle cx="0" cy="0" r="6" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="18.84" strokeDashoffset="14.13"/>
                    </g>
                    <g className="laptop-error" transform="translate(-20, 55)">
                        <path d="M -6 -6 L 6 6 M -6 6 L 6 -6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                    </g>
                </g>
            </g>

            {/* Browser Window */}
            

            {/* Robot */}
            <g id="robot" transform="translate(400, 450)" data-depth="0.5">
                 {/* Antenna */}
                 <path d="M 0 -50 L 0 -70 L 5 -75" stroke="#9CA3AF" strokeWidth="3" fill="none"/>
                 <circle id="antenna-light" cx="6" cy="-78" r="4"/>
                 {/* Head */}
                <rect x="-35" y="-50" width="70" height="50" rx="10" fill="#9CA3AF"/>
                <rect x="-25" y="-40" width="50" height="30" rx="5" fill="#E5E7EB"/>
                 {/* Eyes */}
                <circle cx="-10" cy="-25" r="8" fill="#FFFFFF"/>
                <circle cx="10" cy="-25" r="8" fill="#FFFFFF"/>
                <circle id="robot-eye-left-pupil" cx="-10" cy="-25" r="4" fill="#111827"/>
                <circle id="robot-eye-right-pupil" cx="10" cy="-25" r="4" fill="#111827"/>
                {/* Body */}
                <rect x="-50" y="0" width="100" height="80" rx="10" fill="#D1D5DB"/>
                {/* Arms */}
                <g id="robot-arm-left"><rect x="-65" y="5" width="15" height="50" rx="7.5" fill="#9CA3AF"/></g>
                <g id="robot-arm-right"><rect x="50" y="5" width="15" height="50" rx="7.5" fill="#9CA3AF"/></g>
                {/* Wheels */}
                <rect x="-40" y="80" width="80" height="20" rx="5" fill="#4B5563"/>
            </g>
        </svg>
    );
};

export default NotFoundIllustrationV2;