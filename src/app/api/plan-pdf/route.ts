import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import type { TradingProfileInput } from "@/types/trading";

export async function POST(req: Request) {
  try {
    const { markdown, profile } = await req.json();

    if (!markdown) {
      return NextResponse.json(
        { error: "Le contenu markdown est requis" },
        { status: 400 }
      );
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      bufferPages: true,
    });

    const chunks: Buffer[] = [];

    // Collect data chunks
    doc.on("data", (chunk) => chunks.push(chunk));

    // Promise to handle the end of the stream
    const pdfBuffer = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
      doc.on("error", reject);
    });

    // --- Cover Page ---
    doc.moveDown(8);
    doc.fontSize(26).font("Helvetica-Bold").text("Plan de trading", { align: "center" });
    doc.fontSize(20).text("AlgoNovaAI TradePlan Builder", { align: "center" });
    
    doc.moveDown(2);
    doc.fontSize(14).font("Helvetica").fillColor("grey").text("Plan généré automatiquement à partir de votre profil de trader", { align: "center" });
    
    doc.moveDown(4);
    const date = new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.fontSize(12).fillColor("black").text(`Généré le ${date}`, { align: "center" });

    // --- Visual Dashboard (Charts) ---
    if (profile) {
      const p = profile as TradingProfileInput;
      const riskAmount = (p.capital * p.riskPerTradePct) / 100;
      const maxLossAmount = (p.capital * p.maxDailyLossPct) / 100;

      doc.moveDown(4);
      
      // Draw a box for the dashboard
      const startY = doc.y;
      doc.rect(50, startY, 495, 180).fillAndStroke("#f8fafc", "#e2e8f0");
      
      doc.fillColor("black").fontSize(16).font("Helvetica-Bold").text("Aperçu du Risque", 70, startY + 20);

      // Capital Display
      doc.fontSize(12).font("Helvetica").text("Capital Initial", 70, startY + 50);
      doc.fontSize(24).font("Helvetica-Bold").fillColor("#2563eb").text(`${p.capital} €`, 70, startY + 65);

      // Bar Charts
      const barStartX = 250;
      const barWidth = 200;
      
      // Risk Per Trade Bar
      doc.fontSize(10).font("Helvetica").fillColor("black").text(`Risque / Trade (${p.riskPerTradePct}%)`, barStartX, startY + 50);
      doc.rect(barStartX, startY + 65, barWidth, 10).fill("#e2e8f0"); // Background bar
      // Calculate width relative to max daily loss (just for visualization scale)
      // Let's say max width represents 5% for scale
      const riskWidth = Math.min((p.riskPerTradePct / 5) * barWidth, barWidth);
      doc.rect(barStartX, startY + 65, riskWidth, 10).fill("#3b82f6"); // Blue bar
      doc.fontSize(10).fillColor("#3b82f6").text(`${riskAmount.toFixed(2)} €`, barStartX + barWidth + 10, startY + 65);

      // Max Daily Loss Bar
      doc.fontSize(10).font("Helvetica").fillColor("black").text(`Perte Max / Jour (${p.maxDailyLossPct}%)`, barStartX, startY + 90);
      doc.rect(barStartX, startY + 105, barWidth, 10).fill("#e2e8f0"); // Background bar
      const lossWidth = Math.min((p.maxDailyLossPct / 5) * barWidth, barWidth);
      doc.rect(barStartX, startY + 105, lossWidth, 10).fill("#ef4444"); // Red bar
      doc.fontSize(10).fillColor("#ef4444").text(`${maxLossAmount.toFixed(2)} €`, barStartX + barWidth + 10, startY + 105);

      // Bottom note
      doc.fontSize(10).font("Helvetica-Oblique").fillColor("grey").text(
        "Ce tableau de bord résume vos paramètres de risque initiaux.",
        70,
        startY + 140
      );
    }

    doc.addPage();

    // --- Content Parsing ---
    const lines = markdown.replace(/\r/g, "").trim().split("\n");
    
    // Reset font for content
    doc.font("Helvetica").fontSize(12).fillColor("black");

    let lastLineWasEmpty = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine === "") {
        if (!lastLineWasEmpty) {
            doc.moveDown(0.5);
            lastLineWasEmpty = true;
        }
        continue;
      }
      
      lastLineWasEmpty = false;
      
      if (trimmedLine.startsWith("# ")) {
        // H1
        doc.moveDown(1.5);
        doc.fontSize(18).font("Helvetica-Bold").text(trimmedLine.replace(/^#\s+/, ""), { align: "left" });
        doc.moveDown(0.8);
      } else if (trimmedLine.startsWith("## ")) {
        // H2
        doc.moveDown(1.2);
        doc.fontSize(15).font("Helvetica-Bold").text(trimmedLine.replace(/^##\s+/, ""), { align: "left" });
        doc.moveDown(0.5);
      } else if (trimmedLine.startsWith("### ")) {
        // H3
        doc.moveDown(0.8);
        doc.fontSize(13).font("Helvetica-Bold").text(trimmedLine.replace(/^###\s+/, ""), { align: "left" });
        doc.moveDown(0.4);
      } else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        // Bullet point
        doc.moveDown(0.5);
        doc.fontSize(12).font("Helvetica").text(`• ${trimmedLine.replace(/^[-*]\s+/, "")}`, {
          indent: 20,
          align: "left",
          width: 480
        });
      } else {
        // Normal text
        if (/^\d+\.\s/.test(trimmedLine)) {
             doc.moveDown(0.5);
             doc.fontSize(12).font("Helvetica").text(trimmedLine, {
                indent: 20,
                align: "left",
                width: 480
            });
        } else {
            doc.moveDown(0.2);
            doc.fontSize(12).font("Helvetica").text(trimmedLine, {
                align: "left",
                width: 495
            });
        }
      }
    }

    // --- Footer & Page Numbers ---
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      
      // Don't add footer to cover page (index 0)
      if (i > 0) {
        const bottom = doc.page.height - 30;
        
        doc.fontSize(9).fillColor("grey").text(
          "AlgoNovaAI TradePlan Builder – Document généré automatiquement",
          50,
          bottom,
          { align: "left", width: 200 }
        );

        doc.text(
          `Page ${i + 1} / ${range.count}`,
          doc.page.width - 150,
          bottom,
          { align: "right", width: 100 }
        );
      }
    }

    // Finalize the PDF
    doc.end();

    const buffer = await pdfBuffer;

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=plan-trading-premium.pdf",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 }
    );
  }
}
