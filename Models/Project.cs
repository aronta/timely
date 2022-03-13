using System.ComponentModel.DataAnnotations;

namespace timely.Models;

public record Project {
    public long id { get; set;}
    public string? name {get;set;}
    [Required]
    public DateTime start_time {get;set;}
    public DateTime? end_time {get;set;}
}