import React, { Suspense } from 'react';
import AdminPuzzleViewClient from './AdminPuzzleViewClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading puzzle...</div>}>
      <AdminPuzzleViewClient />
    </Suspense>
  );
}
