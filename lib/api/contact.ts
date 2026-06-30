import { apiFetch } from "@/lib/api-client";
import { ContactDto } from "@/types/contact";

const endpoint = "email";

export const sendSupportEmail = (contact: ContactDto) => {
  return apiFetch<ContactDto>(endpoint, {
    method: "POST",
    body: JSON.stringify(contact),
  });
};
