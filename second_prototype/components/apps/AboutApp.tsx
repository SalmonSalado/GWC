import styles from './Apps.module.css'
import { chapter } from '@/lib/content'

export default function AboutApp() {
  return (
    <article className={styles.paper}>
      <section>
        <h3>{chapter.name} at {chapter.school}</h3>
        <p>{chapter.tagline}</p>
      </section>
      <section>
        <h3>What we do</h3>
        <ul>
          {chapter.activities.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </section>
    </article>
  )
}
