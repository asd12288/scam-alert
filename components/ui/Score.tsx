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
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showDescription?: boolean;
  className?: string;
  variant?: "circle" | "badge";
}

const Score: React.FC<ScoreProps> = ({
  score,
  size = "md",
  showLabel = true,
  showDescription = true,
  className = "",
  variant = "circle",
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

  // Size variants
  const sizeClasses = {
    sm: {
      wrapper: "w-14 h-14",
      scoreText: "text-base",
      labelText: "text-xs",
      descriptionText: "text-xs",
      thickness: 3,
      badgeSize: "text-base px-3 py-1.5", // Increased from text-sm
    },
    md: {
      wrapper: "w-24 h-24",
      scoreText: "text-2xl",
      labelText: "text-sm",
      descriptionText: "text-xs",
      thickness: 4,
      badgeSize: "text-xl px-4 py-2", // Increased badge size
    },
    lg: {
      wrapper: "w-32 h-32",
      scoreText: "text-3xl",
      labelText: "text-base",
      descriptionText: "text-sm",
      thickness: 5,
      badgeSize: "text-2xl px-5 py-2.5", // Increased for larger display
    },
  };

  const {
    wrapper,
    scoreText,
    labelText,
    descriptionText,
    thickness,
    badgeSize,
  } = sizeClasses[size];

  // Calculate SVG parameters for circle
  const radius = 50 - thickness;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  if (variant === "badge") {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div
          className={`rounded-full ${bgColor} ${borderColor} border ${badgeSize} font-bold flex items-center justify-center ${textColor}`}
        >
          <span className="mr-1">{clampedScore}</span>
          {showLabel && (
            <span className="text-xs sm:text-sm font-medium">/ 100</span>
          )}
        </div>

        {showDescription && (
          <p
            className={`mt-1 text-center text-gray-600 max-w-xs ${descriptionText}`}
          >
            {label}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* SVG Circle Progress */}
      <div className={`relative ${wrapper}`}>
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
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
            className={`transition-all duration-1000 ease-out bg-gradient-to-r ${gradient}`}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${scoreText}`} style={{ color }}>
            {clampedScore}
          </span>
          {showLabel && (
            <span className={`font-medium ${labelText}`} style={{ color }}>
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
