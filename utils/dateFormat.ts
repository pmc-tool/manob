import { date } from "yup";
import { useAppStore } from "../state/hooks";
import { SetCurrentLiveJobs } from "../state/slices/liveJob.slice";

export const dateFormat = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  const month = date.toLocaleString("en-US", { month: "short" }); // Get short month name
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// day wise expire date
export const getExpiryDate = (date: Date, totalDay: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + totalDay);
  const day = newDate.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  const month = newDate.toLocaleString("en-US", { month: "short" }); // Get short month name
  const year = newDate.getFullYear();
  return `${day} ${month} ${year}`;
};

export const dateAddSixMonth = (dateString: string): string => {
  const currentDate = new Date(dateString); // Get the current date
  const futureDate = new Date(currentDate); // Clone the current date
  futureDate.setMonth(futureDate.getMonth() + 6); // Add 6 months

  const day = futureDate.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  const month = futureDate.toLocaleString("en-US", { month: "short" }); // Get short month name
  const year = futureDate.getFullYear();

  return `${day} ${month} ${year}`;
};

export const dateTimeFormat = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0"); // Add leading zero for the day
  const month = date.toLocaleString("en-US", { month: "short" }); // Get short month name
  const year = date.getFullYear();

  // Extract hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Add leading zero for minutes
  const period = hours >= 12 ? "PM" : "AM"; // Determine AM/PM

  hours = hours % 12 || 12; // Convert to 12-hour format, handling midnight (0 hours)

  return `${day} ${month} ${year} ${hours}:${minutes} ${period}`;
};

export const getTime = (dateString) => {
  const date = new Date(dateString);
  return date?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Ensures the time is in 12-hour format with AM/PM
  });
};

export const calculateTimeAgo = (dateString: string): string => {
  const cleanDateString = dateString?.split(".")[0] + "Z";
  const targetDate = new Date(cleanDateString);
  const currentDate = new Date();

  const diffInMilliseconds = currentDate.getTime() - targetDate.getTime();
  if (diffInMilliseconds < 60000) {
    return "just now";
  }

  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // approximation
  const years = Math.floor(days / 365); // approximation

  if (years > 0) {
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }
  if (months > 0) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }
  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
  if (minutes > 0) {
    return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  }

  return "just now";
};

export const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} yr`;
  if (days > 0) return `${days} dy`;
  if (hours > 0) return `${hours} hr`;
  if (minutes > 0) return `${minutes} min`;
  return `${seconds} sec`;
};

export const calculateSupportDuration = (
  minDateStr: string,
  maxDateStr: string
): string => {
  const minDate = new Date(minDateStr);
  const maxDate = new Date(maxDateStr);
  const currentDate = new Date();

  // If the max date has already expired, return "0"
  if (maxDate < currentDate) {
    return "0";
  }

  // Calculate difference in milliseconds
  const diffMs = maxDate.getTime() - minDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Get difference in years, months, and remaining days
  let years = maxDate.getFullYear() - minDate.getFullYear();
  let months = maxDate.getMonth() - minDate.getMonth();
  let days = maxDate.getDate() - minDate.getDate();

  // Adjust negative values
  if (days < 0) {
    months -= 1;
    days += new Date(
      minDate.getFullYear(),
      minDate.getMonth() + 1,
      0
    ).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // 🟢 If more than a year, round everything into months
  if (years > 0) {
    const totalMonths = years * 12 + months;
    return `${totalMonths} months`;
  }

  // 🟢 If less than a month, return days
  if (months === 0) {
    return `${diffDays} days`;
  }

  // 🟢 Otherwise, return months
  return `${months} months`;
};

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0"); // Months are 0-based
  const day = `${date.getDate()}`.padStart(2, "0");

  let hours = date.getHours();
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
}
