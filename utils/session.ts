
export const setSessionData = async (SESSION_KEY:string, data:string, minutes:number) => {
  const EXPIRY_TIME = minutes * 60 * 1000; // 3 minutes in milliseconds
  const expiryTimestamp = Date.now() + EXPIRY_TIME;
  const sessionData = {
    value: data,
    expiry: expiryTimestamp,
  }; 
  typeof window !== "undefined" && localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
};

// Get session data
export const getSessionData = async (SESSION_KEY:string) => {
  const sessionData = typeof window !== "undefined" && localStorage.getItem(SESSION_KEY);
  // console.log("sessionData", sessionData); 
  if (!sessionData) return null;

  const parsedData = JSON.parse(sessionData);
  if (Date.now() > parsedData.expiry) {
    typeof window !== "undefined" && localStorage.removeItem(SESSION_KEY); // Clear expired data
    return null;
  }
  return parsedData.value;
};


export function setCookie(cname:string, cvalue:string, exdays:number) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
// remove the cookie

export function deleteCookie(cname: string) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

