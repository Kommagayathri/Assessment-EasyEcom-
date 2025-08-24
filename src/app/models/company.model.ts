export interface SkillInfo {
  skillName: string;
  skillRating: number;
}

export interface EducationInfo {
  instituteName: string;
  courseName: string;
  completedYear: string;
}

export interface EmployeeInfo {
  empName: string;
  designation: string;
  joinDate: string;
  email: string;
  phoneNumber: string;
  skillInfo: SkillInfo[];
  educationInfo: EducationInfo[];
}

export interface Company {
  id?: string;
  companyName: string;
  address: string;
  email: string;
  phoneNumber: string;
  empInfo: EmployeeInfo[];
  createdAt?: Date;
}

export const DESIGNATIONS = [
  { value: '1', label: 'Developer' },
  { value: '2', label: 'Manager' },
  { value: '3', label: 'System Admin' },
  { value: '4', label: 'Team Lead' },
  { value: '5', label: 'PM' }
];

export const SKILLS = [
  'Java', 'Angular', 'CSS', 'HTML', 'JavaScript', 'UI', 'SQL', 'React', 
  'PHP', 'GIT', 'AWS', 'Python', 'Django', 'C', 'C++', 'C#', 'Unity', 
  'R', 'AI', 'NLP', 'Photoshop', 'Node.js'
];