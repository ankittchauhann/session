const sessionIdToUserMap = new Map();

const setUserSession = (sessionId, user) => {
  sessionIdToUserMap.set(sessionId, user);
};

const getUserSession = (sessionId) => {
  return sessionIdToUserMap.get(sessionId);
};

module.exports = {
  setUserSession,
  getUserSession,
};
