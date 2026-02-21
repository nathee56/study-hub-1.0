import { useEffect, useState, useRef } from 'react';

// 1. Magnetic Button effect hook
export function useMagneticEffect(ref, strength = 0.5) {
    useEffect(() => {
        const element = ref.current;
        if (!element || window.matchMedia('(max-width: 768px)').matches) return; // Disable on mobile

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = element.getBoundingClientRect();

            // Calculate center of element
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            // Calculate distance from mouse to center
            const distanceX = clientX - centerX;
            const distanceY = clientY - centerY;

            // Apply transform based on distance and strength
            element.style.transform = `translate(${distanceX * strength}px, ${distanceY * strength}px)`;
        };

        const handleMouseLeave = () => {
            element.style.transform = 'translate(0px, 0px)';
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [ref, strength]);
}

// 2. Scroll Reveal hook using Intersection Observer
export function useScrollReveal(options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) {
    const [isRevealed, setIsRevealed] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsRevealed(true);
                // Once revealed, we don't need to observe anymore
                if (ref.current) observer.unobserve(ref.current);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return { ref, isRevealed };
}

// 3. Ripple Click Effect Hook
export function useRipple() {
    useEffect(() => {
        const createRipple = (event) => {
            const button = event.currentTarget;
            const circle = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;

            // Get absolute position of click inside button
            const rect = button.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${event.clientX - rect.left - radius}px`;
            circle.style.top = `${event.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');

            // Find existing ripple and remove it
            const existingRipple = button.getElementsByClassName('ripple')[0];
            if (existingRipple) {
                existingRipple.remove(); // Remove immediately to prevent spamming elements
            }

            button.appendChild(circle);

            // Clean up the DOM element after animation runs
            setTimeout(() => {
                circle.remove();
            }, 600);
        };

        // Attach listener globally to all buttons with the `.btn` class
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => btn.addEventListener('mousedown', createRipple));

        return () => {
            buttons.forEach(btn => btn.removeEventListener('mousedown', createRipple));
        };
    }, []);
}

// 4. 3D Tilt Effect Hook
export function useTiltEffect(ref, options = { max: 15, perspective: 1000, scale: 1.05 }) {
    useEffect(() => {
        const element = ref.current;
        if (!element || window.matchMedia('(max-width: 768px)').matches) return;

        // Apply initial perspective
        element.style.transformStyle = "preserve-3d";

        // Find or create an inner wrapper for the content to apply translation
        // If it doesn't exist, we just rely on the parent wrapper tilt
        const innerContent = element.querySelector('.tilt-content') || element;

        const handleMouseMove = (e) => {
            const { left, top, width, height } = element.getBoundingClientRect();

            // Calculate mouse position relative to center [-1 to 1]
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;

            // Calculate rotation amount
            // If mouse is on right, tilt left (rotateY positive)
            // If mouse is on bottom, tilt up (rotateX negative)
            const rotateY = (x - 0.5) * options.max;
            const rotateX = (0.5 - y) * options.max;

            element.style.transition = 'none'; // Remove transition during active movement
            element.style.transform = `perspective(${options.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${options.scale}, ${options.scale}, ${options.scale})`;

            // Add a subtle glare effect based on angles
            const glareX = x * 100;
            const glareY = y * 100;

            // Try to find a glare element, if not, we can fall back just to the rotation
            const glare = element.querySelector('.tilt-glare');
            if (glare) {
                glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, transparent 60%)`;
            }
        };

        const handleMouseLeave = () => {
            element.style.transition = 'all 0.4s ease-out';
            element.style.transform = `perspective(${options.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

            const glare = element.querySelector('.tilt-glare');
            if (glare) {
                glare.style.transition = 'opacity 0.4s ease';
                glare.style.opacity = '0';
            }
        };

        const handleMouseEnter = () => {
            element.style.transition = 'all 0.1s ease-out';
            const glare = element.querySelector('.tilt-glare');
            if (glare) {
                glare.style.opacity = '1';
            }
        }

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
            element.addEventListener('mouseenter', handleMouseEnter);
        };
    }, [ref, options]);
}
