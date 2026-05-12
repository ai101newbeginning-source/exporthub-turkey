import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(
  _request: Request,
  { params }: { params: { il: string } }
) {
  const { il } = params;

  if (!/^[a-z]+$/.test(il)) {
    return NextResponse.json({ error: "Geçersiz il parametresi" }, { status: 400 });
  }

  const filePath = join(process.cwd(), "../../data/provinces", `${il}.json`);

  try {
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
      },
    });
  } catch {
    return NextResponse.json({ error: "İl verisi bulunamadı" }, { status: 404 });
  }
}
