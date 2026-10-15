import styles from './Apps.module.css'
import ExternalButton from './ExternalButton'
import { chapter } from '@/lib/content'

export default function JoinApp() {
  return (
    <div className={styles.pane}>
      <h3>Join the chapter</h3>
      <p>
        Open to every Rutgers–Newark student, whatever your major and whether or not
        you&apos;ve written a line of code.
      </p>
      <h4>When we meet</h4>
      <p>{chapter.meetingInfo || 'Meeting times coming soon.'}</p>
      <div className={styles.actions}>
        <ExternalButton href={chapter.joinUrl} missing="Sign-up opens soon" primary>
          Sign up
        </ExternalButton>
        {chapter.instagramUrl && (
          <ExternalButton href={chapter.instagramUrl} missing="">Instagram</ExternalButton>
        )}
        <ExternalButton href={chapter.hqUrl} missing="">Girls Who Code HQ</ExternalButton>
      </div>
    </div>
  )
}
