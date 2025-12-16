export const timeFormat = (timestamp: string | number | Date): string => {
  const now = new Date();
  const sentTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - sentTime.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just Now"; // Less than 5 seconds
  // if (diffInSeconds < 60) return `${diffInSeconds}sec`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}hr`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}D`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}W`;

  return sentTime.toLocaleDateString(); // Fallback to full date
};
