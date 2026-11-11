// Chapter content that isn't in Supabase yet.
// Each block here is a candidate for its own table later, the same
// way the eboard moved into the `eboard` table. Until then, edit here.

export const chapter = {
  name: 'Girls Who Code',
  school: 'Rutgers University–Newark',
  location: 'Newark, NJ',
  tagline:
    'A community inclusive to all, we welcome you right here in the center of Newark.',
  activities: ['Workshops', 'Mentorship', 'Sisterhood'],
  // Links. Empty strings render as disabled buttons instead of dead links.
  instagramUrl: '',
  hqUrl: 'https://girlswhocode.com',
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
