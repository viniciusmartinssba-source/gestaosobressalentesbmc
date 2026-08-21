import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TECHNICIANS = [
  { nome: "Bruno Terras", matricula: "U57097" },
  { nome: "Leonardo Martins", matricula: "U61986" },
  { nome: "Marcos Vinicius", matricula: "U39920" },
  { nome: "José Fagner", matricula: "U63108" },
  { nome: "Luiz Gustavo", matricula: "U60582" },
  { nome: "Vinicius Amaral", matricula: "U57122" },
  { nome: "Fábio Trigueiro", matricula: "U56683" },
  { nome: "Phillipe Oliveira", matricula: "U63270" },
  { nome: "Hiago Lopes", matricula: "U62963" },
  { nome: "José Pedro", matricula: "U39919" },
  { nome: "Robson Correia", matricula: "U52648" }
];

export const resetUserPasswords = createServerFn({ method: "POST" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const results = [];
    
    for (const tech of TECHNICIANS) {
      const email = tech.nome.toLowerCase().replace(/\s+/g, '.') + "@empresa.com";
      
      // 1. Get the user by email
      const { data: userData, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
      if (getUserError) throw getUserError;
      
      const user = userData.users.find(u => u.email === email);
      
      if (user) {
        // 2. Update password to be the matricula
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          user.id,
          { password: tech.matricula }
        );
        
        results.push({ 
          nome: tech.nome, 
          email, 
          status: updateError ? `Erro: ${updateError.message}` : "Senha resetada para " + tech.matricula 
        });
      } else {
        results.push({ nome: tech.nome, email, status: "Usuário não encontrado" });
      }
    }
    
    return { results };
  });
