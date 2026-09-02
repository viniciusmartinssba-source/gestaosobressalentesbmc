import { createFileRoute } from "@tanstack/react-router";
import { PECAS_SEED } from "@/lib/pecas-seed";

export const Route = createFileRoute("/api/public/seed-pecas")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const keep = PECAS_SEED.map((p) => p.sap);
        const { data: used } = await supabaseAdmin.from("movimentacoes").select("sap");
        const usedSaps = (used || []).map((m: { sap: string }) => m.sap);
        const { data: all } = await supabaseAdmin.from("pecas").select("sap");
        const toDelete = (all || [])
          .map((p: { sap: string }) => p.sap)
          .filter((s) => !keep.includes(s) && !usedSaps.includes(s));
        if (toDelete.length) {
          await supabaseAdmin.from("pecas").delete().in("sap", toDelete);
        }
        for (let i = 0; i < PECAS_SEED.length; i += 500) {
          const { error } = await supabaseAdmin
            .from("pecas")
            .upsert(PECAS_SEED.slice(i, i + 500), { onConflict: "sap" });
          if (error) return Response.json({ error: error.message }, { status: 500 });
        }
        return Response.json({ ok: true, count: PECAS_SEED.length, deleted: toDelete.length });
      },
    },
  },
});
