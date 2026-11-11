import Image from 'next/image'
import styles from './Apps.module.css'
import { CameraIcon } from '../os/icons'
import { gallery } from '@/lib/content'

export default function CameraApp() {
  if (gallery.length === 0) {
    return (
      <div className={styles.pane}>
        <div className={styles.empty}>
          <CameraIcon size={64} />
          <p>Photos from chapter events will show up here after our first meetup.</p>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.pane}>
      <div className={styles.photos}>
        {gallery.map((p) => (
          <Image key={p.src} className={styles.photo} src={p.src} alt={p.alt} width={300} height={300} />
        ))}
      </div>
    </div>
  )
}
