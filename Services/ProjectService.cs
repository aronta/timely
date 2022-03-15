using Microsoft.EntityFrameworkCore;
using timely.Models;
using timely.Data;

namespace timely.Services;

public interface IProjectService {
    Task<ProjectPaginated> getAllProjects(int? page, int? limit);
    Task<bool> startTimer();
    Task<bool> stopTimer(string name);
    Task<bool> edit(long id, string name);
    Task<bool> delete(long id);
    Task<bool> deleteAll();
} 

public class ProjectService : IProjectService {

    private TimelyDb _timelyDb;
    public ProjectService(TimelyDb timelyDb)
    {
        _timelyDb = timelyDb;
    }

    private Project? getActiveProject() {
        return _timelyDb.Project.Where(project => project.end_time == null).FirstOrDefault();
    }

    public async Task<ProjectPaginated> getAllProjects(int? page, int? limit)
    {   
        ProjectPaginated response;

        if ( page.HasValue ) {
            int pageResults = limit.HasValue ? (int) limit : 20; 
            int pageCount = (int) Math.Ceiling(_timelyDb.Project.Count() / (float) pageResults);

            var projects = await _timelyDb.Project.OrderByDescending(project => project.start_time).Skip(((int)page-1) * pageResults)
                                            .Take((int)pageResults)
                                            .ToListAsync();

            response = new ProjectPaginated {
                Projects = projects,
                CurrentPage = (int) page,
                Pages = pageCount,
                perPage = pageResults

            };

        } else {
            var projects = await _timelyDb.Project.OrderByDescending(project => project.start_time).ToListAsync();
            response = new ProjectPaginated {
                Projects = projects,
                CurrentPage = 1,
                Pages = 1,
                perPage = projects.Count()
            };
        }

        return response;
    }

    public async Task<bool> startTimer(){
        if (this.getActiveProject() != null) return false;

        var project = new Project {
            start_time=DateTime.UtcNow
        };

        _timelyDb.Project.Add(project);
        return Convert.ToBoolean(await _timelyDb.SaveChangesAsync());
    }

    public async Task<bool> stopTimer(string name){
        var project = this.getActiveProject();
        if (project == null) return false;

        project.name = name;
        project.end_time = DateTime.UtcNow;


        _timelyDb.Project.Update(project);
        return Convert.ToBoolean(await _timelyDb.SaveChangesAsync());
    }

    public async Task<bool> edit(long id, string name) {
        var project = _timelyDb.Project.Find(id);
        if (project == null) {
            return false;
        }

        project.name = name;
        _timelyDb.Project.Update(project);
        return Convert.ToBoolean(await _timelyDb.SaveChangesAsync());
    }

    public async Task<bool> delete(long id) {
        var project = _timelyDb.Project.Find(id);
        if (project == null) {
            return false;
        }

        _timelyDb.Project.Remove(project);
        return Convert.ToBoolean(await _timelyDb.SaveChangesAsync());
    }

    public async Task<bool> deleteAll() {
        var all = from c in _timelyDb.Project select c;
        _timelyDb.Project.RemoveRange(all);

        return Convert.ToBoolean(await _timelyDb.SaveChangesAsync());
    }

}