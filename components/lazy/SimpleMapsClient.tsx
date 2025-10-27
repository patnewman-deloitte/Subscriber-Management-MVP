'use client';

import dynamic from 'next/dynamic';

const SimpleMaps = dynamic(() => import('react-simple-maps'), { ssr: false });

export const loadSimpleMaps = () => import('react-simple-maps');

export default SimpleMaps;
