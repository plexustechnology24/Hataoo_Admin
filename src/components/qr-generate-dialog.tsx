import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface QrGenerateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (count: number) => void
  loading: boolean
}

interface FormValues {
  count: number
}

export function QrGenerateDialog({
  open,
  onOpenChange,
  onGenerate,
  loading
}: QrGenerateDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { count: 1 },
  })

  function onSubmit(data: FormValues) {
    onGenerate(Number(data.count))
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black">
            Generate QR Codes
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter the number of QR codes you want to generate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label htmlFor="count" className="font-medium">
              Number of QR Codes
            </Label>

            <Input
              id="count"
              type="number"
              placeholder="Enter number"
              disabled={loading}
              className="rounded-xl focus-visible:ring-0 outline-none focus-visible:ring-offset-0"
              {...register("count", {
                required: "This field is required",
                min: { value: 1, message: "Minimum value is 1" },
                max: { value: 50, message: "Maximum value is 50" },
              })}
            />

            {errors.count && (
              <p className="text-sm text-red-500">
                {errors.count.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-1 sm:justify-end">
            {/* Cancel Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl border-yellow-500 text-yellow-700 hover:bg-yellow-50"
            >
              Cancel
            </Button>

            {/* Generate Button */}
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl 
                     bg-yellow-500 
                     hover:bg-yellow-600 
                     text-black 
                     font-semibold 
                     shadow-md 
                     hover:shadow-lg 
                     transition-all 
                     duration-200"
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
