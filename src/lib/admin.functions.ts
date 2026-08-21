import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const importMaterials = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    csvData: z.string(),
    clearExisting: z.boolean().default(false)
  }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Simple CSV parser (expecting SAP;Description or similar)
    // Supports common separators: comma, semicolon, tab
    const lines = data.csvData.split('\n');
    const pecas = lines.map(line => {
      const parts = line.split(/[;,\t]/);
      if (parts.length < 2) return null;
      
      const sap = parts[0].trim();
      const descricao = parts.slice(1).join(' ').trim();
      
      if (!sap || !descricao) return null;
      return { sap, descricao };
    }).filter(Boolean) as { sap: string, descricao: string }[];

    if (pecas.length === 0) {
      throw new Error("Nenhum dado válido encontrado para importação.");
    }

    if (data.clearExisting) {
      // Note: This might fail if there are foreign key constraints from movimentacoes
      await supabaseAdmin.from('pecas').delete().neq('sap', '0');
    }

    const { error } = await supabaseAdmin
      .from('pecas')
      .upsert(pecas, { onConflict: 'sap' });

    if (error) throw error;

    return { importedCount: pecas.length };
  });
