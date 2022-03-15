namespace timely.Models;

public class ProjectPaginated {
    public List<Project> Projects { get; set; } = new List<Project>();
    public int Pages { get; set; }
    public int CurrentPage { get; set; }
    public int perPage { get; set; }
}