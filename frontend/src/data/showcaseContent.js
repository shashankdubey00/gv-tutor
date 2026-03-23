import quietZonesImg from "../assets/quiet zones.jpeg";
import goodwillCoachingImg from "../assets/goodwillcoaching.jpeg";
import goodwillCoachingThreeImg from "../assets/goodwiilcoachig3.jpeg";
import goodwillCoachingFourImg from "../assets/goodwillcoaching4.jpeg";
import goodwillCoachingVideo from "../assets/goodwillcoachingvideo.mp4";
import collaborativeTablesImg from "../assets/photogood.jpeg";
import photoGoodOne from "../assets/photogood1.jpeg";
import photoGoodTwo from "../assets/photogood2.jpeg";
import photoGoodThree from "../assets/photogood3.jpeg";
import premiumGroupImg from "../assets/WhatsApp Image 2026-02-12 at 4.41.12 PM.jpeg";
import individualPodsImg from "../assets/individual pods.jpeg";
import individualImg from "../assets/individual.jpeg";
import individualPodsNewImg from "../assets/individual-pods-new.jpeg";
import individualTwoImg from "../assets/individual2.jpeg";
import homeTutorVideo from "../assets/libraryfirstvideo1.mp4";
import librarySecondSixImg from "../assets/librarysecond6.jpeg";
import librarySecondOneImg from "../assets/librarysecond1.jpeg";
import librarySecondFiveImg from "../assets/librarysecond5.jpeg";
import librarySecondVideoOne from "../assets/librarysecondvideo1.mp4";
import librarySecondVideoThree from "../assets/librarysecondvideo3.mp4";

export const aboutShowcases = [
  {
    slug: "home-tutor",
    eyebrow: "Goodwill Home Tutor",
    tag: "Personalized Learning",
    title: "Home tutoring with a premium, one-to-one support experience.",
    subtitle:
      "A dedicated page for parents and students to understand how Goodwill Home Tutor works, what kind of support it provides, and why it fits focused academic improvement.",
    image: individualPodsNewImg,
    imageDesktop: individualTwoImg,
    accent: "from-cyan-400 via-blue-500 to-violet-500",
    summary:
      "Designed for students who learn best with personal attention, flexible timing, and a tutor matched to their academic needs.",
    previewPoints: ["Verified tutors", "Flexible schedules", "At-home learning support"],
    metrics: [
      { label: "Ideal for", value: "1:1 guidance" },
      { label: "Focus", value: "Concept clarity" },
      { label: "Format", value: "Individual plans" }
    ],
    heroPoints: [
      "Personal tutor matching based on class, subject, and area",
      "Useful for school support, boards, revision, and concept recovery",
      "More accountability for families who want regular academic continuity"
    ],
    sections: [
      {
        heading: "What this service is built for",
        content:
          "Goodwill Home Tutor is best for students who want strong subject understanding in a familiar environment. It is especially useful when a learner needs more attention than a batch setting can realistically provide."
      },
      {
        heading: "How it helps students improve",
        content:
          "The page structure now gives you space to explain learning style, scheduling flexibility, revision support, and the way tutors adapt to each student’s speed and weak areas."
      },
      {
        heading: "Why parents trust this format",
        content:
          "This detail view can also highlight convenience, safety, communication, and the confidence that comes from a more direct, personalized academic relationship."
      }
    ],
    gallery: [individualPodsNewImg, individualImg, individualTwoImg],
    videoTitle: "How Goodwill Home Tutor Supports Daily Learning",
    videoDescription:
      "This video shows our real home tutoring approach: tutor-student matching, concept-focused teaching, chapter-wise planning, regular revision, and parent updates that help students improve consistently.",
    videoUrl: "",
    videoFile: homeTutorVideo,
    featureCards: [
      {
        title: "Personal Fit",
        description: "Clearer matching between student need, subject difficulty, and tutor style."
      },
      {
        title: "Flexible Routine",
        description: "A structure that works for school-going students, exam seasons, and family schedules."
      },
      {
        title: "Focused Outcomes",
        description: "Ideal when improvement depends on consistency, repetition, and individualized attention."
      }
    ]
  },
  {
    slug: "coaching",
    eyebrow: "Goodwill Coaching",
    tag: "Structured Preparation",
    title: "A more disciplined coaching setup for students who grow with routine and momentum.",
    subtitle:
      "This page gives Goodwill Coaching its own identity, so students can immediately understand the classroom-style structure, revision rhythm, and guided preparation benefits.",
    image: goodwillCoachingImg,
    accent: "from-fuchsia-400 via-violet-500 to-cyan-500",
    summary:
      "Built for learners who benefit from a stronger system, a more scheduled academic flow, and a coaching environment with repeat practice.",
    previewPoints: ["Small batches", "Revision support", "Guided progress"],
    metrics: [
      { label: "Ideal for", value: "Routine learners" },
      { label: "Focus", value: "Consistent prep" },
      { label: "Format", value: "Guided sessions" }
    ],
    heroPoints: [
      "Useful for students who perform better with a regular study rhythm",
      "Supports repeat practice, doubt sessions, and exam discipline",
      "A clear option for learners who want classroom-like energy and momentum"
    ],
    sections: [
      {
        heading: "What makes it different from home tutoring",
        content:
          "Goodwill Coaching is a better fit when a student needs a more structured learning pattern, stronger weekly discipline, and the motivational benefit of a formal guided setup."
      },
      {
        heading: "How our coaching system works",
        content:
          "Students follow a fixed weekly schedule with chapter-wise targets, daily practice questions, and regular doubt-solving sessions. Faculty track progress through revision checkpoints so learning stays consistent and exam-ready."
      },
      {
        heading: "What students and parents can expect",
        content:
          "Parents receive clear updates on attendance, syllabus completion, and test performance. Students get disciplined preparation, guided practice, and a supportive classroom environment that builds confidence before school and board exams."
      }
    ],
    gallery: [goodwillCoachingImg, goodwillCoachingThreeImg, goodwillCoachingFourImg],
    videoTitle: "Coaching environment highlight",
    videoDescription:
      "This section can showcase a coaching session, a student experience clip, or a short overview of the classroom process and daily structure.",
    videoUrl: "",
    videoFile: goodwillCoachingVideo,
    featureCards: [
      {
        title: "Clear Routine",
        description: "Great for students who need stronger academic momentum and a timetable-based flow."
      },
      {
        title: "Practice Driven",
        description: "Supports repetition, monitoring, and preparation through guided sessions."
      },
      {
        title: "Shared Energy",
        description: "Works well for students who stay motivated in a more active study environment."
      }
    ]
  }
];

