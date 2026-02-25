import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { QrGenerateDialog } from "@/components/qr-generate-dialog";
import { QrCodeCard } from "@/components/qr-code-card";
import { deleteQrCode, generateQrCodes, getAllQrCodes, getQrCodeById } from "@/api/qrCodeApi";
import { EmptyState } from "@/components/empty-data";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { QrDetailsDialog } from "@/components/qr-details-dialog";

export function QrCodesPage() {
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id?: string }>({ open: false });
  const [infoModal, setInfoModal] = useState<{ open: boolean; data?: any }>({ open: false });

  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

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
  const fetchQrs = async (currentPage = 1) => {
    if (!navigator.onLine) {
      setOffline(true);
      return;
    }

    setOffline(false);
    setError(false);
    try {
      setLoading(true);
      const data = await getAllQrCodes({ page: currentPage, limit });
      const transformedData = data?.data?.map((item) => ({
        id: item._id,
        qrLink: item.qrLink,
        qrImage: item.qrImage,
        isActive: item.isActive,
        code: item.code,
      }));      
      setQrCodes(transformedData);
      setTotalPages(data.meta.pages || 1);
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
    fetchQrs(page);
  }, [page]);

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

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteQrCode(deleteModal.id);
      toast.success("QR code deleted successfully!");
      fetchQrs(page);
      setDeleteModal({ open: false });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete QR code");
    }
  };

  const handleInfo = async (code: string, isActive?: boolean) => {
    if (!isActive) {
      toast.info("Activate QR code to see details.");
      return;
    }

    try {
      const data: any = await getQrCodeById(code);
      setInfoModal({ open: true, data: data?.data });
    } catch (err) {
      toast.error("Failed to fetch QR code details");
    }
  };  

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
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

        <div className="flex-1 overflow-y-auto pb-4 scrollbar-custom">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <EmptyState type="loading" message="Loading QR codes..." />
            </div>
          ) : offline ? (
            <div className="flex items-center justify-center h-full">
              <EmptyState type="offline" message="You are offline. Please check your connection." />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <EmptyState type="error" message="No QR codes found." />
            </div>
          ) : qrCodes?.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 h-full">
              <EmptyState type="empty" message="No QR codes yet. Click Add to generate." />
              <Button variant="outline" onClick={() => setDialogOpen(true)}>
                <IconPlus className="h-4 w-4" />
                Generate QR Codes
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pr-4">
              {qrCodes.map((qr, index) => (
                <QrCodeCard
                  key={qr.id}
                  index={index + 1}
                  value={qr.qrLink}
                  image={qr.qrImage}
                  isActive={qr.isActive}
                  onDelete={() => setDeleteModal({ open: true, id: qr.id })}
                  onInfo={() => handleInfo(qr.code, qr.isActive)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination - Full Width Bottom */}
        {!loading && !offline && !error && qrCodes?.length > 0 && (
          <div className="w-full border-t bg-background mt-0">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <QrGenerateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onGenerate={handleGenerate}
        loading={generating}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.open} onOpenChange={() => setDeleteModal({ open: false })}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader className="mb-3">
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>Are you sure you want to delete this QR code?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-1">
            <Button variant="outline" className="rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200" onClick={() => setDeleteModal({ open: false })}>
              Cancel
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200" onClick={() => handleDelete()}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Modal */}
      <QrDetailsDialog
        open={infoModal.open}
        onOpenChange={(open: any) => setInfoModal({ open })}
        data={infoModal?.data}
      />
    </>
  );
}