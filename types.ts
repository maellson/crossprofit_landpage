
// Fix: Import React to resolve React namespace
import React from 'react';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  modules: string[];
  description: string;
  popular?: boolean;
}

export interface ModuleInfo {
  id: number;
  title: string;
  features: string[];
  icon: React.ReactNode;
}