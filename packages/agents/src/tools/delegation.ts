import type Anthropic from "@anthropic-ai/sdk";
import type { AgentId } from "../types.js";

export const delegationTools: Anthropic.Tool[] = [
  {
    name: "delegate_task",
    description:
      "Görevi belirtilen ajan'a devret. Sonucu bekle ve geri döndür.",
    input_schema: {
      type: "object" as const,
      properties: {
        to: {
          type: "string",
          description: "Hedef ajan ID'si",
          enum: [
            "senior-export-expert",
            "market-intelligence",
            "content-marketing",
            "seo-growth",
            "data-analyst",
            "frontend-dev",
            "backend-dev",
            "qa-tester",
            "remotion-specialist",
            "ux-designer",
            "site-auditor",
            "revision-coordinator",
            "performance-reviewer",
          ],
        },
        task_type: {
          type: "string",
          description: "Görev türü (örn: validate_content, write_article)",
        },
        instruction: {
          type: "string",
          description: "Ajana verilecek detaylı görev talimatı",
        },
        context: {
          type: "object",
          description: "Görev için ek bağlam verisi",
        },
      },
      required: ["to", "task_type", "instruction"],
    },
  },
  {
    name: "review_output",
    description: "Bir ajanın çıktısını incele ve onay/ret kararı ver.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: { type: "string", description: "İncelenecek ajanın ID'si" },
        output: { type: "string", description: "İncelenecek içerik" },
        feedback: { type: "string", description: "Geri bildirim veya onay notu" },
        approved: { type: "boolean", description: "Onaylandı mı?" },
      },
      required: ["agent_id", "output", "approved"],
    },
  },
  {
    name: "set_priority",
    description: "Mevcut sprint için görev önceliğini güncelle.",
    input_schema: {
      type: "object" as const,
      properties: {
        task: { type: "string" },
        priority: {
          type: "string",
          enum: ["critical", "high", "medium", "low"],
        },
        reason: { type: "string" },
      },
      required: ["task", "priority"],
    },
  },
];

export const exportExpertTools: Anthropic.Tool[] = [
  {
    name: "validate_content",
    description: "Teknik ihracat içeriğini doğruluk açısından kontrol et.",
    input_schema: {
      type: "object" as const,
      properties: {
        content: { type: "string", description: "Doğrulanacak içerik" },
        topic: {
          type: "string",
          description: "Konu (incoterms, gümrük, lojistik, akreditif)",
        },
      },
      required: ["content", "topic"],
    },
  },
  {
    name: "lookup_regulation",
    description: "Türkiye ihracat mevzuatında kural veya yönetmelik ara.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string" },
        regulation_type: {
          type: "string",
          enum: ["gümrük", "incoterms", "teşvik", "belge", "kota"],
        },
      },
      required: ["query"],
    },
  },
];

export const dataTools: Anthropic.Tool[] = [
  {
    name: "query_export_data",
    description: "İl veya sektör bazlı ihracat verilerini sorgula.",
    input_schema: {
      type: "object" as const,
      properties: {
        query_type: {
          type: "string",
          enum: ["province", "sector", "comparison", "trend"],
        },
        filters: {
          type: "object",
          properties: {
            province: { type: "string" },
            sector: { type: "string" },
            year_start: { type: "number" },
            year_end: { type: "number" },
          },
        },
      },
      required: ["query_type"],
    },
  },
  {
    name: "create_chart_config",
    description:
      "Veri için grafik konfigürasyonu oluştur (Recharts veya Remotion için).",
    input_schema: {
      type: "object" as const,
      properties: {
        chart_type: {
          type: "string",
          enum: ["bar", "line", "pie", "area", "ranking"],
        },
        data_source: { type: "string" },
        title: { type: "string" },
        animated: {
          type: "boolean",
          description: "Remotion animasyonu mu olsun?",
        },
      },
      required: ["chart_type", "data_source", "title"],
    },
  },
  {
    name: "generate_insights",
    description: "Veri setinden önemli içgörüler ve yorumlar üret.",
    input_schema: {
      type: "object" as const,
      properties: {
        data_summary: { type: "string" },
        focus: {
          type: "string",
          enum: ["trend", "comparison", "opportunity", "risk"],
        },
      },
      required: ["data_summary", "focus"],
    },
  },
];

