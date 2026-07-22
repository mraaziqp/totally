/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DeepCleaning from './pages/services/DeepCleaning';
import PressureCleaning from './pages/services/PressureCleaning';
import Gifting from './pages/services/Gifting';
import AdminDashboard from './pages/admin/Dashboard';
import TenantDashboard from './pages/admin/TenantDashboard';
import QuoteResponse from './pages/QuoteResponse';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeepCleaning />} />
        <Route path="/services/deep-cleaning" element={<DeepCleaning />} />
        <Route path="/services/pressure-cleaning" element={<PressureCleaning />} />
        <Route path="/services/gifting" element={<Gifting />} />
        <Route path="/quote/:token" element={<QuoteResponse />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:storeSlug" element={<TenantDashboard />} />

        {/* Unknown paths fall back to the main storefront */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}




