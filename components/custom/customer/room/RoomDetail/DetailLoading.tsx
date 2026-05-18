import React from 'react'

const DetailLoading = () => {
  return (
    <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh] max-w-5xl animate-pulse">
      <div className="h-10 w-24 bg-slate-200 rounded-full self-start mb-6" />
      <div className="h-[450px] w-full bg-slate-200 rounded-[2.5rem] mb-6" />
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 w-3/4 bg-slate-200 rounded-lg" />
          <div className="h-6 w-1/2 bg-slate-200 rounded-lg" />
          <div className="h-32 w-full bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-60 w-full bg-slate-200 rounded-3xl" />
      </div>
    </div>
  );
}

export default DetailLoading