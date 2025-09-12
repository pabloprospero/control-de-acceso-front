import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Control de Acceso",
  version: packageJson.version,
  copyright: `© ${currentYear}, Epika Software.`,
  meta: {
    title: "Control de Acceso - Epika",
    description: "Control de Acceso Epika, para RD",
  },
};
