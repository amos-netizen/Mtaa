'use client';

interface VerificationBadgeProps {
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  trustedMemberBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function VerificationBadge({
  verificationStatus = 'PENDING',
  trustedMemberBadge = false,
  size = 'md',
  showLabel = true,
}: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  if (trustedMemberBadge) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]} bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300`}
        title="Trusted Member - ID Verified"
      >
        <span>✓</span>
        {showLabel && <span>Trusted</span>}
      </span>
    );
  }

  if (verificationStatus === 'VERIFIED') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]} bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300`}
        title="Verified User"
      >
        <span>✓</span>
        {showLabel && <span>Verified</span>}
      </span>
    );
  }

  if (verificationStatus === 'PENDING') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300`}
        title="Verification Pending"
      >
        <span>⏳</span>
        {showLabel && <span>Pending</span>}
      </span>
    );
  }

  return null;
}

