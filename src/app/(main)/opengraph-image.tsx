import { GlobalOGImage } from '@/components/ui/GlobalOGImage'
import { generateOGImage } from '@/libs/metadata'

export default function HomeOGImage() {
  return generateOGImage(GlobalOGImage())
}
