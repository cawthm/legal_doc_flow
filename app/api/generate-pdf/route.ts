import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function GET() {
  try {
    console.log('PDF generation started')
    
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    
    // Basic PDF generation for testing
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    page.drawText('Test PDF', {
      x: 50,
      y: 750,
      size: 20,
      font,
    })
    
    const pdfBytes = await pdfDoc.save()
    
    console.log('PDF generation completed')

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test.pdf"',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: errorMessage },
      { status: 500 }
    )
  }
} 