import { createServerFn } from "@tanstack/react-start";
import { getInitialData } from "./data.functions";

export const bootstrapTechnicians = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  
  // List of technicians from the requirements
  const technicians = [
    { nome: "Bruno Terras", matricula: "U57097", email: "bruno.terras@empresa.com" },
    { nome: "Leonardo Martins", matricula: "U61986", email: "leonardo.martins@empresa.com" },
    { nome: "Marcos Vinicius", matricula: "U39920", email: "marcos.vinicius@empresa.com" },
    { nome: "José Fagner", matricula: "U63108", email: "jose.fagner@empresa.com" },
    { nome: "Luiz Gustavo", matricula: "U60582", email: "luiz.gustavo@empresa.com" },
    { nome: "Vinicius Amaral", matricula: "U57122", email: "vinicius.amaral@empresa.com" },
    { nome: "Fábio Trigueiro", matricula: "U56683", email: "fabio.trigueiro@empresa.com" },
    { nome: "Phillipe Oliveira", matricula: "U63270", email: "phillipe.oliveira@empresa.com" },
    { nome: "Hiago Lopes", matricula: "U62963", email: "hiago.lopes@empresa.com" },
    { nome: "José Pedro", matricula: "U39919", email: "jose.pedro@empresa.com" },
    { nome: "Robson Correia", matricula: "U52648", email: "robson.correia@empresa.com" },
  ];

  const results = [];

  for (const tech of technicians) {
    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === tech.email);

    if (existingUser) {
      // Update password to be the matricula
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password: tech.matricula }
      );
      
      if (updateError) {
        results.push({ email: tech.email, status: "error", message: updateError.message });
      } else {
        results.push({ email: tech.email, status: "updated_password" });
      }
    } else {
      // Create user with matricula as password
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: tech.email,
        password: tech.matricula,
        email_confirm: true,
        user_metadata: {
          nome: tech.nome,
          matricula: tech.matricula
        }
      });

      if (createError) {
        results.push({ email: tech.email, status: "error", message: createError.message });
      } else {
        results.push({ email: tech.email, status: "created" });
      }
    }
  }

  return results;
});
