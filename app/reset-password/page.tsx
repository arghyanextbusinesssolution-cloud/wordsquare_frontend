'use client';

import React, { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">Loading...</div>}>
            <ResetPasswordClient />
        </Suspense>
    );
}
