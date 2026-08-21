import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/bootstrap')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        const technicians = [
          { matricula: "U57097", nome: "Bruno Terras", email: "bruno.terras@empresa.com" },
          { matricula: "U61986", nome: "Leonardo Martins", email: "leonardo.martins@empresa.com" },
          { matricula: "U39920", nome: "Marcos Vinicius", email: "marcos.vinicius@empresa.com" },
          { matricula: "U63108", nome: "José Fagner", email: "jose.fagner@empresa.com" },
          { matricula: "U60582", nome: "Luiz Gustavo", email: "luiz.gustavo@empresa.com" },
          { matricula: "U57122", nome: "Vinicius Amaral", email: "vinicius.amaral@empresa.com" },
          { matricula: "U56683", nome: "Fábio Trigueiro", email: "fabio.trigueiro@empresa.com" },
          { matricula: "U63270", nome: "Phillipe Oliveira", email: "phillipe.oliveira@empresa.com" },
          { matricula: "U62963", nome: "Hiago Lopes", email: "hiago.lopes@empresa.com" },
          { matricula: "U39919", nome: "José Pedro", email: "jose.pedro@empresa.com" },
          { matricula: "U52648", nome: "Robson Correia", email: "robson.correia@empresa.com" }
        ];

        const results = [];

        for (const tech of technicians) {
          try {
            // Check if user exists in Auth
            const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
            if (listError) throw listError;

            const existingUser = users.users.find(u => u.email === tech.email);

            let userId;

            if (existingUser) {
              userId = existingUser.id;
              // Update password to matricula
              const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                userId,
                { password: tech.matricula, user_metadata: { nome: tech.nome, matricula: tech.matricula } }
              );
              if (updateError) throw updateError;
              results.push({ email: tech.email, status: 'updated' });
            } else {
              // Create user
              const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: tech.email,
                password: tech.matricula,
                email_confirm: true,
                user_metadata: {
                  nome: tech.nome,
                  matricula: tech.matricula
                }
              });
              if (createError) throw createError;
              userId = newUser.user.id;
              results.push({ email: tech.email, status: 'created' });
            }

            // Sync Profile
            const { error: profileError } = await supabaseAdmin
              .from('profiles')
              .upsert({
                id: userId,
                nome: tech.nome,
                matricula: tech.matricula,
                email: tech.email
              });
            
            if (profileError) throw profileError;

          } catch (err: any) {
            results.push({ email: tech.email, status: 'error', message: err.message });
          }
        }

        return new Response(JSON.stringify({ results }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }
});
