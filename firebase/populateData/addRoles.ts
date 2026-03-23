import { addRole } from "../services/rolesService.ts"; // .ts is needed
const roles = [
  { role_id: "1", role_name: "Parent" },
  { role_id: "2", role_name: "Midwife" },
  { role_id: "3", role_name: "PHNS" },
  { role_id: "4", role_name: "SPHM" },
  { role_id: "5", role_name: "Doctor" },
];

roles.forEach(async (role) => await addRole(role));
