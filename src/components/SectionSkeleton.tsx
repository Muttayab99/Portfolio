import React from 'react';

export const SectionSkeleton = () => {
  return (
    <section className="py-24 md:py-32 relative animate-pulse">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-12">
          {/* Skeleton for Section Header */}
          <div className="h-4 w-32 bg-muted rounded mb-4"></div>
          <div className="h-10 w-64 bg-muted rounded"></div>
        </div>
        
        {/* Skeleton for Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-5/6 bg-muted rounded"></div>
            <div className="h-4 w-4/6 bg-muted rounded"></div>
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-5/6 bg-muted rounded"></div>
          </div>
          
          <div className="flex justify-center mt-12 md:mt-0">
            <div className="w-full max-w-[300px] aspect-square rounded-2xl bg-muted"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
