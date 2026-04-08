"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const calculateTimeLeft = (targetDate) => {
  const now = new Date();
  // Remove +06 offset for safer parsing, then create a Date object
  const targetDateWithoutOffset = targetDate ? targetDate.split("+")[0] : targetDate;
  const target = new Date(targetDateWithoutOffset);

  // Debugging logs to inspect parsed dates and difference
  console.log("Debug: Current Date (now):", now.toISOString());
  console.log("Debug: Target Date (target):", target.toISOString());
  
  const difference = +target - +now;
  console.log("Debug: Time Difference (ms):", difference);

  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  } else {
    timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return timeLeft;
};

const CountdownTimer = ({ data, className }) => {
  console.log("CountdownTimer received data:", data);
  const targetDate = data?.endDate;
  console.log("CountdownTimer targetDate showing:", targetDate);

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    // If no targetDate, or if the countdown has already finished (from initial calculation),
    // then there\"s no need to set up an interval.
    // Also, re-calculate initial state if targetDate changes.
    if (!targetDate || Object.values(calculateTimeLeft(targetDate)).every(val => val === 0)) {
      setTimeLeft(calculateTimeLeft(targetDate)); // Ensure state is zero if targetDate is invalid/finished
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]); // Re-run effect if targetDate changes

  const timerComponents = [];
  const timeUnits = ["days", "hours", "minutes", "seconds"];

  timeUnits.forEach((interval, index) => {
    // Display all time components that have a non-zero value, or if it\"s seconds
    // and there\"s overall time left.
    const isOverallTimeLeft = Object.values(timeLeft).some(val => val > 0);
    if (isOverallTimeLeft) {
      timerComponents.push(
        <div key={interval} className="flex flex-col items-center p-2 rounded-lg bg-white shadow-sm border border-gray-100 min-w-[50px] md:min-w-[80px] flex-shrink-0"> {/* Adjusted min-w and padding */}
          <span className="text-xl md:text-4xl font-extrabold text-gray-800">{String(timeLeft[interval]).padStart(2, "0")}</span> {/* Reduced mobile text size */}
          <span className="text-[10px] md:text-sm text-gray-500 uppercase mt-1 md:mt-2 tracking-wider">{interval}</span> {/* Reduced mobile text size */}
        </div>
      );
      // Add separator after each unit except the last one
      if (index < timeUnits.length - 1) {
        timerComponents.push(<span key={`separator-${interval}`} className="text-xl md:text-4xl font-light text-gray-300 mx-1 md:mx-2">:</span>); {/* Reduced mobile text size */}
      }
    }
  });

  // If no target date, or if all time components are zero (meaning countdown is truly finished)
  if (!targetDate || timerComponents.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "bg-white backdrop-blur-sm rounded-xl p-2 md:p-4 shadow-lg border border-gray-200 flex flex-wrap items-center justify-center gap-y-2 gap-x-1 md:space-x-0 text-foreground", // Adjusted padding and gap-x/gap-y
      className
    )}>
      {timerComponents.length ? timerComponents : <span>Time\"s up!</span>}
    </div>
  );
};

export default CountdownTimer;

