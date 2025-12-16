type Data = {
  condition: string;
  amount: number;
  postDate: string; // Date in the format "YYYY-MM-DD HH:MM:SS"
};
export function calculateCountdownTime({ condition, amount, postDate }: Data) {
  // Get the current date

  const targetDate = new Date(postDate);
  const createdTimestamp = Date.parse(postDate);
  if (!isNaN(createdTimestamp)) {
    // Calculate the minutes based on the condition
    let minutesToAdd = 0;
    switch (condition?.toLowerCase()) {
      case "day":
        minutesToAdd = amount * 24 * 60; // Convert days to minutes
        break;
      case "hour":
        minutesToAdd = amount * 60; // Convert hours to minutes
        break;
      default:
        return null;
    }

    // Add the calculated minutes to the target date
    targetDate.setMinutes(targetDate.getMinutes() + minutesToAdd);
    return targetDate;
  }
  return "";
}
