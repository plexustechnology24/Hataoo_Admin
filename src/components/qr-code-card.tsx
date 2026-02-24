import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { env } from "@/config/env"

interface QrCodeCardProps {
  index: number
  value: string
  image: string
  isActive?: boolean
}

export function QrCodeCard({ index, value, image, isActive }: QrCodeCardProps) {
  const imageUrl = `${env.BASE_API_URL}${image}`

  return (
    <Card className="flex flex-col items-center">
      <CardHeader className="flex pt-3 pb-0 items-center justify-between w-full">
        <h5 className="text-sm font-semibold">QR Code {index}</h5>
      </CardHeader>
      <CardContent className="flex items-center justify-center pb-2">
        <div className="rounded-lg border-0 bg-background">
          <img
            src={imageUrl}
            alt={`QR Code ${index}`}
            className="h-[140px] w-[140px] object-contain"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-center gap-2 pb-4">
        {isActive !== undefined && (
          <span
            className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-semibold 
        ${isActive
                ? "bg-green-50 text-green-700 border border-green-300"
                : "bg-yellow-50 text-yellow-700 border border-yellow-300"
              }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        )}

        {/* Clickable Link */}
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 underline break-all text-center"
        >
          {value}
        </a>
      </CardFooter>
    </Card>
  )
}