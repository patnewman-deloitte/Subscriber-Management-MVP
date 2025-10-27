'use client';
import dynamic from 'next/dynamic';
const Recharts = dynamic(() => import('recharts'), { ssr: false });
export const loadRecharts = () => import('recharts');
export default Recharts;
