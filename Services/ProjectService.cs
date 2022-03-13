using Microsoft.EntityFrameworkCore;
using timely.Models;
using timely.Data;

namespace timely.Services;

public interface IProjectService {
    Task<List<Project>> GetAllProjects();
    Task<bool> startTimer();
    Task<bool> stopTimer(string name);
    Task<bool> edit(long id, string name);
    Task<bool> delete(long id);
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

    public async Task<List<Project>> GetAllProjects()
    {   
        return await _timelyDb.Project.ToListAsync();
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

}