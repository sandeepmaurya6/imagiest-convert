'use client';

import { Check } from 'lucide-react';

export function FeaturesList() {
  const features = [
    'Free unlimited conversions',
    'Batch processing up to 20 files',
    'High-quality optimization',
    '100% private & secure',
    'No file upload needed',
    'Process files offline'
  ];

  return (
    <section className="py-12 bg-slate-50 rounded-2xl">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm text-slate-600">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}