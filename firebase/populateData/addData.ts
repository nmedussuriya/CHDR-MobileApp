import { addUser } from "../services/usersService.tsx";
import { addParent } from "../services/parentsService.tsx";
import { addChild } from "../services/childrenService.tsx";
import { addVaccine } from "../services/vaccinesService.tsx";



// Insert vaccines
const vaccines = [
  { vaccine_id: "v1", vaccine_name: "BCG", Age_group: "At Birth" },
];

vaccines.forEach(async (v) => await addVaccine(v));
