import styles from './Apps.module.css'
import { TextFileIcon } from '../os/icons'
import { deletedFiles } from '@/lib/content'

export default function RecycleApp() {
  return (
    <div className={styles.pane}>
      <p>{deletedFiles.length} items. Deleted for good, and they&apos;re not coming back.</p>
      <ul className={styles.fileList}>
        {deletedFiles.map((f) => (
          <li key={f}><TextFileIcon size={20} /> <s>{f}</s></li>
        ))}
      </ul>
    </div>
  )
}
