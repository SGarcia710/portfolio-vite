import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);

gsap.defaults({ ease: 'expo.out', duration: 1 });

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
