export function getJWT() {
  return localStorage.getItem("token-e")
}

export function setJWT(value) {
  return localStorage.setItem("token-e", value)
}

export function removeJWT() {
  return localStorage.removeItem("token-e")
}
