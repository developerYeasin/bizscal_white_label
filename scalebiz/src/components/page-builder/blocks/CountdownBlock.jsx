"use client";

import React, { useState, useEffect } from "react";

/**
 * Countdown Block
 *
 * Displays a countdown timer to a specific date.
 *
 * Expected data:
 * - targetDate: ISO date string
 * - timezone: string (optional, defaults to local)
 * - layout: compact | expanded
 * - labels: { days, hours, minutes, seconds }
 * - style: minimal | card | gradient
 */
const CountdownBlock = ({ data }) => {
  const {
    targetDate,
    timezone,
    layout = "compact",
    labels = { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
    style = "minimal",
    className = "",
  } = data || {};

  const calculateTimeLeft = () => {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };

    const now = new Date();
    const target = new Date(targetDate);
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, expired: false };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) {
    return (
      <div className={`p-8 border-2 border-dashed rounded-lg text-center ${className}`}>
        <p className="text-muted-foreground text-sm">Set a target date in settings.</p>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: labels.days, max: 999 },
    { value: timeLeft.hours, label: labels.hours, max: 23 },
    { value: timeLeft.minutes, label: labels.minutes, max: 59 },
    { value: timeLeft.seconds, label: labels.seconds, max: 59 },
  ];

  const renderMinimal = () => (
    <div className={`flex items-center gap-4 text-2xl font-mono ${className}`}>
      {timeUnits.map((unit, idx) => (
        <React.Fragment key={idx}>
          <div className="flex items-center justify-center w-16 h-16 bg-muted rounded">
            <span className="tabular-nums">{String(unit.value).padStart(2, "0")}</span>
          </div>
          {idx < timeUnits.length - 1 && (
            <span className="text-muted-foreground">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderExpanded = () => (
    <div className={`grid grid-cols-4 gap-4 ${className}`}>
      {timeUnits.map((unit, idx) => (
        <div key={idx} className="flex flex-col items-center p-4 bg-card border rounded-lg">
          <div className="text-3xl font-mono mb-1 tabular-nums">
            {String(unit.value).padStart(2, "0")}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCard = () => (
    <div className={`p-8 rounded-xl text-center ${className}`}>
      {timeLeft.expired ? (
        <div className="text-2xl font-bold text-primary">Expired</div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Offer ends in:</p>
          {renderExpanded()}
        </div>
      )}
    </div>
  );

  const renderGradient = () => (
    <div className={`p-8 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-center ${className}`}>
      {timeLeft.expired ? (
        <div className="text-2xl font-bold">Expired</div>
      ) : (
        <>
          <p className="text-sm opacity-90 mb-4">Countdown</p>
          {renderExpanded()}
        </>
      )}
    </div>
  );

  switch (style) {
    case "card":
      return renderCard();
    case "gradient":
      return renderGradient();
    default:
      return layout === "expanded" ? renderExpanded() : renderMinimal();
  }
};

export default CountdownBlock;
