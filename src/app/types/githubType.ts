  export interface GitHubRepository {
    owner: string;
    name: string;
    html_url: string;
    exists: boolean;
    url:any;
  }
  export interface GitHubRepoPreferences {
    useOrganization: boolean;
    isPrivate: boolean;
  }
  
