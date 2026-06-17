// Mock database store for the Language-Lab application schemas

export const initialColleges = [
  {
    _id: "col1",
    college_name: "ABC College of Engineering",
    college_code: "ABCCE",
    logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=60",
    address: "123 University Road, West Campus",
    email: "admin@abcce.edu",
    phone: "+1 555-0199",
    website: "https://abcce.edu",
    created_by: "superadmin_1",
    teachers: ["teach1", "teach2"],
    license_id: "lic1",
    max_students: 500,
    is_active: true,
  },
  {
    _id: "col2",
    college_name: "XYZ Institute of Technology",
    college_code: "XYZIT",
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=120&auto=format&fit=crop&q=60",
    address: "456 Tech Boulevard, East Wing",
    email: "contact@xyzit.edu",
    phone: "+1 555-0188",
    website: "https://xyzit.edu",
    created_by: "superadmin_1",
    teachers: ["teach3"],
    license_id: "lic2",
    max_students: 300,
    is_active: true,
  }
];

export const initialTeachers = [
  {
    _id: "teach1",
    full_name: "Dr. Sarah Jenkins",
    email: "sarah.j@abcce.edu",
    role: "teacher",
    phone: "+1 555-0144",
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=60",
    created_by: "superadmin_1",
    assigned_colleges: ["col1"],
    is_active: true,
    status: "active",
  },
  {
    _id: "teach2",
    full_name: "Prof. Michael Floyd",
    email: "m.floyd@abcce.edu",
    role: "teacher",
    phone: "+1 555-0122",
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=60",
    created_by: "superadmin_1",
    assigned_colleges: ["col1", "col2"],
    is_active: true,
    status: "active",
  }
];

export const initialLicenses = [
  {
    _id: "lic1",
    license_key: "LL-HMAC-SHA256-ABC123XYZ789KEY",
    license_code: "LIC-ABCCE-2026",
    college_id: "col1",
    purchased_by: "superadmin_1",
    total_seats: 150,
    active_sessions: 42,
    start_date: "2026-01-01",
    expiry_date: "2027-01-01",
    duration: 365,
    status: "active",
    llm_metadata: {
      model_used: "Gemini Pro",
      llm_used: true,
      time_ms: 245,
      key_pattern: "HMAC_SIGNED_KEY",
      signature: "0x8fa2...23fe"
    }
  },
  {
    _id: "lic2",
    license_key: "LL-HMAC-SHA256-XYZ987ABC321KEY",
    license_code: "LIC-XYZIT-2026",
    college_id: "col2",
    purchased_by: "superadmin_1",
    total_seats: 5,
    active_sessions: 5,
    start_date: "2026-03-15",
    expiry_date: "2027-03-15",
    duration: 365,
    status: "active",
    llm_metadata: {
      model_used: "Llama 3 70B",
      llm_used: true,
      time_ms: 512,
      key_pattern: "HMAC_SIGNED_KEY",
      signature: "0xab12...cdef"
    }
  }
];

export const initialStudents = [
  {
    _id: "stud1",
    full_name: "Alice Cooper",
    email: "alice.cooper@abcce.edu",
    role: "student",
    phone: "+1 555-0901",
    profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=60",
    college_id: "col1",
    roll_no: "CS-2026-001",
    enrollment_no: "ENR-998877",
    batch: "2026",
    course: "Computer Science",
    year: 3,
    license_id: "lic1",
    is_active: true,
    status: "active",
  },
  {
    _id: "stud2",
    full_name: "Bob Dylan",
    email: "bob.dylan@abcce.edu",
    role: "student",
    phone: "+1 555-0902",
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=60",
    college_id: "col1",
    roll_no: "CS-2026-002",
    enrollment_no: "ENR-998878",
    batch: "2026",
    course: "Computer Science",
    year: 3,
    license_id: "lic1",
    is_active: true,
    status: "active",
  }
];

export const initialTopics = [
  {
    _id: "topic1",
    title: "Basic Phonetics & Pronunciation",
    description: "Master English speech sounds, IPA notations, and native word stresses.",
    order: 1,
    created_by: "teach1",
    is_active: true,
  },
  {
    _id: "topic2",
    title: "Advanced Business Communication",
    description: "Professional emails, mock presentation guidelines, and client negotiation tactics.",
    order: 2,
    created_by: "teach2",
    is_active: true,
  }
];

export const initialSubTopics = [
  {
    _id: "sub1",
    topic_id: "topic1",
    title: "Vowel Sounds & Diphthongs",
    description: "Deep dive into front vowels, back vowels, and gliding diphthong sounds.",
    order: 1,
    created_by: "teach1",
    is_active: true,
  },
  {
    _id: "sub2",
    topic_id: "topic1",
    title: "Consonant Voicing",
    description: "Distinguishing voiced and unvoiced dental/labial plosives.",
    order: 2,
    created_by: "teach1",
    is_active: true,
  }
];

export const initialActiveSessions = [
  {
    _id: "sess1",
    student_id: { _id: "stud1", full_name: "Alice Cooper", email: "alice.cooper@abcce.edu" },
    license_id: "lic1",
    college_id: { _id: "col1", college_name: "ABC College of Engineering" },
    token: "jwt_token_123...",
    logged_in_at: "2026-06-16T22:00:00.000Z",
    expires_at: "2026-06-17T06:00:00.000Z",
    is_active: true
  },
  {
    _id: "sess2",
    student_id: { _id: "stud2", full_name: "Bob Dylan", email: "bob.dylan@abcce.edu" },
    license_id: "lic1",
    college_id: { _id: "col1", college_name: "ABC College of Engineering" },
    token: "jwt_token_456...",
    logged_in_at: "2026-06-16T23:10:00.000Z",
    expires_at: "2026-06-17T07:10:00.000Z",
    is_active: true
  }
];

export const initialActivityLogs = [
  {
    _id: "log1",
    student_id: "stud1",
    college_id: "col1",
    topic_id: "topic1",
    sub_topic_id: "sub1",
    module_type: "audio",
    activity_type: "audio_play",
    progress_percent: 10,
    timestamp_in_media: 15,
    time_spent_sec: 15,
    logged_at: "2026-06-16T23:30:00.000Z"
  },
  {
    _id: "log2",
    student_id: "stud2",
    college_id: "col1",
    topic_id: "topic1",
    sub_topic_id: "sub1",
    module_type: "exercise",
    activity_type: "exercise_submit",
    progress_percent: 100,
    time_spent_sec: 240,
    score: 8,
    max_score: 10,
    accuracy: 80,
    logged_at: "2026-06-16T23:35:00.000Z"
  }
];
