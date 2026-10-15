// Chapter content that isn't in Supabase yet.
// Each block here is a candidate for its own table later, the same
// way the eboard moved into the `eboard` table. Until then, edit here.

export const chapter = {
  name: 'Girls Who Code',
  school: 'Rutgers University–Newark',
  location: 'Newark, NJ',
  tagline:
    'A community inclusive to all, we welcome you right here in the center of Newark.',
  activities: ['Workshops', 'Hack nights', 'Mentorship', 'Sisterhood', 'Create Academy'],
  // e.g. 'Thursdays at 6pm, Engelhard Hall 110'. Leave empty to show "coming soon".
  meetingInfo: '',
  // Links. Empty strings render as disabled buttons instead of dead links.
  joinUrl: '',
  instagramUrl: '',
  hqUrl: 'https://girlswhocode.com',
}

export const hackathon = {
  name: 'HackRU',
  startsAt: '2026-10-17T09:00:00-04:00', // ← change me
  registerUrl: '',
}

export type GalleryPhoto = { src: string; alt: string }

// Put photos in /public/gallery and list them here, e.g.
// { src: '/gallery/kickoff.jpg', alt: 'Members at the fall kickoff' }
export const gallery: GalleryPhoto[] = []

// Easter egg: the recycle bin. Edit freely.
export const deletedFiles = [
  'imposter_syndrome.exe',
  'im_not_a_math_person.txt',
  'coding_is_for_boys.doc',
]
