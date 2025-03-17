export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Viewer";
  status: "Active" | "Inactive";
  dateJoined: string;
}
export interface ApiResponse<T> {
  data: T;
  status: string;
}

