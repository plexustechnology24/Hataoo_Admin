import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { QrGenerateDialog } from "@/components/qr-generate-dialog";
import { QrCodeCard } from "@/components/qr-code-card";
import { generateQrCodes, getAllQrCodes } from "@/api/qrCodeApi";
import { EmptyState } from "@/components/empty-data";
import { toast } from "sonner";

export function QrCodesPage() {
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);

  // Handle online/offline events dynamically
  useEffect(() => {
    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // Fetch All QR Codes
  const fetchQrs = async () => {
    if (!navigator.onLine) {
      setOffline(true);
      return;
    }

    setOffline(false);
    setError(false);
    try {
      setLoading(true);
      const data = await getAllQrCodes();
      const transformedData = data.map((item) => ({
        id: item._id,
        qrLink: item.qrLink,
        qrImage: item.qrImage,
        isActive: item.isActive,
      }));
      setQrCodes(transformedData);
    } catch (err: any) {
      if (!window.navigator.onLine) {
        setOffline(true);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrs();
  }, []);

  const handleGenerate = async (count: number) => {
    if (!navigator.onLine) return;

    try {
      setGenerating(true);
      await generateQrCodes(count);
      await fetchQrs();
      setDialogOpen(false);
      toast.success(`${count} QR code(s) generated successfully!`);
    } catch (error) {
      console.error("Failed to generate QR codes", error);
      toast.error("Failed to generate QR codes");
    } finally {
      setGenerating(false);
    }
  };

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
          className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-4"
        >
          <IconPlus className="h-4 w-4 mr-1" />
          Add QR
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState type="loading" message="Loading QR codes..." />
        </div>
      ) : offline ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState type="offline" message="You are offline. Please check your connection." />
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState type="error" message="No QR codes found." />
        </div>
      ) : qrCodes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <EmptyState type="empty" message="No QR codes yet. Click Add to generate." />
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            <IconPlus className="h-4 w-4" />
            Generate QR Codes
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-4">
          {qrCodes.map((qr, index) => (
            <QrCodeCard
              key={qr.id}
              index={index + 1}
              value={qr.qrLink}
              image={qr.qrImage}
              isActive={qr.isActive}
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
  );
}