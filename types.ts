export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
}

export interface Schedule {
  id: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'Virtual' | 'Classroom';
  status: 'Open' | 'Guaranteed' | 'Limited' | 'Sold Out';
}

export interface CourseModule {
  title: string;
  duration: string;
  topics: string[];
}

export interface CourseDay {
  dayTitle: string;
  modules: CourseModule[];
}

export interface ReviewStats {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface Review {
  id: string;
  author: string;
  role: string;
  date: string;
  rating: number;
  text: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  category: 'Data Center' | 'Business Continuity' | 'Cybersecurity' | 'Corporate';
  level: 'Beginner' | 'Intermediate' | 'Expert';
  duration: string;
  overview: string;
  audience: string[];
  objectives: string[];
  prerequisites: string[];
  instructor: Instructor;
  schedules: Schedule[];
  price: number;
  
  // New fields for enhanced detail page
  curriculum: CourseDay[];
  reviewStats: ReviewStats;
  reviews: Review[];
  relatedCourseIds: string[];
}

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}