export const libraryShowcases = [
  {
    slug: "jk-road",
    eyebrow: "GV Library JK Road",
    address: "Sagar green state near sagar college, Aayodhya bypass, Bhopal",
    tag: "Study Zone",
    title: "A calm, premium study branch designed for long, distraction-free study sessions.",
    subtitle:
      "JK Road branch supports students who need a disciplined environment for self-study, revisions, and exam-focused consistency.",
    image: quietZonesImg,
    accent: "from-cyan-400 via-sky-500 to-emerald-500",
    summary:
      "Built for disciplined learners who want a quiet, routine-friendly, distraction-free environment for reading, revision, and exam preparation.",
    previewPoints: ["Silent seating", "Focused environment", "Long study sessions"],
    metrics: [
      { label: "Timing", value: "Open 24/7" },
      { label: "Best for", value: "Board + competitive prep" },
      { label: "Habitat", value: "Silent study zone" }
    ],
    heroPoints: [
      "Suitable for students preparing for exams or long reading sessions",
      "Supports a calm routine where consistency matters more than noise",
      "Can be presented as the serious-focus branch in your library network"
    ],
    sections: [
      {
        heading: "Why this branch stands out",
        content:
          "JK Road is focused on silent productivity. Students choose this branch when they need uninterrupted study hours, dependable seating, and a serious preparation atmosphere."
      },
      {
        heading: "What visitors should feel",
        content:
          "The branch is built to feel clean, secure, and study-first. From entry to seating, the goal is to keep learners comfortable and mentally locked in."
      },
      {
        heading: "How this supports your brand",
        content:
          "A strong JK Road page shows GV Library as a quality-led study network, helping students and parents trust the experience before they even visit."
      }
    ],
    gallery: [quietZonesImg, photoGoodOne, individualPodsImg],
    videoTitle: "Branch walkthrough",
    videoDescription:
      "Add a branch walkthrough video here to show seating layout, lighting, discipline, and the overall study atmosphere at JK Road.",
    videoUrl: "",
    videoFile: librarySecondVideoThree,
    featureCards: [
      {
        title: "Quiet Zones",
        description: "A layout designed for concentration, reading, and repeat study sessions."
      },
      {
        title: "Routine Friendly",
        description: "Built for students who value consistency and want a dependable study destination."
      },
      {
        title: "Premium Feel",
        description: "The branch can be presented with a stronger visual identity instead of a simple listing."
      }
    ]
  },
  {
    slug: "gv-library-second-branch",
    eyebrow: "GV Library Second Branch",
    address: "Chhatrapati nagar, Narela jod, Bhopal",
    tag: "Study Zone",
    title: "A dedicated second branch with its own environment, identity, and student routine.",
    subtitle:
      "The second branch is designed for students who need the same GV discipline in a location that is closer and more convenient for their daily schedule.",
    image: librarySecondSixImg,
    accent: "from-amber-400 via-orange-500 to-fuchsia-500",
    summary:
      "Use this as the dedicated destination for your second location, so both library branches feel distinct while still belonging to one GV system.",
    previewPoints: ["Separate identity", "Future-ready content", "Branch-specific story"],
    metrics: [
      { label: "Timing", value: "Open 24/7" },
      { label: "Best for", value: "Self-study + revisions" },
      { label: "Habitat", value: "Calm and disciplined" }
    ],
    heroPoints: [
      "A separate branch page improves clarity when you have multiple study locations",
      "You can add local photos, timings, and branch-specific advantages here later",
      "This keeps your library experience scalable as the network grows"
    ],
    sections: [
      {
        heading: "Why this should be a separate page",
        content:
          "Students usually choose nearby study spaces. A dedicated branch page helps local students quickly understand timing, atmosphere, and branch fit without confusion."
      },
      {
        heading: "How this page will evolve",
        content:
          "This branch page can include real seating visuals, study rules, daily occupancy patterns, and practical details that help students join faster."
      },
      {
        heading: "What stays consistent",
        content:
          "Even with branch-level differences, both GV locations maintain the same core values: discipline, comfort, and focused study continuity."
      }
    ],
    gallery: [librarySecondOneImg, librarySecondFiveImg, librarySecondSixImg],
    videoTitle: "Second branch intro video",
    videoDescription:
      "Use this section for a new-branch announcement, seating tour, or branch-specific promotion video once you are ready.",
    videoUrl: "",
    videoFile: librarySecondVideoOne,
    featureCards: [
      {
        title: "Branch Identity",
        description: "Lets users understand this location as its own destination instead of just an extra address."
      },
      {
        title: "Scalable Design",
        description: "Structured so you can keep adding new media, testimonials, or offers without redesign work."
      },
      {
        title: "Location Marketing",
        description: "Useful for local promotion when students search for a nearby study-friendly option."
      }
    ]
  },
  {
    slug: "co-working-space",
    eyebrow: "GV Co-Working Space",
    address: "Sagar green state near sagar college, Aayodhya bypass, Bhopal",
    tag: "Work Zone",
    title: "A focused co-working setup for creators, freelancers, and serious learners.",
    subtitle:
      "This space blends calm productivity with professional comfort, ideal for remote work, project sessions, and long deep-focus blocks.",
    image: collaborativeTablesImg,
    accent: "from-emerald-400 via-cyan-500 to-blue-500",
    summary:
      "Built for people who need reliable Wi-Fi, productive seating, and a disciplined environment for work, meetings, and focused execution.",
    previewPoints: ["Deep-focus desks", "Work-friendly setup", "Professional atmosphere"],
    metrics: [
      { label: "Timing", value: "Open 24/7" },
      { label: "Best for", value: "Remote workers + students" },
      { label: "Habitat", value: "Professional work zone" }
    ],
    heroPoints: [
      "Suitable for freelancers, remote workers, and students with project deadlines",
      "Supports independent work, planning sessions, and long concentration blocks",
      "A practical environment for people who need consistent daily output"
    ],
    sections: [
      {
        heading: "Who should use this space",
        content:
          "This co-working setup is ideal for freelancers, online professionals, startup teams, and students preparing project deliverables in a stable environment."
      },
      {
        heading: "How it improves productivity",
        content:
          "A distraction-light workspace, comfortable seating, and routine-friendly hours help users maintain focus and complete meaningful work every day."
      },
      {
        heading: "Why it complements the GV ecosystem",
        content:
          "Alongside library services, the co-working space expands GV into a broader productivity destination for both academic and professional audiences."
      }
    ],
    gallery: [collaborativeTablesImg, photoGoodTwo, photoGoodThree],
    videoTitle: "Co-working space walkthrough",
    videoDescription:
      "A short walkthrough can highlight seating layout, work zones, and the overall environment for focused professional sessions.",
    videoUrl: "",
    featureCards: [
      {
        title: "Professional Setup",
        description: "Designed for daily output with practical seating and work-friendly discipline."
      },
      {
        title: "Focus-First Environment",
        description: "Ideal for users who need consistency, low distraction, and deep concentration."
      },
      {
        title: "Flexible Use Case",
        description: "Works for remote work, assignments, planning sessions, and long execution blocks."
      }
    ]
  }
];
