import { useEffect, useState } from "react"
import { IconPlus, IconQrcode } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { QrGenerateDialog } from "@/components/qr-generate-dialog"
import { QrCodeCard } from "@/components/qr-code-card"
import { generateQrCodes, getAllQrCodes } from "@/api/qrCodeApi"
import { Loader2 } from "lucide-react"

export function QrCodesPage() {
  const [qrCodes, setQrCodes] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Fetch All QR Codes
  const fetchQrs = async () => {
    try {
      setLoading(true)
      const data = await getAllQrCodes()
      const transformedData = data.map((item) => ({
        id: item._id,
        qrLink: item.qrLink,
        qrImage: item.qrImage,
        isActive: item.isActive,
      }))
      setQrCodes(transformedData)
    } catch (error) {
      console.error("Failed to fetch QR codes", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQrs()
  }, [])

  const handleGenerate = async (count: number) => {
    try {
      setGenerating(true)
      await generateQrCodes(count)
      await fetchQrs()
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to generate QR codes", error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-balance">
            QR Codes
          </h2>
          <p className="text-muted-foreground">
            Generate and manage your QR codes.
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="w-full sm:w-auto 
             bg-yellow-500 
             hover:bg-yellow-600 
             text-black 
             font-semibold 
             shadow-md 
             hover:shadow-lg 
             transition-all 
             duration-200 
             rounded-xl 
             px-4"
        >
          <IconPlus className="h-4 w-4 mr-1" />
          Add QR
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading QR codes...</p>
          </div>
        </div>
      ) : qrCodes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <IconQrcode className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium">No QR codes yet</h3>
            <p className="text-sm text-muted-foreground">
              Click the Add button to generate your first QR codes.
            </p>
          </div>
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            <IconPlus className="h-4 w-4" />
            Generate QR Codes
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {qrCodes.map((qr, index) => (
            <QrCodeCard
              key={qr._id}
              index={index + 1}
              value={qr?.qrLink}
              image={qr?.qrImage}
              isActive={qr?.isActive}
            />
          ))}
        </div>
      )}

      <QrGenerateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onGenerate={handleGenerate}
        loading={generating}
      />
    </>
  )
}