export const remotionTools: Anthropic.Tool[] = [
  {
    name: "create_composition",
    description: "Yeni bir Remotion animasyon kompozisyonu tasarla ve kodla.",
    input_schema: {
      type: "object" as const,
      properties: {
        composition_name: { type: "string" },
        data_type: {
          type: "string",
          enum: ["trend", "province", "sector", "ranking"],
        },
        duration_seconds: { type: "number" },
        color_scheme: {
          type: "string",
          enum: ["blue", "red", "green", "orange", "purple"],
        },
        input_props_schema: {
          type: "object",
          description: "Kompozisyonun beklediği prop yapısı",
        },
      },
      required: ["composition_name", "data_type", "duration_seconds"],
    },
  },
  {
    name: "animate_data",
    description:
      "Veri noktalarını Remotion spring/interpolate ile animasyona dönüştür.",
    input_schema: {
      type: "object" as const,
      properties: {
        animation_type: {
          type: "string",
          enum: [
            "count-up",
            "bar-grow",
            "line-draw",
            "fade-in",
            "slide-in",
            "pie-reveal",
          ],
        },
        data_points: { type: "array", items: { type: "number" } },
        labels: { type: "array", items: { type: "string" } },
        start_frame: { type: "number" },
        end_frame: { type: "number" },
      },
      required: ["animation_type", "start_frame", "end_frame"],
    },
  },
  {
    name: "export_video_config",
    description: "Remotion render için konfigürasyon dosyası oluştur.",
    input_schema: {
      type: "object" as const,
      properties: {
        composition_id: { type: "string" },
        output_format: {
          type: "string",
          enum: ["mp4", "gif", "webm"],
          description: "Web için webm önerilir",
        },
        fps: { type: "number", description: "30 veya 60" },
        width: { type: "number" },
        height: { type: "number" },
      },
      required: ["composition_id", "output_format"],
    },
  },
];

export const uxDesignerTools: Anthropic.Tool[] = [
  {
    name: "design_layout",
    description:
      "Bir sayfa veya bileşen için mobil-first wireframe ve layout tasarımı üret.",
    input_schema: {
      type: "object" as const,
      properties: {
        component: {
          type: "string",
          description: "Tasarlanacak bileşen (ör: il detay sayfası, grafik kartı)",
        },
        viewport: {
          type: "string",
          enum: ["mobile", "tablet", "desktop", "all"],
          description: "Odak viewport'u",
        },
        data_type: {
          type: "string",
          description: "Gösterilecek veri türü (ör: bar chart, trend line, tablo)",
        },
        constraints: {
          type: "array",
          items: { type: "string" },
          description: "Kısıtlar (ör: 'dokunmatik ekran', 'düşük bant genişliği')",
        },
      },
      required: ["component", "viewport"],
    },
  },
  {
    name: "audit_accessibility",
    description:
      "Bileşenin WCAG 2.1 AA uyumunu denetle ve iyileştirme önerileri sun.",
    input_schema: {
      type: "object" as const,
      properties: {
        component_description: {
          type: "string",
          description: "Denetlenecek bileşenin HTML/JSX açıklaması",
        },
        check_types: {
          type: "array",
          items: { type: "string" },
          enum: [
            "color-contrast",
            "keyboard-nav",
            "screen-reader",
            "touch-targets",
            "reduced-motion",
            "focus-management",
          ],
        },
      },
      required: ["component_description"],
    },
  },
  {
    name: "plan_chart_mobile",
    description:
      "Bir veri grafiğinin mobil cihazda nasıl gösterileceğini ve okunabilirliğini planla.",
    input_schema: {
      type: "object" as const,
      properties: {
        chart_type: {
          type: "string",
          enum: ["bar", "line", "pie", "donut", "area", "ranking", "remotion-player"],
        },
        data_points_count: {
          type: "number",
          description: "Toplam veri noktası sayısı",
        },
        priority_info: {
          type: "string",
          description: "Kullanıcının mobilde mutlaka görmesi gereken bilgi",
        },
      },
      required: ["chart_type", "priority_info"],
    },
  },
  {
    name: "define_interaction",
    description:
      "Bileşenin hover, focus, active ve touch durumlarını tanımla.",
    input_schema: {
      type: "object" as const,
      properties: {
        element: { type: "string" },
        states: {
          type: "array",
          items: { type: "string" },
          enum: ["hover", "focus", "active", "disabled", "loading", "error"],
        },
        animation_preference: {
          type: "string",
          enum: ["none", "subtle", "expressive"],
        },
      },
      required: ["element", "states"],
    },
  },
];

