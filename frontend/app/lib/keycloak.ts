import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "project-tracker",
  clientId: "project-client",
});

export default keycloak;