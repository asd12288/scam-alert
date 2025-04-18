import React from "react";

const getScoreInfo = (score: number) => {
  // More nuanced color gradient based on score ranges
  if (score >= 90) {
    return {
      color: "#10B981", // Emerald green
      gradient: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-800",
      borderColor: "border-emerald-300",
      label: "Very Safe",
      description: "This domain appears to be secure and trustworthy",
    };
  }
  if (score >= 75) {
    return {
      color: "#34D399", // Green
      gradient: "from-green-400 to-green-600",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-300",
      label: "Safe",
      description: "This domain appears to be generally safe",
    };
  }
  if (score >= 60) {
    return {
      color: "#FBBF24", // Amber
      gradient: "from-yellow-400 to-yellow-500",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-300",
      label: "Moderate",
      description: "Exercise normal caution with this domain",
    };
  }
  if (score >= 40) {
    return {
      color: "#F59E0B", // Amber
      gradient: "from-amber-400 to-amber-600",
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      borderColor: "border-amber-300",
      label: "Caution",
      description: "Some potential security concerns detected",
    };
  }
  if (score >= 20) {
    return {
      color: "#EF4444", // Red
      gradient: "from-red-400 to-red-600",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-300",
      label: "Warning",
      description: "Multiple security risks identified",
    };
  }
  return {
    color: "#DC2626", // Dark red
    gradient: "from-rose-600 to-red-700",
    bgColor: "bg-rose-100",
    textColor: "text-red-900",
    borderColor: "border-red-300",
    label: "Danger",
    description: "High security risk - avoid sharing sensitive information",
  };
};

interface ScoreProps {
  score: number | undefined | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  showDescription?: boolean;
  className?: string;
  variant?: "circle" | "badge" | "compact";
  animate?: boolean;
}

const Score: React.FC<ScoreProps> = ({
  score,
  size = "md",
  showLabel = true,
  showDescription = true,
  className = "",
  variant = "circle",
  animate = true,
}) => {
  // Handle undefined, null, NaN or non-numeric values
  const numericScore = typeof score === "number" && !isNaN(score) ? score : 0;
  const clampedScore = Math.max(0, Math.min(100, Math.round(numericScore)));
  const {
    color,
    gradient,
    label,
    description,
    bgColor,
    textColor,
    borderColor,
  } = getScoreInfo(clampedScore);

  // Size variants with responsive adjustments
  const sizeClasses = {
    xs: {
      wrapper: "w-10 h-10 sm:w-12 sm:h-12",
      scoreText: "text-xs sm:text-sm",
      labelText: "text-[10px] sm:text-xs",
      descriptionText: "text-xs hidden sm:block",
      thickness: 3,
      badgeSize: "text-xs sm:text-sm px-2 py-1",
      compactSize: "text-xs px-1.5 py-0.5",
    },
    sm: {
      wrapper: "w-14 h-14 sm:w-16 sm:h-16",
      scoreText: "text-sm sm:text-base",
      labelText: "text-xs",
      descriptionText: "text-xs sm:text-sm",
      thickness: 3,
      badgeSize: "text-sm sm:text-base px-2.5 py-1.5",
      compactSize: "text-sm px-2 py-1",
    },
    md: {
      wrapper: "w-20 h-20 sm:w-24 sm:h-24",
      scoreText: "text-xl sm:text-2xl",
      labelText: "text-xs sm:text-sm",
      descriptionText: "text-xs sm:text-sm",
      thickness: 4,
      badgeSize: "text-lg sm:text-xl px-3 py-1.5 sm:px-4 sm:py-2",
      compactSize: "text-base sm:text-lg px-2.5 py-1 sm:px-3",
    },
    lg: {
      wrapper: "w-28 h-28 sm:w-32 sm:h-32",
      scoreText: "text-2xl sm:text-3xl",
      labelText: "text-sm sm:text-base",
      descriptionText: "text-sm",
      thickness: 5,
      badgeSize: "text-xl sm:text-2xl px-4 py-2 sm:px-5 sm:py-2.5",
      compactSize: "text-lg sm:text-xl px-3 py-1.5",
    },
    xl: {
      wrapper: "w-36 h-36 sm:w-40 sm:h-40",
      scoreText: "text-3xl sm:text-4xl",
      labelText: "text-base sm:text-lg",
      descriptionText: "text-sm sm:text-base",
      thickness: 6,
      badgeSize: "text-2xl sm:text-3xl px-5 py-2.5 sm:px-6 sm:py-3",
      compactSize: "text-xl sm:text-2xl px-4 py-2",
    },
  };

  const {
    wrapper,
    scoreText,
    labelText,
    descriptionText,
    thickness,
    badgeSize,
    compactSize,
  } = sizeClasses[size];

  // Calculate SVG parameters for circle
  const radius = 50 - thickness;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // For the compact variant (useful in mobile layouts or tight spaces)
  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <div
          className={`rounded-full ${bgColor} ${borderColor} border ${compactSize} font-semibold inline-flex items-center justify-center ${textColor}`}
          aria-label={`Score: ${clampedScore} out of 100 (${label})`}
        >
          {clampedScore}
        </div>
        {showLabel && (
          <span className={`ml-1.5 font-medium ${textColor} ${labelText}`}>
            {label}
          </span>
        )}
      </div>
    );
  }

  // Badge variant
  if (variant === "badge") {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div
          className={`rounded-full ${bgColor} ${borderColor} border ${badgeSize} font-bold flex items-center justify-center ${textColor}`}
          aria-label={`Score: ${clampedScore} out of 100`}
        >
          <span className="mr-1">{clampedScore}</span>
          <span className="text-xs sm:text-sm font-medium">/ 100</span>
        </div>

        {showLabel && (
          <div className={`mt-1 ${textColor} font-medium ${labelText}`}>
            {label}
          </div>
        )}

        {showDescription && (
          <p
            className={`mt-1 text-center text-gray-600 max-w-xs ${descriptionText}`}
          >
            {description}
          </p>
        )}
      </div>
    );
  }

  // Default circle variant
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* SVG Circle Progress */}
      <div className={`relative ${wrapper}`}>
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
          aria-label={`Score: ${clampedScore} out of 100`}
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e6e6e6"
            strokeWidth={thickness}
          />

          {/* Progress circle with gradient */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${animate ? 'transition-all duration-1000 ease-out' : ''} bg-gradient-to-r ${gradient}`}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${scoreText}`} style={{ color }}>
            {clampedScore}
          </span>
          {showLabel && (
            <span className={`font-medium ${labelText} text-center`} style={{ color }}>
              {label}
            </span>
          )}
        </div>
      </div>

      {/* Description below */}
      {showDescription && (
        <p
          className={`mt-2 text-center text-gray-600 max-w-xs ${descriptionText}`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default Score;