export const contentTools: Anthropic.Tool[] = [
  {
    name: "write_article",
    description: "SEO uyumlu ihracat rehberi veya blog yazısı yaz.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string" },
        keywords: { type: "array", items: { type: "string" } },
        target_audience: {
          type: "string",
          enum: ["beginner", "intermediate", "expert"],
        },
        word_count: { type: "number" },
        sections: { type: "array", items: { type: "string" } },
      },
      required: ["title", "keywords", "target_audience"],
    },
  },
  {
    name: "research_keywords",
    description: "İhracat konusu için Türkçe SEO anahtar kelime araştırması yap.",
    input_schema: {
      type: "object" as const,
      properties: {
        topic: { type: "string" },
        focus_region: { type: "string", description: "İl veya sektör" },
        include_longtail: { type: "boolean" },
      },
      required: ["topic"],
    },
  },
];

export const auditTools: Anthropic.Tool[] = [
  {
    name: "read_file",
    description: "Proje dizinindeki bir dosyayı oku (app/, data/ gibi).",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Proje köküne göre göreli dosya yolu, ör: packages/web/app/page.tsx",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "list_pages",
    description: "Next.js app/ dizinindeki mevcut sayfaları listele.",
    input_schema: {
      type: "object" as const,
      properties: {
        dir: {
          type: "string",
          description: "Listelenecek dizin, varsayılan: packages/web/app",
        },
      },
      required: [],
    },
  },
  {
    name: "check_seo",
    description: "Bir sayfa dosyasının SEO yapısını analiz et: title, description, H1, H2'ler, schema markup.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Analiz edilecek sayfa dosyasının yolu",
        },
      },
      required: ["path"],
    },
  },
];

export const revisionTools: Anthropic.Tool[] = [
  delegationTools[0],
  delegationTools[1],
];

export function getToolsForAgent(agentId: AgentId): Anthropic.Tool[] {
  const toolMap: Record<AgentId, Anthropic.Tool[]> = {
    "project-manager": delegationTools,
    "senior-export-expert": exportExpertTools,
    "market-intelligence": [
      ...dataTools,
      {
        name: "find_leads",
        description: "Hedef pazarda potansiyel alıcı/müşteri listesi oluştur.",
        input_schema: {
          type: "object" as const,
          properties: {
            target_country: { type: "string" },
            sector: { type: "string" },
            company_size: {
              type: "string",
              enum: ["sme", "large", "all"],
            },
            channels: {
              type: "array",
              items: { type: "string" },
              description: "linkedin, alibaba, kompass gibi kanallar",
            },
          },
          required: ["target_country", "sector"],
        },
      },
    ],
    "content-marketing": contentTools,
    "seo-growth": [contentTools[1]],
    "data-analyst": dataTools,
    "frontend-dev": [
      {
        name: "generate_component",
        description: "Next.js + Tailwind React bileşeni oluştur.",
        input_schema: {
          type: "object" as const,
          properties: {
            component_name: { type: "string" },
            component_type: {
              type: "string",
              enum: ["page", "chart", "card", "table", "hero"],
            },
            props: { type: "object" },
          },
          required: ["component_name", "component_type"],
        },
      },
    ],
    "backend-dev": [
      {
        name: "design_api",
        description: "API endpoint şeması ve route yapısı tasarla.",
        input_schema: {
          type: "object" as const,
          properties: {
            resource: { type: "string" },
            methods: {
              type: "array",
              items: { type: "string" },
              enum: ["GET", "POST", "PUT", "DELETE"],
            },
          },
          required: ["resource", "methods"],
        },
      },
    ],
    "qa-tester": [
      {
        name: "generate_test_cases",
        description: "Belirli bir özellik için test senaryoları oluştur.",
        input_schema: {
          type: "object" as const,
          properties: {
            feature: { type: "string" },
            test_types: {
              type: "array",
              items: { type: "string" },
              enum: ["unit", "integration", "e2e", "accessibility", "mobile"],
            },
          },
          required: ["feature"],
        },
      },
    ],
    "remotion-specialist": remotionTools,
    "ux-designer": uxDesignerTools,
    "site-auditor": auditTools,
    "revision-coordinator": revisionTools,
    "performance-reviewer": [auditTools[0]],
  };
  return toolMap[agentId] ?? [];
}
