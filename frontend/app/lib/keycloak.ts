import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "master",
  clientId: "security-admin-console",
});

export default keycloak;