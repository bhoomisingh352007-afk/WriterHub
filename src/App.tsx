import React, { useState } from "react";
import { UserRole, AuthUser, Manuscript, AccessRequest, PublisherOffer, DRMAuditLog } from "./types";
import { INITIAL_MANUSCRIPTS, INITIAL_AUDIT_LOGS } from "./data/mockData";
import { Header } from "./components/Header";
import { WriterDashboard } from "./components/WriterDashboard";
import { PublisherMarketplace } from "./components/PublisherMarketplace";
import { DRMAuditVault } from "./components/DRMAuditVault";
import { SecureReaderModal } from "./components/SecureReaderModal";
import { UploadScriptModal } from "./components/UploadScriptModal";
import { AIScriptAssistant } from "./components/AIScriptAssistant";
import { AuthModal } from "./components/AuthModal";

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser>({
    id: "usr-01",
    name: "Bhoomi Singh (भूमि सिंह)",
    email: "bhoomi.writer@writerhub.io",
    role: "writer",
    company: "WriterHub Screenwriter",
    isVerifiedWriter: true,
  });

  const [currentRole, setCurrentRole] = useState<UserRole>("writer");
  const [manuscripts, setManuscripts] = useState<Manuscript[]>(INITIAL_MANUSCRIPTS);
  const [auditLogs, setAuditLogs] = useState<DRMAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Reader State
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Flattened Requests & Offers
  const allAccessRequests: AccessRequest[] = manuscripts.flatMap((m) => m.accessRequests || []);
  const allOffers: PublisherOffer[] = manuscripts.flatMap((m) => m.offers || []);

  const pendingRequestsCount = allAccessRequests.filter((r) => r.status === "pending").length;

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  // Handlers
  const handleOpenReader = (ms: Manuscript) => {
    setSelectedManuscript(ms);
    setIsReaderOpen(true);
    // Track view count
    setManuscripts((prev) =>
      prev.map((m) => (m.id === ms.id ? { ...m, totalViews: m.totalViews + 1 } : m))
    );
  };

  const handleAddManuscript = (newScript: Manuscript) => {
    // Attach current user Bhoomi as author if uploading in writer mode
    const customizedScript = {
      ...newScript,
      writerName: currentUser.name,
      writerEmail: currentUser.email,
    };

    setManuscripts((prev) => [customizedScript, ...prev]);
    // Log DRM encryption event
    const newLog: DRMAuditLog = {
      id: `log-${Date.now()}`,
      manuscriptId: customizedScript.id,
      manuscriptTitle: customizedScript.title,
      viewerName: currentUser.name,
      viewerRole: currentUser.role.toUpperCase(),
      viewerIp: "127.0.0.1",
      action: "KEY_DECRYPT",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      securityStatus: "SECURE",
      deviceInfo: "WriterHub DRM Engine",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleRequestAccess = (ms: Manuscript) => {
    const newRequest: AccessRequest = {
      id: `req-${Date.now()}`,
      publisherId: currentUser.id,
      publisherName: currentUser.name,
      publisherCompany: currentUser.company || "National Media Corp",
      manuscriptId: ms.id,
      manuscriptTitle: ms.title,
      requestReason: "Reviewing for OTT series optioning and international publishing rights.",
      requestedAccessType: "full_manuscript",
      status: "pending",
      requestedAt: new Date().toISOString().slice(0, 10),
    };

    setManuscripts((prev) =>
      prev.map((m) =>
        m.id === ms.id ? { ...m, accessRequests: [newRequest, ...(m.accessRequests || [])] } : m
      )
    );
  };

  const handleApproveRequest = (requestId: string) => {
    const passCode = `PASS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const expires = new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 10);

    setManuscripts((prev) =>
      prev.map((m) => ({
        ...m,
        accessRequests: m.accessRequests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: "approved",
                approvedAt: new Date().toISOString().slice(0, 10),
                expiresAt: expires,
                accessCode: passCode,
              }
            : r
        ),
      }))
    );
  };

  const handleRejectRequest = (requestId: string) => {
    setManuscripts((prev) =>
      prev.map((m) => ({
        ...m,
        accessRequests: m.accessRequests.map((r) =>
          r.id === requestId ? { ...r, status: "rejected" } : r
        ),
      }))
    );
  };

  const handleSubmitOffer = (
    manuscriptId: string,
    offerType: "option_rights" | "outright_buyout" | "royalty_publishing" | "adaptation_screenplay",
    amount: number,
    termsSummary: string
  ) => {
    const newOffer: PublisherOffer = {
      id: `off-${Date.now()}`,
      manuscriptId,
      manuscriptTitle: manuscripts.find((m) => m.id === manuscriptId)?.title || "",
      publisherName: currentUser.name,
      publisherCompany: currentUser.company || "National Media Corp",
      offerType,
      amount,
      currency: "INR",
      termsSummary,
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setManuscripts((prev) =>
      prev.map((m) =>
        m.id === manuscriptId ? { ...m, offers: [newOffer, ...(m.offers || [])] } : m
      )
    );
  };

  const handleAcceptOffer = (offerId: string) => {
    setManuscripts((prev) =>
      prev.map((m) => ({
        ...m,
        status: "Optioned",
        offers: m.offers.map((o) => (o.id === offerId ? { ...o, status: "accepted" } : o)),
      }))
    );
  };

  const handleSubmitReview = (
    manuscriptId: string,
    ratings: { plotScore: number; characterScore: number; pacingScore: number; commercialViability: number },
    comment: string
  ) => {
    const overall =
      (ratings.plotScore + ratings.characterScore + ratings.pacingScore + ratings.commercialViability) /
      4;

    const newReview = {
      id: `rev-${Date.now()}`,
      publisherName: currentUser.name,
      publisherCompany: currentUser.company || "National Media Corp",
      rating: {
        ...ratings,
        overallRating: Number(overall.toFixed(1)),
      },
      comment,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setManuscripts((prev) =>
      prev.map((m) =>
        m.id === manuscriptId ? { ...m, reviews: [newReview, ...m.reviews] } : m
      )
    );
  };

  const handleLogSecurityAction = (
    manuscriptId: string,
    action: "KEY_DECRYPT" | "WATERMARK_RENDER" | "BLUR_TRIGGERED" | "COPY_BLOCKED",
    securityStatus: "SECURE" | "FLAGGED_FOCUS_LOSS" | "ATTEMPTED_SELECTION"
  ) => {
    const ms = manuscripts.find((m) => m.id === manuscriptId);
    const newLog: DRMAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      manuscriptId,
      manuscriptTitle: ms?.title || "Unknown Manuscript",
      viewerName: currentUser.name,
      viewerRole: currentRole.toUpperCase(),
      viewerIp: "103.45.12.98",
      action,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      securityStatus,
      deviceInfo: "Chrome 126 / WriterHub Guard",
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Check if current publisher user has approved access pass for selected manuscript
  const currentHasFullAccess =
    selectedManuscript
      ? selectedManuscript.writerId === "writer-01" ||
        selectedManuscript.accessRequests.some(
          (r) => r.publisherId === currentUser.id || r.status === "approved"
        )
      : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-purple-500 selection:text-slate-950">
      {/* App Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRole === "writer" && (
          <WriterDashboard
            manuscripts={manuscripts}
            accessRequests={allAccessRequests}
            offers={allOffers}
            auditLogs={auditLogs}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenReader={handleOpenReader}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onAcceptOffer={handleAcceptOffer}
            onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          />
        )}

        {currentRole === "publisher" && (
          <PublisherMarketplace
            manuscripts={manuscripts}
            myAccessRequests={allAccessRequests}
            onOpenReader={handleOpenReader}
            onRequestAccess={handleRequestAccess}
            onSubmitOffer={handleSubmitOffer}
          />
        )}

        {currentRole === "admin" && (
          <DRMAuditVault auditLogs={auditLogs} manuscripts={manuscripts} />
        )}
      </main>

      {/* Secure DRM Reader Modal */}
      <SecureReaderModal
        manuscript={selectedManuscript}
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        userRole={currentRole}
        hasFullAccess={currentHasFullAccess}
        onRequestAccess={handleRequestAccess}
        onSubmitReview={handleSubmitReview}
        onLogSecurityAction={handleLogSecurityAction}
      />

      {/* Upload Script Modal */}
      <UploadScriptModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddManuscript={handleAddManuscript}
      />

      {/* AI Script Assistant Modal */}
      <AIScriptAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        manuscripts={manuscripts}
        currentRole={currentRole}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentRole(user.role);
        }}
      />
    </div>
  );
}

