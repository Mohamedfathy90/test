export const getSessionId = () => {
  let sessionId = localStorage.getItem("session_id");

  if (!sessionId) {
    sessionId =
      "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("session_id", sessionId);
  }

  return sessionId;
};
export const clearSessionId = () => {
  localStorage.removeItem("session_id");
};
export const hasSessionId = () => {
  return !!localStorage.getItem("session_id");
};
