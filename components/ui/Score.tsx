import React from "react";

const getScoreInfo = (score: number) => {
  // More nuanced color gradient based on score ranges
  if (score >= 90) {
    return {
      color: "#10B981", // Emerald green
      gradient: "from-emerald-400 to-emerald-600",
      label: "Very Safe",
      description: "This domain appears to be secure and trustworthy",
    };
  }
  if (score >= 75) {
    return {
      color: "#34D399", // Green
      gradient: "from-green-400 to-green-600",
      label: "Safe",
      description: "This domain appears to be generally safe",
    };
  }
  if (score >= 60) {
    return {
      color: "#FBBF24", // Amber
      gradient: "from-yellow-400 to-yellow-500",
      label: "Moderate",
      description: "Exercise normal caution with this domain",
    };
  }
  if (score >= 40) {
    return {
      color: "#F59E0B", // Amber
      gradient: "from-amber-400 to-amber-600",
      label: "Caution",
      description: "Some potential security concerns detected",
    };
  }
  if (score >= 20) {
    return {
      color: "#EF4444", // Red
      gradient: "from-red-400 to-red-600",
      label: "Warning",
      description: "Multiple security risks identified",
    };
  }
  return {
    color: "#DC2626", // Dark red
    gradient: "from-rose-600 to-red-700",
    label: "Danger",
    description: "High security risk - avoid sharing sensitive information",
  };
};

interface ScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showDescription?: boolean;
  className?: string;
}

const Score: React.FC<ScoreProps> = ({
  score,
  size = "md",
  showLabel = true,
  showDescription = true,
  className = "",
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const { color, gradient, label, description } = getScoreInfo(clampedScore);

  // Size variants
  const sizeClasses = {
    sm: {
      wrapper: "w-16 h-16",
      scoreText: "text-lg",
      labelText: "text-xs",
      descriptionText: "text-xs",
      thickness: 3,
    },
    md: {
      wrapper: "w-24 h-24",
      scoreText: "text-2xl",
      labelText: "text-sm",
      descriptionText: "text-xs",
      thickness: 4,
    },
    lg: {
      wrapper: "w-32 h-32",
      scoreText: "text-3xl",
      labelText: "text-base",
      descriptionText: "text-sm",
      thickness: 5,
    },
  };

  const { wrapper, scoreText, labelText, descriptionText, thickness } =
    sizeClasses[size];

  // Calculate SVG parameters for circle
  const radius = 50 - thickness;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

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
