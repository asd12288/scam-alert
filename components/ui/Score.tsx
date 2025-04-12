import React from "react";

const getScoreInfo = (score: number) => {
  if (score >= 90) {
    return {
      color: "bg-green-500",
      textColor: "text-green-600",
      label: "Safe",
    };
  }
  if (score >= 70) {
    return {
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      label: "Good",
    };
  }
  if (score >= 50) {
    return {
      color: "bg-orange-500",
      textColor: "text-orange-600",
      label: "Caution",
    };
  }
  return {
    color: "bg-red-500",
    textColor: "text-red-600",
    label: "Danger",
  };
};

interface ScoreProps {
  score: number;
}

const Score = ({ score }: ScoreProps) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const { color, textColor, label } = getScoreInfo(clampedScore);

  return (
    <div className="flex flex-col items-center text-black">
      {/* Simple progress circle */}
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-gray-100"></div>

        {/* Progress circle with clipped display based on score */}
        <div
          className={`absolute inset-0 rounded-full ${color}`}
          style={{
            clipPath: `polygon(50% 50%, 50% 0%, ${
              clampedScore >= 25
                ? "100% 0%"
                : `${50 + (50 * clampedScore) / 25}% 0%`
            }, 
                      ${clampedScore >= 25 ? "100% 100%" : "100% 50%"}, 
                      ${clampedScore >= 75 ? "0% 100%" : "50% 50%"}, 
                      ${clampedScore >= 50 ? "0% 0%" : "50% 50%"})`,
          }}
        ></div>

        {/* Inner circle with score */}
        <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center flex-col">
          <span className="text-2xl font-bold">{clampedScore}</span>
        </div>
      </div>

      <div className={`mt-2 font-medium ${textColor}`}>{label}</div>
    </div>
  );
};

export default Score;
