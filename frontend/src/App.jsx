import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import MenuManagement from './pages/MenuManagement';
import InventoryPage from './pages/InventoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ImageUploadPage from './pages/ImageUploadPage';
import ConsumptionForm from './pages/ConsumptionForm';
import DonationLocatorPage from './pages/DonationLocatorPage';
import RecommendationsPage from './pages/RecommendationsPage';
import GuidePage from './pages/GuidePage';
import Dashboard from './pages/Dashboard';
import InventoryHub from './pages/InventoryHub';
import PaymentPage from './pages/PaymentPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <>
      <SignedIn>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/prediction" element={<PredictionPage />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/consumption" element={<ConsumptionForm />} />
            <Route path="/expiry" element={<ImageUploadPage />} />
            <Route path="/donations" element={<DonationLocatorPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </SignedIn>
      <SignedOut>
        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="*" element={<RedirectToSignIn />} />
        </Routes>
      </SignedOut>
    </>
  );
}

export default App;
