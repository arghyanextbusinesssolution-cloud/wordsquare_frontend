import React, { Suspense } from 'react';
// Client component for puzzle editing
import AdminPuzzleEditClient from './AdminPuzzleEditClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading puzzle editor...</div>}>
      <AdminPuzzleEditClient />
    </Suspense>
  );
}
