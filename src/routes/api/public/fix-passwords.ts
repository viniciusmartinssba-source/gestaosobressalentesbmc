import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/fix-passwords')({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
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

        const results = [];
        
        // Use a more direct way to find users
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) return new Response(JSON.stringify({ error: listError.message }), { status: 500 });

        for (const tech of TECHNICIANS) {
          const email = tech.nome.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove accents
            .replace(/\s+/g, '.') + "@empresa.com";
          
          const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
          
          if (user) {
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
              user.id,
              { password: tech.matricula }
            );
            results.push({ email, status: updateError ? updateError.message : "Success" });
          } else {
            // Try to find by email prefix or something?
            results.push({ email, status: "Not found" });
          }
        }

        return new Response(JSON.stringify({ results }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }
})
